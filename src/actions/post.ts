'use server'

import { auth } from '@/auth'
import { db } from '@/server/db'
import { pinata } from '@/utils/config'
import { remark } from 'remark'
import strip from 'strip-markdown'

export type PostType = ReturnType<typeof getPost> extends Promise<infer T> ? T : never

export async function getPost(postId: string) {
	const session = await auth()
	const data = await db.post.findFirst({
		where: {
			id: postId,
		},
		include: {
			_count: {
				select: {
					comments: true,
					votes: true,
					saves: true,
					tags: true,
				},
			},
			votes: true,
			saves: {
				select: {
					userId: true,
				},
			},
			user: {
				select: {
					id: true,
					firstname: true,
					lastname: true,
				},
			},
			attachments: true,
		},
	})
	const mappedData = {
		...data,
		votedByMe: data?.votes.some(vote => vote.userId === session?.user?.id),
		bookmarked: data?.saves.some(item => item.userId === session?.user?.id),
		votePositive: data?.votes.some(vote => vote.userId === session?.user?.id && vote.positive),
		readTime: Math.round(data?.description?.split(' ')?.length ?? 0 / 200),
		urls: data?.attachments.map(item => pinata.gateways.public.convert(item.cid)),
		headerImage: null,
	}
	return mappedData
}

