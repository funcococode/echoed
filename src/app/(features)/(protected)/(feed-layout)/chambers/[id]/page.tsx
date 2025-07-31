'use client'
import { type ChamberDataType, getChamberData } from '@/actions/chambers'
import PageHeading from '@/components/ui/page-heading'
import PostCard from '@/components/ui/post/post-card'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { type AllEchoesType, getAllPosts } from '@/actions/post'
import Dropdown from '@/components/ui/dropdown/dropdown'
import { TbLayoutCards, TbPlus } from 'react-icons/tb'
import Button from '@/components/form/button'

export default function ChamberPage() {
	const session = useSession()
	const { id } = useParams<{ id: string }>()
	const [data, setData] = useState<{ chamber: ChamberDataType; posts: AllEchoesType['data'] }>()

	const fetchData = async () => {
		if (!id) throw new Error('Invalid chamber id')

		const payload = {
			chamberId: id,
		}
		const [chamber, posts] = await Promise.all([getChamberData(id), getAllPosts(payload)])
		setData({
			chamber,
			posts: posts.data,
		})
	}

	useEffect(() => {
		if (session.status === 'authenticated') {
			fetchData().catch(err => console.log(err))
		}
	}, [session])

	if (!data) return <></>

	return (
		<div>
			<PageHeading>
				<section className="flex items-center justify-between px-10">
					<div className="flex items-center gap-5">
						<div className="border-secondary bg-secondary-light text-secondary grid aspect-square w-20 place-content-center rounded-full border text-4xl font-bold">
							C
						</div>
						<div className="space-y-2">
							<h1 className="text-2xl font-semibold">
								{data?.chamber?.name}
							</h1>
							<p className="text-sm font-light">
								{data?.chamber?.description}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-5">
						<Button
							text="Create an echo here"
							icon={<TbPlus className="text-lg" />}
							className="border-secondary flex items-center gap-2 rounded-md border px-4 py-1.5 text-sm text-black"
						/>
						<Button
							text="Join"
							icon={<TbPlus className="text-lg" />}
							className="flex items-center gap-2 rounded-md bg-black px-4 py-1.5 text-sm text-white"
						/>
					</div>
				</section>
			</PageHeading>

			<section>
				{!!data.posts.length &&
					data?.posts?.map(item => <PostCard key={item.id} post={item} />)}
			</section>
		</div>
	)
}
