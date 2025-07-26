'use server'
import { auth } from '@/auth'
import { db } from '@/server/db'
import type { SearchTypes } from './types'
import { SearchDataResponse } from '@/components/ui/search/search-bar'

export async function getSearchResults({ query, type = 'ECHO' }: { query: string; type?: SearchTypes }): Promise<{
	message: string
	success: boolean
	data?: SearchDataResponse[]
}> {
	const session = await auth()
	if (!session?.user) {
		return {
			message: 'Unauthenticated Request',
			success: false,
		}
	}

	if (!query) {
		return {
			message: 'Please enter something to search for.',
			success: false,
		}
	}

	let data = []
	let response = []
	switch (type) {
		case 'ECHO':
			response = await db.post.findMany({
				where: {
					title: {
						contains: query,
					},
					is_archived: false,
					is_hidden: false,
				},
				select: {
					id: true,
					title: true,
					description: true,
					user: {
						select: {
							username: true,
						},
					},
				},
				take: 5,
			})
			data = response.map(item => ({
				id: item.id,
				name: item.title,
				desc: item.description,
				username: item.user.username,
			}))
			return {
				message: 'Data fetched successfully.',
				success: true,
				data,
			}

		case 'USER':
			response = await db.user.findMany({
				where: {
					OR: [
						{
							username: {
								contains: query,
							},
						},
						{
							firstname: {
								contains: query,
							},
						},
						{
							lastname: {
								contains: query,
							},
						},
					],
				},
				select: {
					id: true,
					firstname: true,
					lastname: true,
					username: true,
				},
			})
			data = response.map(item => ({
				id: item.id,
				name: `${item.firstname} ${item.lastname}`,
				username: item.username,
			}))
			return {
				message: 'Data fetched successfully.',
				success: true,
				data,
			}

		case 'TAG':
			response = await db.tag.findMany({
				where: {
					name: {
						contains: query,
					},
				},
				select: {
					id: true,
					name: true,
					description: true,
				},
			})
			data = response.map(item => ({
				id: item.id,
				name: item.name,
				desc: item.description,
			}))
			return {
				message: 'Data fetched successfully.',
				success: true,
				data,
			}
	}
}
