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
import { TbPlus } from 'react-icons/tb'
import Icon from '@/components/ui/icon'
import Link from 'next/link'

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
			<div className={cn('mt-5 ', layout === 'GRID' && 'grid grid-cols-2 gap-5', layout === 'ROWS' && 'space-y-5')}>
				{data?.map(item => (
					<PostCard key={item.id} post={item} display={echoLayout ?? 'FULL'} />
				))}

				{!data.length && <Link
					href="/post/new"
					className="mt-5 flex-1 border w-full h-96 rounded-md border-gray-200 bg-gray-50 dark:bg-neutral-950 dark:border-neutral-800 border-dashed capitalize font-semibold grid place-content-center gap-5 hover:bg-gray-100">
					<Icon icon={<TbPlus />} size="large" />
					Create a new Echo
				</Link>}

			</div>
		</div>
	)
}
