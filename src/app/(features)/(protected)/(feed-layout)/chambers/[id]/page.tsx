'use client'
import { type ChamberDataType, getChamberData } from '@/actions/chambers'
import PageHeading from '@/components/ui/page-heading'
import PostCard from '@/components/ui/post/post-card'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { type AllEchoesType, getAllPosts } from '@/actions/post'
import { TbPlus, TbWaveSquare } from 'react-icons/tb'
import Button from '@/components/form/button'
import { } from 'react-icons/md'

export default function ChamberPage() {
	const session = useSession()
	const { id } = useParams<{ id: string }>()
	const [data, setData] = useState<{ chamber: ChamberDataType; posts: AllEchoesType['data'] }>()

	const fetchData = useCallback(async () => {
		if (!id) throw new Error('Invalid chamber id')

		const payload = {
			chamberId: id,
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
			<PageHeading>
				<section className="flex items-center justify-between px-10">
					<div className="flex items-center gap-5 max-w-2/3 ">
						<div className="border-secondary bg-secondary-light text-secondary grid aspect-square w-20 p-3 place-content-center rounded-full border text-3xl font-bold">
							{data?.chamber?.name?.split(' ')?.map(item => item[0])?.[0]}
						</div>
						<div className="space-y-2">
							<h1 className="text-2xl font-semibold flex items-center gap-5">
								{data?.chamber?.name}
								<span className="text-xs font-light text-gray-400 bg-secondary px-2 py-0.5 rounded w-fit flex items-center gap-2">
									<TbWaveSquare className='text-success' />
									{data?.chamber?.frequency?.split('-')?.[0]}
								</span>
							</h1>
							<p className="text-sm font-light ">
								{data?.chamber?.description}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-5">
						<Button
							text="Create an echo here"
							icon={<TbPlus className="text-lg" />}
							className="border-secondary font-medium flex items-center gap-2 rounded-md border px-4 py-1.5 text-sm text-black"
						/>
						<Button
							text="Join"
							icon={<TbPlus className="text-lg" />}
							className="flex items-center gap-2 rounded-md bg-black px-4 py-1.5 text-sm text-white font-medium"
						/>
					</div>
				</section>
			</PageHeading>

			<section className=''>
				{data?.posts?.map(item => <PostCard key={item.id} post={item} />)}
			</section>
		</div>
	)
}
