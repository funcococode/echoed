'use client'
import { TbCalendar, TbClock, TbEye, TbPlus } from 'react-icons/tb'
import moment from 'moment'
import Link from 'next/link'
import BookmarkButton from '../bookmark-button'
import PostVotes from './post-votes'
import type { AllEchoesType } from '@/actions/post'
import Image from 'next/image'
import ImageContainer from '../image-container'
import PostComments from './post-comments'
import { cn } from '@/utils/cn'
import Card from '../card/card'
import { type PostLayout } from '@/types/layout'

export interface PostCardProps {
	post: AllEchoesType['data'][0]
	display?: PostLayout
}

export default function PostCard({ post, display = 'full' }: PostCardProps) {
	return (
		display !== 'slim' ? <div
			className='group flex flex-col rounded border border-gray-100 shadow-md shadow-gray-500/10'>
			{!!post.headerImage && display === 'full' && (
				<div className="border-secondary flex min-w-52">
					<div className="relative h-44 aspect-square flex-1">
						<Image
							alt="Header Image"
							src={post.headerImage}
							fill={true}
							className="rounded-t-md object-cover "
							onError={e => {
								const target =
									e.target as HTMLImageElement
								target.onerror = null
								target.src =
									'/fallback-image.png'
							}}
						/>
					</div>
				</div>
			)}
			<div className="flex flex-col gap-5 flex-1 md:flex-row p-5">
				{!['minimal', 'compact'].includes(display) && <div className="flex flex-row items-center justify-between gap-10 font-semibold text-gray-500 md:flex-col">
					<div className="hidden md:block">
						<PostVotes post={post} />
					</div>
					<div className="hidden md:block">
						<PostComments post={post} />
					</div>
				</div>}
				<div className={cn("flex flex-1 flex-col gap-0 ", !['compact', 'minimal'].includes(display) && 'border-l border-dashed border-secondary pl-5 gap-5')}>
					<div className={cn("flex-grow space-y-4", display === 'compact' && 'flex gap-5')}>
						{display === 'compact' && !!post.headerImage && <div className="relative h-36 aspect-square">
							<Image
								alt="Header Image"
								src={post.headerImage}
								fill={true}
								className="rounded-md object-cover"
								onError={e => {
									const target =
										e.target as HTMLImageElement
									target.onerror = null
									target.src =
										'/fallback-image.png'
								}}
							/>
						</div>}
						<div className="flex flex-col gap-4">
							<div className={cn("flex flex-col gap-5 order-2", display === 'minimal' && 'gap-2')}>
								<div className='flex flex-col gap-1.5'>
									{['compact', 'compact'].includes(display) && <Link href={`/user/${post.userId}`} className='text-xs flex gap-1 font-normal'>
										<span className="text-primary capitalize">
											{post?.user?.firstname} {post?.user?.lastname}
										</span>
										on
										<span className="">
											{moment(post.createdAt).format('MMM DD, yyyy')}
										</span>
									</Link>}
									<Link href={`/post/${post.id}`} className={cn("text-lg font-semibold text-gray-800 hover:text-primary hover:underline underline-offset-8  flex items-center gap-2", display === 'minimal' && 'text-md')}>
										{post.title}
									</Link>
								</div>
								<p className={cn("text-sm font-light text-gray-500", display === 'minimal' && 'line-clamp-2', display === 'compact' && 'line-clamp-3')}>
									{post.description}
								</p>
								{post?.urls?.length > 0 && !['minimal', 'compact'].includes(display) && (
									<div className="group  relative mt-5">
										{post.urls?.map((item, idx) => (
											<div
												key={item}
												className={`top-0 inline-block bg-white`}
												style={{
													transform: `translateX(-${idx * 1.5}rem)`,
												}}>
												<ImageContainer
													allowFullSizeViewing={
														false
													}
													size="thumbnail"
													src={item}
												/>
											</div>
										))}
										{post?._count?.attachments > post?.urls?.length && <div
											style={{
												transform: `translateX(-${3 * 1.5}rem)`,
											}}
											className='bg-white absolute top-0 inline-flex w-12 aspect-square rounded ring ring-offset-2 border-none ring-gray-200 items-center text-xs justify-center text-gray-300 font-medium'>
											<TbPlus /> {post._count.attachments - post.urls?.length}
										</div>}
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="border-secondary/50 flex flex-wrap items-center justify-evenly gap-5 border-t border-dashed pt-5 text-xs text-gray-500 md:justify-between md:gap-0">
						{!['compact', 'compact'].includes(display) && <Link href={`/user/${post.userId}`}>
							Posted by{' '}
							<span className="text-primary font-medium capitalize">
								{post?.user?.firstname} {post?.user?.lastname}
							</span>
						</Link>}
						{!['compact', 'minimal'].includes(display) && <div className={cn("flex items-center gap-4 md:gap-8")}>
							<p className="flex items-center gap-1 md:gap-2">
								<TbClock className="text-sm" />
								<span className="block pt-0.5">{post.readTime} min read</span>
							</p>
							<p className="flex items-center gap-1 md:gap-2">
								<TbCalendar className="text-sm" />
								<span className="block pt-0.5">
									{moment(post.createdAt).format('MMM DD, yyyy')}
								</span>
							</p>
						</div>}
						{['compact'].includes(display) && <div className={cn("flex items-center justify-between gap-4 w-full")}>
							{post?.urls?.length > 0 && ['compact'].includes(display) && (
								<div className="group relative ">
									{post.urls?.map((item, idx) => (
										<div
											key={item}
											className={`top-0 inline-block bg-white`}
											style={{
												transform: `translateX(-${idx * 1}rem)`,
											}}>
											<ImageContainer
												allowFullSizeViewing={
													false
												}
												size="xsmall"
												src={item}
											/>
										</div>
									))}
									{post?._count?.attachments > post?.urls?.length && <div
										style={{
											transform: `translateX(-${3 * 1}rem)`,
										}}
										className='bg-white absolute top-0 inline-flex w-8 aspect-square rounded ring ring-offset-2 border-none ring-gray-200 items-center text-xs justify-center text-gray-300 font-medium'>
										<TbPlus /> {post._count.attachments - post.urls?.length}
									</div>}
								</div>
							)}
							<div className=''>
								<PostVotes post={post} display='horizontal' />
							</div>
						</div>}
						<div className="block md:hidden">
							<PostVotes post={post} />
						</div>
					</div>
				</div>
				{!['minimal', 'compact'].includes(display) && <div className="pl-5 border-l border-dashed border-secondary flex flex-row items-center justify-between gap-10 text-gray-500 md:flex-col font-light">
					<div className="hidden md:block">
						<BookmarkButton
							bookmarked={post.bookmarked ?? false}
							postId={post.id ?? ''}
						/>
					</div>
					<p className="mt-1 flex flex-col items-center gap-2 text-xs bg-secondary/50 px-1.5 py-2 rounded text-gray-400 ">
						{post.views}
						<TbEye />
					</p>
				</div>}
			</div>
		</div> : <Card>
			<section className='flex gap-5 items-center'>
				<div className='border-r border-dashed border-secondary pr-5'>
					<PostVotes post={post} />
				</div>
				<section className='flex gap-5 items-center w-full'>
					{post.headerImage && <div className="relative h-16 aspect-square">
						<Image
							alt="Header Image"
							src={post.headerImage}
							fill={true}
							className="rounded-md object-fill"
							onError={e => {
								const target =
									e.target as HTMLImageElement
								target.onerror = null
								target.src =
									'/fallback-image.png'
							}}
						/>
					</div>}
					<div className='space-y-2 w-full'>
						<Link href={`/user/${post.userId}`} className='text-xs flex gap-1 font-normal justify-between '>
							<span className="text-primary capitalize">
								{post?.user?.firstname} {post?.user?.lastname}
							</span>
							<span className="text-gray-400">
								{moment(post.createdAt).format('MMM DD, yyyy')}
							</span>
						</Link>
						<Link href={`/post/${post.id}`} className={cn("text-sm font-semibold text-gray-800 hover:text-primary hover:underline underline-offset-8  flex items-center gap-2", display === 'minimal' && 'text-md')}>
							{post.title}
						</Link>
						<h4 className='text-xs text-gray-400 font-medium line-clamp-2'>{post.description}</h4>
					</div>
				</section>
				{post?.urls?.length > 0 && (
					<div className="w-36 flex flex-wrap gap-2.5 border-l border-dashed border-secondary pl-5">
						{post.urls?.map((item) => (
							<div
								key={item}
								className={``}
							>
								<ImageContainer
									allowFullSizeViewing={
										false
									}
									size="xsmall"
									src={item}
								/>
							</div>
						))}
						{post?._count?.attachments > post?.urls?.length && <div className='bg-secondary/20 w-8 aspect-square rounded ring ring-offset-2 border-none ring-gray-200 flex items-center text-xs justify-center text-gray-300 font-medium'>
							<TbPlus /> {post._count.attachments - post.urls?.length}
						</div>}
					</div>
				)}
			</section>
		</Card>
	)
}
