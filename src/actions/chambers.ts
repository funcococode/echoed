'use server'

import { auth } from '@/auth'
import { db } from '@/server/db'

export type ChamberType = ReturnType<typeof listChambers> extends Promise<infer T> ? T : never
export const listChambers = async (query?: string) => {
	const response = await db.chamber.findMany({
		where: {
			...(query
				? {
						OR: [
							{ name: { contains: query } },
							{ description: { contains: query } },
						],
					}
				: {}),
		},
		select: {
			id: true,
			name: true,
			description: true,
			frequency: true,
		},
		...(query?.length ? { take: 5 } : {}),
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

export const addEchoToChamber = async (echoId: string, chamberId: string) => {
	const response = await db.chamber.update({
		where: {
			id: chamberId,
		},
		data: {
			posts: {
				connect: [
					{
						id: echoId,
					},
				],
			},
		},

		select: {
			id: true,
		},
	})
	return response
}

export type ChamberDataType = ReturnType<typeof getChamberData> extends Promise<infer T> ? T : never
export const getChamberData = async (chamberId: string) => {
	const response = await db.chamber.findUnique({
		where: {
			id: chamberId,
			posts: {
				every: {
					AND: [{ is_archived: false }, { is_hidden: false }],
				},
			},
		},
		select: {
			name: true,
			description: true,
			frequency: true,
			user: {
				select: {
					id: true,
					username: true,
					firstname: true,
					lastname: true,
					image: true,
				},
			},
			ChamberMember: true,
			_count: {
				select: {
					ChamberMember: true,
					posts: true,
				},
			},
		},
	})
	return response
}
