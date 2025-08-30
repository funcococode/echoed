'use server'

import { auth } from '@/auth'
import { db } from '@/server/db'
import { revalidatePath } from 'next/cache'

type ActionResponse<T = unknown> = {
	success: boolean
	message?: string
	data?: T | null
}

function assertAuth(userId?: string): asserts userId is string {
	if (!userId) {
		throw new Error('Unauthorized')
	}
}

/**
 * Follow a user (idempotent).
 */
export async function followUser(targetUserId: string): Promise<ActionResponse> {
	try {
		const session = await auth()
		assertAuth(session?.user?.id)
		const me = session.user.id

		if (me === targetUserId) {
			return { success: false, message: 'You cannot follow yourself.', data: null }
		}

		// Ensure target exists
		const target = await db.user.findUnique({ where: { id: targetUserId }, select: { id: true } })
		if (!target) return { success: false, message: 'User not found.', data: null }

		// Use a transaction to keep counters in sync
		await db.$transaction(async tx => {
			// Try to create the follow row; ignore if it already exists
			await tx.follow
				.create({
					data: {
						followerId: me,
						followingId: targetUserId,
					},
				})
				.catch(e => {
					// P2002: unique constraint violation -> already following, so we just exit early.
					if (e?.code !== 'P2002') throw e
				})

			// Increment counters only if a new row was created.
			// Approach: check existence atomically within the same tx.
			const exists = await tx.follow.findUnique({
				where: { followerId_followingId: { followerId: me, followingId: targetUserId } },
				select: { id: true },
			})

			// If exists, we still might have just created it or it already existed.
			// To avoid double increment, do a "conditional increment" using a row-level flag.
			// Simple approach: try increment and rely on earlier catch to avoid double-create.
			// Safer approach: count before/after — but that adds read ops.
			// We'll do a small trick: count rows for the pair created within this tx (at most 1).
			// If it existed before, the create() threw and we keep counters as-is.
			// To know if it existed before, re-check with a separate query that EXCLUDES current tx creation.
			// Simpler: optimistically increment; if create threw P2002, skip.
		})

		// Optimistic approach above needs a flag; simpler: do counts with upsert guard:
		// We’ll do two-step approach outside tx for clarity:
		// 1) Try create; if P2002, we’re done (already following).
		// 2) If success, run a tx that increments counters.
		// Rewriting with this clearer flow:
	} catch (e) {
		return { success: false, message: (e as Error).message, data: null }
	}

	try {
		const session = await auth()
		assertAuth(session?.user?.id)
		const me = session.user.id

		// Step 1: create follow row (idempotent via unique)
		let created = false
		try {
			await db.follow.create({
				data: { followerId: me, followingId: targetUserId },
			})
			created = true
		} catch (e) {
			if ((e as any)?.code !== 'P2002') throw e // real error
			created = false // already following
		}

		// Step 2: only if created, bump counters atomically
		if (created) {
			await db.$transaction([
				db.user.update({
					where: { id: me },
					data: { followingCount: { increment: 1 } },
				}),
				db.user.update({
					where: { id: targetUserId },
					data: { followersCount: { increment: 1 } },
				}),
			])
		}

		// Revalidate any paths that depend on this (adjust as needed)
		revalidatePath(`/user/${targetUserId}`)
		revalidatePath(`/user/${me}`)

		return {
			success: true,
			message: created ? 'Followed successfully.' : 'Already following.',
			data: { created },
		}
	} catch (e) {
		return { success: false, message: (e as Error).message, data: null }
	}
}

/**
 * Unfollow a user (idempotent).
 */
export async function unfollowUser(targetUserId: string): Promise<ActionResponse> {
	try {
		const session = await auth()
		assertAuth(session?.user?.id)
		const me = session.user.id

		const deleted = await db.follow.deleteMany({
			where: { followerId: me, followingId: targetUserId },
		})

		if (deleted.count > 0) {
			await db.$transaction([
				db.user.update({
					where: { id: me },
					data: { followingCount: { decrement: 1 } },
				}),
				db.user.update({
					where: { id: targetUserId },
					data: { followersCount: { decrement: 1 } },
				}),
			])
		}

		revalidatePath(`/user/${targetUserId}`)
		revalidatePath(`/user/${me}`)

		return {
			success: true,
			message: deleted.count > 0 ? 'Unfollowed successfully.' : 'You were not following.',
			data: { removed: deleted.count > 0 },
		}
	} catch (e) {
		return { success: false, message: (e as Error).message, data: null }
	}
}

/**
 * Toggle follow: follows if not following, otherwise unfollows.
 */
export async function toggleFollow(targetUserId: string): Promise<ActionResponse> {
	const session = await auth()
	assertAuth(session?.user?.id)
	const me = session.user.id

	const existing = await db.follow.findUnique({
		where: { followerId_followingId: { followerId: me, followingId: targetUserId } },
		select: { id: true },
	})

	if (existing) return unfollowUser(targetUserId)
	return followUser(targetUserId)
}

/**
 * Is the current user following target?
 */
export async function isFollowing(targetUserId: string): Promise<ActionResponse<{ isFollowing: boolean }>> {
	try {
		const session = await auth()
		assertAuth(session?.user?.id)
		const me = session.user.id

		const exists = await db.follow.findUnique({
			where: { followerId_followingId: { followerId: me, followingId: targetUserId } },
			select: { id: true },
		})

		return { success: true, data: { isFollowing: Boolean(exists) } }
	} catch (e) {
		return { success: false, message: (e as Error).message, data: null }
	}
}

/**
 * List followers of a user (who follows this user).
 */
export async function listFollowers(params: {
	userId: string
	take?: number // page size
	cursor?: { id: string } | null
}): Promise<
	ActionResponse<{
		items: Array<{ id: string; username: string | null; firstname: string | null; lastname: string | null }>
		nextCursor: { id: string } | null
	}>
> {
	const { userId, take = 20, cursor } = params
	try {
		const rows = await db.follow.findMany({
			where: { followingId: userId },
			take: take + 1,
			...(cursor ? { cursor, skip: 1 } : {}),
			orderBy: { id: 'asc' },
			select: {
				id: true,
				follower: { select: { id: true, username: true, firstname: true, lastname: true } },
			},
		})

		const hasNext = rows.length > take
		const items = rows.slice(0, take).map(r => r.follower)
		const nextCursor = hasNext ? { id: rows[take].id } : null

		return { success: true, data: { items, nextCursor } }
	} catch (e) {
		return { success: false, message: (e as Error).message, data: null }
	}
}

/**
 * List users that a user is following.
 */
export async function listFollowing(params: { userId: string; take?: number; cursor?: { id: string } | null }): Promise<
	ActionResponse<{
		items: Array<{ id: string; username: string | null; firstname: string | null; lastname: string | null }>
		nextCursor: { id: string } | null
	}>
> {
	const { userId, take = 20, cursor } = params
	try {
		const rows = await db.follow.findMany({
			where: { followerId: userId },
			take: take + 1,
			...(cursor ? { cursor, skip: 1 } : {}),
			orderBy: { id: 'asc' },
			select: {
				id: true,
				following: { select: { id: true, username: true, firstname: true, lastname: true } },
			},
		})

		const hasNext = rows.length > take
		const items = rows.slice(0, take).map(r => r.following)
		const nextCursor = hasNext ? { id: rows[take].id } : null

		return { success: true, data: { items, nextCursor } }
	} catch (e) {
		return { success: false, message: (e as Error).message, data: null }
	}
}
