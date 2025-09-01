'use client'
import { type ChamberDataType, getChamberData } from '@/actions/chambers'
import PostCard from '@/components/ui/post/post-card'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { type AllEchoesType, getAllPosts } from '@/actions/post'
import { TbPin } from 'react-icons/tb'
import { cn } from '@/utils/cn'
import useLayoutStore from '@/stores/layout-store'
import SelectEchoesContainerLayout from '../../_components/select-echoes-container-layout'
import SelectEchoLayout from '../../_components/select-echo-layout'
import { type EchoTypes } from '@/actions/types'

export default function ChamberPage() {
	const session = useSession()
	const { id } = useParams<{ id: string }>()
	const [data, setData] = useState<{ chamber: ChamberDataType; posts: AllEchoesType['data'] }>()
	const { layout, echoLayout } = useLayoutStore();

	const fetchData = useCallback(async () => {
		if (!id) throw new Error('Invalid chamber id')

		const payload = {
			chamberId: id,
			type: 'all' as EchoTypes
		}
		const [chamber, posts] = await Promise.all([getChamberData(id), getAllPosts(payload)])
		setData({
			chamber,
			posts: posts.data,
		})
	}, [id])

	useEffect(() => {
		if (session.status === 'authenticated') {
			fetchData().catch(err => console.log(err))
		}
	}, [session, fetchData])

	if (!data) return <></>

	return (
		<div>
			<div className='space-y-5 mt-5'>
				<div className="flex items-center justify-self-end gap-4">
					<SelectEchoesContainerLayout />
					<SelectEchoLayout />
				</div>
				<section className={cn('border border-warning p-5 rounded-lg', layout === 'grid' && 'grid grid-cols-2 gap-5 ', layout === 'rows' && 'space-y-5')}>
					<h1 className='font-bold text-sm text-warning flex items-center gap-2'>
						<TbPin />
						Pinned Echoes
					</h1>
					{data?.posts?.filter(item => item.isPinned).map(item => <PostCard key={item.id} post={item} display={'compact'} />)}
				</section>
				<section className={cn('border border-secondary p-5 rounded-lg', layout === 'grid' && 'grid grid-cols-2 gap-5', layout === 'rows' && 'space-y-5')}>
					<h1 className='font-bold text-sm text-black'>All Echoes</h1>
					{data?.posts?.filter(item => !item.isPinned).map(item => <PostCard key={item.id} post={item} display={echoLayout ?? 'full'} />)}
				</section>
			</div>
		</div>
	)
}
