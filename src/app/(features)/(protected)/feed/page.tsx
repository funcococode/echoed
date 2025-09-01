'use client'

import { useCallback, useEffect, useState } from 'react'
import PostCard from '@/components/ui/post/post-card'
import { type AllEchoesType, getAllPosts } from '@/actions/post'
import Pagination from '@/components/ui/pagination'
import SelectEchoesContainerLayout from '../_components/select-echoes-container-layout'
import SelectEchoLayout from '../_components/select-echo-layout'
import useLayoutStore from '@/stores/layout-store'
import { cn } from '@/utils/cn'
import PageHeading from '@/components/ui/page-heading'
import Frequencies from '@/components/ui/frequencies'

export default function Feed() {
	const [data, setData] = useState<AllEchoesType['data']>([])
	const [pageInfo, setPageInfo] = useState<{
		total_count: number
		total_pages: number
		page: number
		limit: number
	}>()
	const [refetch, setRefetch] = useState(false)
	const [currentPage, setCurrentPage] = useState(0)
	const [limit, setLimit] = useState(5)
	const { layout, echoLayout } = useLayoutStore()

	const fetchData = useCallback(async () => {
		const payload = {
			page: currentPage,
			limit,
		}

		const response = await getAllPosts(payload)

		setData(response.data)
		setPageInfo(response.pageInfo)
	}, [currentPage, limit])

	useEffect(() => {
		fetchData().catch(err => console.log(err))
	}, [refetch, currentPage, limit, fetchData])


	return (
		<section className="flex gap-4 relative">
			<div className="relative flex-1 space-y-10 md:space-y-4">
				<PageHeading>
					<div className="flex h-32 items-center justify-between px-5 w-full">
						<Frequencies />
						<div className="flex items-center gap-4">
							<SelectEchoesContainerLayout />
							<SelectEchoLayout />
						</div>
					</div>
				</PageHeading>

				<div className={cn('mt-5', layout === 'GRID' && 'grid grid-cols-2 gap-5', layout === 'ROWS' && 'space-y-5')}>
					{data?.map(item => (
						<PostCard post={item} key={item.id} display={echoLayout ?? 'FULL'} />
					))}
					{!data?.length && (
						<div className="col-span-2 text-center py-20">
							<p className="text-sm text-neutral-500">No echoes found.</p>
						</div>
					)}
				</div>
			</div>
			{!!data?.length && <Pagination
				setCurrentPage={setCurrentPage}
				currentPage={currentPage}
				totalRecords={pageInfo?.total_count ?? 0}
				totalPages={pageInfo?.total_pages ?? 0}
			/>}
		</section >
	)
}
