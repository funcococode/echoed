'use server'

import { auth } from '@/auth'
import { db } from '@/server/db'
import { revalidatePath } from 'next/cache'

export async function removeMemberFromChamber(memberIds: string[], chamberId: string) {
	const session = await auth()
	if (!session?.user?.id) {
		throw new Error('Unauthorized')
	}
	await db.chamberMember.deleteMany({
		where: { chamberId, userId: { in: memberIds } },
	})
	revalidatePath(`/chambers/${chamberId}`)
}
