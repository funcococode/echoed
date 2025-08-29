'use client'
import { type AllEchoesType, getAllPosts } from '@/actions/post'
import PageHeading from '@/components/ui/page-heading'
import useNavigationStore from '@/stores/navigation-store'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import PostCard from '@/components/ui/post/post-card'
import SelectEchoesContainerLayout from '../_components/select-echoes-container-layout'
import SelectEchoLayout from '../_components/select-echo-layout'
import useLayoutStore from '@/stores/layout-store'
import { cn } from '@/utils/cn'

export default function Mine() {
	const session = useSession()
	const { currentPath } = useNavigationStore()
	const [data, setData] = useState<AllEchoesType['data']>([])
	const { layout, echoLayout } = useLayoutStore();

	const fetchData = async () => {
		const response = await getAllPosts({
			type: 'mine'
		})
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
					<div className="flex items-center gap-4">
						<SelectEchoesContainerLayout />
						<SelectEchoLayout />
					</div>
				</section>
			</PageHeading>
			<div className={cn(layout === 'grid' && 'grid grid-cols-2 gap-5', layout === 'rows' && 'space-y-5')}>
				{data?.map(item => (
					<PostCard key={item.id} post={item} display={echoLayout ?? 'full'} />
				))}
			</div>
		</div>
	)
}
