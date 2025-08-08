'use server'
import { auth } from '@/auth'
import { db } from '@/server/db'
import {
	type EchoResult,
	type GetSearchResultsResponse,
	type GroupedSearchData,
	type TagResult,
	type UserResult,
} from './types/search'

export async function getSearchResults({ query }: { query: string }): Promise<GetSearchResultsResponse> {
	const session = await auth()
	if (!session?.user) {
		return { message: 'Unauthenticated Request', success: false }
	}

	if (!query) {
		return { message: 'Please enter something to search for.', success: false }
	}

	const [echoRes, userRes, tagRes] = await Promise.all([
		db.post.findMany({
			where: {
				title: { contains: query },
				is_archived: false,
				is_hidden: false,
			},
			select: {
				id: true,
				title: true,
				description: true,
				user: { select: { username: true } },
			},
			take: 5,
		}),
		db.user.findMany({
			where: {
				OR: [
					{ username: { contains: query } },
					{ firstname: { contains: query } },
					{ lastname: { contains: query } },
				],
			},
			select: {
				id: true,
				firstname: true,
				lastname: true,
				username: true,
			},
			take: 5,
		}),
		db.tag.findMany({
			where: { name: { contains: query } },
			select: { id: true, name: true, description: true },
			take: 5,
		}),
	])

	const data: GroupedSearchData = {
		echo: echoRes.map(
			(item): EchoResult => ({
				id: item.id,
				name: item.title,
				desc: item.description,
				username: item.user.username,
				type: 'echo',
			}),
		),
		user: userRes.map(
			(item): UserResult => ({
				id: item.id,
				name: `${item.firstname} ${item.lastname}`.trim(),
				username: item.username,
				desc: '',
				type: 'user',
			}),
		),
		tag: tagRes.map(
			(item): TagResult => ({
				id: item.id,
				name: item.name,
				desc: item.description,
				type: 'tag',
			}),
		),
	}

	return {
		message: 'Data fetched successfully.',
		success: true,
		data,
	}
}