export async function getAllPosts({
	page = 0,
	limit = 5,
	userId = null,
}: {
	page?: number
	limit?: number
	userId?: string | null
}) {
	const session = await auth()

	const skip = page * limit
	const response = await db.post.findMany({
		skip,
		take: limit,
		where: {
			...(userId && { userId }),
			is_hidden: false,
			is_archived: false,
			NOT: {
				userId: session?.user?.id,
			},
		},
		include: {
			_count: {
				select: {
					comments: true,
					votes: true,
					saves: true,
					tags: true,
				},
			},
			saves: {
				select: {
					userId: true,
				},
			},
			votes: true,
			user: {
				select: {
					id: true,
					firstname: true,
					lastname: true,
				},
			},
			attachments: {
				select: {
					cid: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	const data = await Promise.all(
		response.map(async post => {
			let headerImage: string | null | undefined = null
			if (post?.main_text?.length) {
				const imageMatch = /!\[.*?\]\((.*?)\)/.exec(post.main_text)
				headerImage = imageMatch ? imageMatch[1] : null
			}
			return {
				...post,
				votedByMe: post.votes.some(vote => vote.userId === session?.user?.id),
				bookmarked: post.saves.some(item => item.userId === session?.user?.id),
				votePositive: post.votes.some(
					vote => vote.userId === session?.user?.id && vote.positive,
				),
				readTime: post?.main_text?.length
					? Math.round(
							String(await remark().use(strip).process(post.main_text))
								?.length ?? 0 / 200,
						)
					: 0,
				headerImage,
				urls: await Promise.all(
					post.attachments.map(
						async item => await pinata.gateways.public.convert(item.cid),
					),
				),
			}
		}),
	)

	const total_count = await db.post.count({
		where: {
			NOT: { userId: session?.user?.id },
			AND: {
				is_hidden: false,
				is_archived: false,
			},
		},
	})
	return {
		data,
		pageInfo: {
			total_count,
			page,
			limit,
			total_pages: Math.ceil(total_count / limit),
		},
	}
}

export type PostDetailType = ReturnType<typeof getPostDetails> extends Promise<infer T> ? T : never
export async function getPostDetails(postId: string) {
	const session = await auth()
	const response = await db.post.findFirst({
		where: {
			id: postId,
		},
		include: {
			attachments: {
				select: {
					cid: true,
				},
			},
			user: true,
			saves: true,
			votes: true,
			_count: true,
			tags: true,
			comments: {
				include: {
					user: true,
				},
				orderBy: {
					createdAt: 'desc',
				},
			},
		},
	})

	const cids = response?.attachments?.map(item => item.cid)
	// const main_text = String(
	// 	await remark()
	// 		.use(strip)
	// 		.process(response?.main_text || ''),
	// )
	const urls: string[] = []
	cids?.forEach(id => {
		getEchoAttachments(id)
			.then(obj => urls.push(obj?.data?.url!))
			.catch(err => console.log(err))
	})

	const mapped = {
		...response,
		cids: urls,
		bookmarked: response?.saves.some(item => item.userId === session?.user?.id),
		// main_text,
	}

	return mapped
}

export const updateViewCount = async (id: string) => {
	await db.post.update({
		where: { id },
		data: {
			views: {
				increment: 1,
			},
		},
	})
}

export const updatePost = async (id: string, payload: { title?: string; description?: string }) => {
	const response = await db.post.update({
		where: { id },
		data: {
			...payload,
		},
		select: {
			id: true,
		},
	})

	return response.id
}

export const deleteEcho = async (id: string) => {
	const response = await db.post.delete({
		where: { id },
		select: {
			id: true,
		},
	})

	return response.id
}

export const togglePostVisibilty = async (id: string, hidden: boolean) => {
	const response = await db.post.update({
		where: { id },
		data: {
			is_hidden: hidden,
		},
		select: {
			id: true,
		},
	})

	return response.id
}

export const toggleEchoArchive = async (id: string, archived: boolean) => {
	const response = await db.post.update({
		where: { id },
		data: {
			is_archived: archived,
		},
		select: {
			id: true,
		},
	})

	return response.id
}

export const addNewEcho = async (data: { title: string; description: string; main_text?: string }) => {
	const session = await auth()
	try {
		if (!data.title || !data.description) {
			throw new Error('Please provide a title and a description for new Echo')
		}
		const response = await db.post.create({
			data: {
				userId: session?.user?.id ?? '',
				...data,
			},
			select: {
				id: true,
			},
		})
		if (response?.id) {
			return {
				message: 'Post created successfully',
				success: true,
				data: { id: response.id },
			}
		}
	} catch (e: unknown) {
		if (e instanceof Error) {
			return { message: e.message, success: false, data: null }
		}
	}

	return {
		message: 'Error creating account at the moment, please try again later.',
		success: false,
		data: null,
	}
}

export const addAttachmentToEcho = async (data: { postId: string; cid: string; type: string; fileId: string }) => {
	try {
		if (!data.postId || !data.cid || !data.type) {
			throw new Error('Post ID, Attachment cid and Attachment type are Required')
		}
		const response = await db.postAttachments.create({
			data: {
				cid: data.cid,
				type: data.type,
				postId: data.postId,
				fileId: data.postId,
			},
			select: {
				id: true,
			},
		})

		if (response?.id) {
			return {
				message: 'Attachment added successfully',
				success: true,
				data: { id: response.id },
			}
		}
	} catch (e: unknown) {
		if (e instanceof Error) {
			return { message: e.message, success: false, data: null }
		}
	}

	return {
		message: 'Error adding attachment, please try again later.',
		success: false,
		data: null,
	}
}

export const getEchoAttachments = async (cid: string) => {
	try {
		if (!cid) {
			throw new Error('CID Required')
		}
		const response = await pinata.gateways.public.convert(cid)

		if (response) {
			return {
				message: 'Attachment found',
				success: true,
				data: { url: response },
			}
		}
	} catch (e: unknown) {
		if (e instanceof Error) {
			return { message: e.message, success: false, data: null }
		}
	}

	return {
		message: 'Error',
		success: false,
		data: null,
	}
}

export type EchoesByType_TypeDef = ReturnType<typeof getEchoesByType> extends Promise<infer T> ? T : never
export const getEchoesByType = async (type: 'hidden' | 'mine' | 'saved' | 'archived' = 'mine') => {
	const session = await auth()
	if (!session?.user?.id) {
		return []
	}

	if (type != 'saved') {
		const response = await db.post.findMany({
			where: {
				userId: session?.user?.id,
				...(type === 'hidden' && { is_hidden: true }),
				...(type === 'archived' && { is_archived: true }),
			},
			include: {
				user: true,
				_count: {
					select: {
						votes: true,
						comments: true,
						saves: true,
					},
				},
			},
		})

		return response
	} else {
		const response = await db.savedPost.findMany({
			where: {
				userId: session?.user?.id,
			},
			include: {
				post: {
					include: {
						user: true,
						_count: {
							select: {
								votes: true,
								comments: true,
								saves: true,
							},
						},
					},
				},
			},
		})

		const mappedResponse = response.map(item => ({
			...item.post,
		}))

		return mappedResponse
	}
}
