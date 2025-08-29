'use server'

import { auth } from '@/auth'
import { db } from '@/server/db'
import { revalidatePath } from 'next/cache'

export async function removeEchoFromChamber(echoIds: string[], chamberId: string) {
	const session = await auth()
	if (!session?.user?.id) {
		throw new Error('Unauthorized')
	}
	await db.chamber.update({
		where: { id: chamberId },
		data: {
			posts: {
				disconnect: echoIds.map(id => ({ id })),
			},
		},
	})
	revalidatePath(`/chambers/${chamberId}`)
}

/**
 * Toggle / set pin state.
 *
 * @param echoIdsInput one id or many; ignored when `all` is provided
 * @param chamberId chamber to operate on
 * @param all optional: "pin" | "unpin" | "toggle"
 *
 * - all="pin":    pins every echo in the chamber (no unpins)
 * - all="unpin":  unpins every echo in the chamber
 * - all="toggle": inverts pin state for every echo in the chamber
 * - all=undefined: toggles only the provided echoIds
 */
export async function pinEchoToChamber(
	echoIdsInput: string | string[],
	chamberId: string,
	all?: 'pin' | 'unpin' | 'toggle',
) {
	const session = await auth()
	if (!session?.user?.id) throw new Error('Unauthorized')

	// Helper: get all echo ids in this chamber
	const fetchChamberEchoIds = async () => {
		const rows = await db.post.findMany({
			where: {
				Chamber: {
					some: {
						id: chamberId,
					},
				},
			},
			select: { id: true },
		})
		return rows.map(r => r.id)
	}

	// Current pinned set for chamber
	const existingPins = await db.pinnedChamberEchoes.findMany({
		where: { chamberId },
		select: { echoId: true },
	})
	const existingSet = new Set(existingPins.map(p => p.echoId))

	let toPin: string[] = []
	let toUnpin: string[] = []

	if (all) {
		// Operate on ALL echoes in this chamber
		const allEchoIds = await fetchChamberEchoIds()
		const allSet = new Set(allEchoIds)

		if (all === 'pin') {
			// Ensure every echo is pinned
			toPin = allEchoIds.filter(id => !existingSet.has(id))
			toUnpin = []
		} else if (all === 'unpin') {
			// Remove all pins for this chamber
			toPin = []
			toUnpin = [...existingSet]
		} else {
			// all === "toggle" → invert everyone
			toPin = allEchoIds.filter(id => !existingSet.has(id))
			toUnpin = [...existingSet]
		}
	} else {
		// Default behavior: toggle only the provided ids
		const ids = (Array.isArray(echoIdsInput) ? echoIdsInput : [echoIdsInput])
			.map(s => s?.trim())
			.filter(Boolean)
		const uniqueIds = Array.from(new Set(ids))
		if (uniqueIds.length === 0) return { pinned: [], unpinned: [] }

		toUnpin = uniqueIds.filter(id => existingSet.has(id))
		toPin = uniqueIds.filter(id => !existingSet.has(id))
	}

	// Apply changes atomically
	await db.$transaction(async tx => {
		if (toUnpin.length) {
			await tx.pinnedChamberEchoes.deleteMany({
				where: { chamberId, echoId: { in: toUnpin } },
			})
		}
		if (toPin.length) {
			await tx.pinnedChamberEchoes.createMany({
				data: toPin.map(echoId => ({ chamberId, echoId })),
				skipDuplicates: true,
			})
		}
	})

	// Revalidate relevant pages
	revalidatePath(`/chambers/${chamberId}`)
	revalidatePath(`/chambers/${chamberId}/manage`)

	return { pinned: toPin, unpinned: toUnpin }
}
