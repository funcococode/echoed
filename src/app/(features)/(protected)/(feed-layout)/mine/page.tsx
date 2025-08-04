'use client'
import { type AllEchoesType, getAllPosts } from '@/actions/post'
import PageHeading from '@/components/ui/page-heading'
import useNavigationStore from '@/stores/navigation-store'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import PostCard from '@/components/ui/post/post-card'

export default function Mine() {
	const session = useSession()
	const { currentPath } = useNavigationStore()
	const [data, setData] = useState<AllEchoesType['data']>([])

	const fetchData = async () => {
		const response = await getAllPosts({
			type: 'mine'
		})
		console.log(response)
		setData(response.data)

	}

	useEffect(() => {
		if (session.status === 'authenticated') {
			fetchData().catch(err => console.log(err))
		}
	}, [session.status])

	return (
		<div className="space-y-4">
			<PageHeading>
				<section className="flex h-32 items-center justify-between gap-1 px-4">
					<div className="text-secondary flex w-1/4 items-center justify-start gap-4 text-5xl">
						{currentPath.icon}
						<span className="font-extralight">{data.length || ''}</span>
					</div>
				</section>
			</PageHeading>
			<div className="grid gap-4 md:grid-cols-2">
				{data?.map(item => (
					<PostCard key={item.id} post={item} />
				))}
			</div>
		</div>
	)
}
