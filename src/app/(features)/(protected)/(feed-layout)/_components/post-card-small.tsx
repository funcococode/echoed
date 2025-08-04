'use client'

import { type EchoesByType_TypeDef } from '@/actions/post'
import Card from '@/components/ui/card/card'
import moment from 'moment'
import Link from 'next/link'
import { TbArchive, TbArrowUp, TbBookmark, TbEye, TbEyeClosed, TbMessage } from 'react-icons/tb'

interface SmallPostCardProps {
	item: EchoesByType_TypeDef[0]
}

export default function SmallPostCard({ item }: SmallPostCardProps) {
	return (
		<Card>
			<div className="space-y-4">
				<div className="flex justify-between text-xs font-light text-gray-400">
					<p className="">
						Posted by{' '}
						<span className="text-primary font-medium capitalize">
							{item?.user?.firstname} {item?.user?.lastname}
						</span>
					</p>
					<p>{moment(item?.createdAt).format('MMM DD, YYYY')}</p>
				</div>
				<Link href={`/post/${item?.id}`} className="hover:text-primary block font-medium">
					{item?.title}
				</Link>
			</div>
			<div className="flex items-center gap-2">
				<div className="flex w-fit items-center gap-2 rounded border px-2 text-xs text-gray-400">
					<h2>
						<TbEye />
					</h2>
					<p>{item?.views}</p>
				</div>
				<div className="flex w-fit items-center gap-2 rounded border px-2 text-xs text-gray-400">
					<h2>
						<TbArrowUp />
					</h2>
					<p>{item?._count?.votes}</p>
				</div>
				<div className="flex w-fit items-center gap-2 rounded border px-2 text-xs text-gray-400">
					<h2>
						<TbMessage />
					</h2>
					<p>{item?._count?.comments}</p>
				</div>
				<div className="flex w-fit items-center gap-2 rounded border px-2 text-xs text-gray-400">
					<h2>
						<TbBookmark />
					</h2>
					<p>{item?._count?.saves}</p>
				</div>

				{item?.is_hidden && (
					<div className="flex list-none items-center rounded border border-gray-200 bg-gray-500/10 text-xs font-medium text-gray-400">
						<span className="border-r border-gray-200 p-1">
							<TbEyeClosed />
						</span>
						<span className="px-1.5">Hidden</span>
					</div>
				)}

				{item?.is_archived && (
					<div className="flex list-none items-center rounded border border-orange-200 bg-orange-500/10 text-xs font-medium text-orange-400">
						<span className="border-r border-orange-200 p-1">
							<TbArchive />
						</span>
						<span className="px-1.5">Archived</span>
					</div>
				)}
			</div>
		</Card>
	)
}
