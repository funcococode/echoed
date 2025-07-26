'use server'

import { auth } from '@/auth'
import { db } from '@/server/db'

export type ChamberType = ReturnType<typeof listChambers> extends Promise<infer T> ? T : never
export const listChambers = async () => {
	const response = await db.chamber.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			frequency: true,
		},
	})

	return response
}

export const createChamber = async (name: string, description: string) => {
	const session = await auth()
	if (session?.user?.id) {
		const response = await db.chamber.create({
			data: {
				name,
				description,
				userId: session?.user?.id ?? '',
				frequency: crypto.randomUUID(),
			},
		})

		return response
	}
	return null
}

export const getChamberById = async (id: string) => {
	const response = await db.chamber.findUnique({
		where: {
			id,
		},
	})
	return response
}
