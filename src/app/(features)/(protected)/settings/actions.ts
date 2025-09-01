'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { db } from '@/server/db'

function requireUserId(id?: string): asserts id is string {
	if (!id) throw new Error('Unauthorized')
}

// -------- Profile --------
const ProfileSchema = z.object({
	firstname: z.string().trim().min(1).max(60),
	lastname: z.string().trim().min(1).max(60),
	displayName: z.string().trim().min(1).max(60),
	username: z
		.string()
		.trim()
		.toLowerCase()
		.regex(/^[a-z0-9_\.]{3,20}$/),
	bio: z.string().trim().max(3000).optional().default(''),
	avatarUrl: z.string().url().optional().nullable().default(''),
})

export async function updateProfile(input: z.infer<typeof ProfileSchema>) {
	const session = await auth()
	requireUserId(session?.user?.id)

	const data = ProfileSchema.parse(input)

	// optional: enforce 1 username change rule in UI/DB (not shown here)
	const user = await db.user.update({
		where: { id: session.user.id },
		data: {
			username: data.username,
			displayName: data.displayName,
			bio: data.bio,
			image: data.avatarUrl,
			firstname: data.firstname,
			lastname: data.lastname,
		},
		select: { id: true, username: true },
	})

	revalidatePath(`/user/${user.id}`)
	return { success: true as const }
}

// -------- Account & Security --------
const ChangePasswordSchema = z.object({
	currentPassword: z.string().min(6),
	newPassword: z.string().min(8),
})

export async function changePassword(input: z.infer<typeof ChangePasswordSchema>) {
	const session = await auth()
	requireUserId(session?.user?.id)
	const { currentPassword, newPassword } = ChangePasswordSchema.parse(input)

	// Implement according to your auth strategy (NextAuth credentials / custom)
	// Example pseudo:
	// await verifyCurrentPassword(session.user.id, currentPassword)
	// await setPasswordHash(session.user.id, await hash(newPassword))

	return { success: true as const }
}

export async function signOutOtherSessions() {
	const session = await auth()
	requireUserId(session?.user?.id)
	// Implement per your session store (DB/Redis) — mark tokens invalid except current
	return { success: true as const }
}

export async function deleteAccount() {
	const session = await auth()
	requireUserId(session?.user?.id)

	await db.user.delete({ where: { id: session.user.id } })
	// Also: cascade deletes via Prisma relations; ensure onDelete set appropriately

	return { success: true as const }
}

// -------- Settings (Privacy/Notifications/Content/Appearance) --------
const SettingsSchema = z.object({
	// Privacy & Safety
	profileVisibility: z.enum(['PUBLIC', 'FOLLOWERS', 'PRIVATE']).optional(),
	allowComments: z.enum(['EVERYONE', 'FOLLOWERS', 'NOBODY']).optional(),
	blurNSFW: z.boolean().optional(),
	discoverableByEmail: z.boolean().optional(),

	// Notifications
	inAppNotifications: z.boolean().optional(),
	emailNotifications: z.boolean().optional(),
	notifyNewFollower: z.boolean().optional(),
	notifyMention: z.boolean().optional(),
	notifyComment: z.boolean().optional(),
	notifyLike: z.boolean().optional(),

	// Content & Feed
	feedStyle: z.enum(['FOLLOWING', 'LATEST', 'MIXED']).optional(),
	autoplayMedia: z.boolean().optional(),
	inlineLinkPreviews: z.boolean().optional(),

	// Appearance & Accessibility
	theme: z.enum(['light', 'dark', 'system']).optional(),
	density: z.enum(['COZY', 'COMPACT']).optional(),
	reduceMotion: z.boolean().optional(),
	feedDensity: z.enum(['ROWS', 'GRID']).optional(),
	echoLayout: z.enum(['FULL', 'COMPACT', 'SLIM', 'MINIMAL']).optional(),
})

export async function getSettings() {
	const session = await auth()
	requireUserId(session?.user?.id)

	const settings = await db.userSettings.upsert({
		where: { userId: session.user.id },
		update: {},
		create: { userId: session.user.id },
	})

	return { success: true as const, data: settings }
}

export async function updateSettings(input: z.infer<typeof SettingsSchema>) {
	const session = await auth()
	requireUserId(session?.user?.id)

	const patch = SettingsSchema.parse(input)

	const updated = await db.userSettings.update({
		where: { userId: session.user.id },
		data: patch,
	})

	// Revalidate any pages that read settings (theme/feed/profile)
	revalidatePath('/settings')
	return { success: true as const, data: updated }
}

export async function getUserProfileData() {
	const session = await auth()
	requireUserId(session?.user?.id)

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: {
			id: true,
			firstname: true,
			lastname: true,
			displayName: true,
			username: true,
			bio: true,
			image: true,
		},
	})

	return {
		success: true as const,
		data: {
			...user,
			avatar: user?.image,
		},
	}
}
