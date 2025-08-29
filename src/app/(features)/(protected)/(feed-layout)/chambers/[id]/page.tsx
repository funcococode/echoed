'use client'
import { type ChamberDataType, getChamberData, joinChamber, leaveChamber } from '@/actions/chambers'
import PageHeading from '@/components/ui/page-heading'
import PostCard from '@/components/ui/post/post-card'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { type AllEchoesType, getAllPosts } from '@/actions/post'
import { TbBellPlus, TbCodeVariablePlus, TbPin, TbUserMinus, TbUserPlus, TbWaveSquare } from 'react-icons/tb'
import Button from '@/components/form/button'
import { cn } from '@/utils/cn'
import useLayoutStore from '@/stores/layout-store'
import SelectEchoesContainerLayout from '../../_components/select-echoes-container-layout'
import SelectEchoLayout from '../../_components/select-echo-layout'
import { toast } from 'sonner'
import { type EchoTypes } from '@/actions/types'
import Link from 'next/link'
import ManageChamber from '../_components/manage-chamber'

export default function ChamberPage() {
	const session = useSession()
	const { id } = useParams<{ id: string }>()
	const [data, setData] = useState<{ chamber: ChamberDataType; posts: AllEchoesType['data'] }>()
	const { layout, echoLayout } = useLayoutStore();
	const [refresh, setRefersh] = useState(false);

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
	}, [id, refresh])

	useEffect(() => {
		if (session.status === 'authenticated') {
			fetchData().catch(err => console.log(err))
		}
	}, [session, fetchData, refresh])

	const handleClickJoin = async () => {
		const response = await joinChamber(id);
		if (response?.id) {
			toast.success(`Joined ${data?.chamber?.name}`, {
				richColors: true
			})
			setRefersh(prev => !prev)
		} else {
			toast.error(`Something went wrong.`, {
				richColors: true
			})
		}
	}
	const handleClickLeave = async () => {
		const response = await leaveChamber(id);
		if (response?.id) {
			toast.success(`Left ${data?.chamber?.name}`, {
				richColors: true
			})
			setRefersh(prev => !prev)
		} else {
			toast.error(`Something went wrong.`, {
				richColors: true
			})
		}
	}


	if (!data) return <></>

	return (
		<div>
			<PageHeading className='h-96 grid relative'>
				<section className="flex items-center justify-between px-10 row-span-11">
					<div className="flex items-center gap-5 max-w-2/3 ">
						<div className="border-secondary bg-secondary-light text-secondary grid aspect-square w-20 p-3 place-content-center rounded-full border text-3xl font-bold">
							{data?.chamber?.name?.split(' ')?.map(item => item[0])?.[0]}
						</div>
						<div className="space-y-10">
							<h1 className="text-2xl font-semibold flex items-center gap-5">
								{data?.chamber?.name}
								<span className="text-xs font-light text-gray-400 bg-secondary px-2 py-0.5 rounded w-fit flex items-center gap-2">
									<TbWaveSquare className='text-success' />
									{data?.chamber?.frequency?.split('-')?.[0]}
								</span>
							</h1>
							<p className="text-sm font-light w-2/3">
								{data?.chamber?.description}
							</p>
							<div className='flex items-center gap-2 w-fit'>
								<div className='flex border border-secondary rounded-md px-4 py-0.5 w-fit items-center text-xs font-semibold gap-2'>
									<h2>
										{data?.chamber?._count?.ChamberMember}
									</h2>
									<h3 className=''>Member</h3>
								</div>
								<div className='flex border border-secondary  rounded-md px-4 py-0.5 w-fit items-center text-xs font-semibold gap-2'>
									<h2>
										{data?.chamber?._count?.posts}
									</h2>
									<h3 className=''>Echoes</h3>
								</div>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-5">
						<Button
							text="Create an echo here"
							icon={<TbCodeVariablePlus className="text-xl" />}
							className="hover:py-2 transition-all cursor-pointer border-secondary hover:border-primary font-medium flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-black hover:bg-primary-light hover:text-primary"
						/>
						{session?.data?.user?.id !== data?.chamber?.user?.id && <div className='pl-5 border-l'>
							{!data?.chamber?.ChamberMember?.find(item => item.chamberId === id && item.userId === session.data?.user?.id)?.id ? <Button
								onClick={handleClickJoin}
								text="Join"
								icon={<TbUserPlus className="text-lg" />}
								className="cursor-pointer flex items-center gap-2  bg-black px-4 py-1.5 text-sm text-white font-medium rounded-full"
							/> : <div className='flex items-center gap-2'>
								<Button
									onClick={handleClickJoin}
									text=""
									icon={<TbBellPlus className="text-lg" />}
									className="hover:py-2 transition-all cursor-pointer flex items-center gap-2 border border-secondary hover:border-warning px-4 py-1.5 text-sm font-medium rounded-md hover:bg-warning-light hover:text-warning"
								/>
								<Button
									onClick={handleClickLeave}
									text=""
									icon={<TbUserMinus className="text-lg" />}
									className="hover:py-2 transition-all cursor-pointer flex items-center gap-2 border border-secondary hover:border-danger px-4 py-1.5 text-sm font-medium rounded-md hover:bg-danger-light hover:text-danger"
								/>
							</div>}
						</div>}
						{session?.data?.user?.id === data?.chamber?.user?.id && <div className='pl-5 border-l space-y-2'>
							<ManageChamber chamberId={id} />
						</div>}
					</div>
				</section>
				<footer className='flex justify-end items-center gap-2 text-xs font-light text-gray-400 px-10 place-self-end'>
					<h6 className='flex items-center gap-2'>
						{session?.data?.user?.id !== data?.chamber?.user?.id && <>Created by <Link href={`/user/${data?.chamber?.user?.id}`} className='text-primary hover:underline font-semibold'> @{data?.chamber?.user?.username} </Link> on <span className=''>{data?.chamber?.createdAt}</span></>}
						{session?.data?.user?.id === data?.chamber?.user?.id && <>You created this chamber on <span className=''>{data?.chamber?.createdAt}</span></>}
					</h6>
				</footer>
			</PageHeading>
			<div className='space-y-5'>
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
