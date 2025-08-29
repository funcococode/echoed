// 'use client'
// import { TbCalendar, TbClock, TbEye, TbPlus } from 'react-icons/tb'
// import moment from 'moment'
// import Link from 'next/link'
// import BookmarkButton from '../bookmark-button'
// import PostVotes from './post-votes'
// import type { AllEchoesType } from '@/actions/post'
// import Image from 'next/image'
// import ImageContainer from '../image-container'
// import PostComments from './post-comments'
// import { cn } from '@/utils/cn'
// import Card from '../card/card'
// import { type PostLayout } from '@/types/layout'

// export interface PostCardProps {
// 	post: AllEchoesType['data'][0]
// 	display?: PostLayout
// }

// export default function PostCard({ post, display = 'full' }: PostCardProps) {
// 	return (
// 		display !== 'slim' ? <div
// 			className='group flex flex-col rounded border border-gray-100 shadow-md shadow-gray-500/10'>
// 			{!!post.headerImage && display === 'full' && (
// 				<div className="border-secondary flex min-w-52">
// 					<div className="relative h-44 aspect-square flex-1">
// 						<Image
// 							alt="Header Image"
// 							src={post.headerImage}
// 							fill={true}
// 							className="rounded-t-md object-cover "
// 							onError={e => {
// 								const target =
// 									e.target as HTMLImageElement
// 								target.onerror = null
// 								target.src =
// 									'/fallback-image.png'
// 							}}
// 						/>
// 					</div>
// 				</div>
// 			)}
// 			<div className="flex flex-col gap-5 flex-1 md:flex-row p-5">
// 				{!['minimal', 'compact'].includes(display) && <div className="flex flex-row items-center justify-between gap-10 font-semibold text-gray-500 md:flex-col">
// 					<div className="hidden md:block">
// 						<PostVotes post={post} />
// 					</div>
// 					<div className="hidden md:block">
// 						<PostComments post={post} />
// 					</div>
// 				</div>}
// 				<div className={cn("flex flex-1 flex-col gap-0 ", !['compact', 'minimal'].includes(display) && 'border-l border-dashed border-secondary pl-5 gap-5')}>
// 					<div className={cn("flex-grow space-y-4", display === 'compact' && 'flex gap-5')}>
// 						{display === 'compact' && !!post.headerImage && <div className="relative h-36 aspect-square">
// 							<Image
// 								alt="Header Image"
// 								src={post.headerImage}
// 								fill={true}
// 								className="rounded-md object-cover"
// 								onError={e => {
// 									const target =
// 										e.target as HTMLImageElement
// 									target.onerror = null
// 									target.src =
// 										'/fallback-image.png'
// 								}}
// 							/>
// 						</div>}
// 						<div className="flex flex-col gap-4">
// 							<div className={cn("flex flex-col gap-5 order-2", display === 'minimal' && 'gap-2')}>
// 								<div className='flex flex-col gap-1.5'>
// 									{['compact', 'compact'].includes(display) && <Link href={`/user/${post.userId}`} className='text-xs flex gap-1 font-normal'>
// 										<span className="text-primary capitalize">
// 											{post?.user?.firstname} {post?.user?.lastname}
// 										</span>
// 										on
// 										<span className="">
// 											{moment(post.createdAt).format('MMM DD, yyyy')}
// 										</span>
// 									</Link>}
// 									<Link href={`/post/${post.id}`} className={cn("text-lg font-semibold text-gray-800 hover:text-primary hover:underline underline-offset-8  flex items-center gap-2", display === 'minimal' && 'text-md')}>
// 										{post.title}
// 									</Link>
// 								</div>
// 								<p className={cn("text-sm font-light text-gray-500", display === 'minimal' && 'line-clamp-2', display === 'compact' && 'line-clamp-3')}>
// 									{post.description}
// 								</p>
// 								{post?.urls?.length > 0 && !['minimal', 'compact'].includes(display) && (
// 									<div className="group  relative mt-5">
// 										{post.urls?.map((item, idx) => (
// 											<div
// 												key={item}
// 												className={`top-0 inline-block bg-white`}
// 												style={{
// 													transform: `translateX(-${idx * 1.5}rem)`,
// 												}}>
// 												<ImageContainer
// 													allowFullSizeViewing={
// 														false
// 													}
// 													size="thumbnail"
// 													src={item}
// 												/>
// 											</div>
// 										))}
// 										{post?._count?.attachments > post?.urls?.length && <div
// 											style={{
// 												transform: `translateX(-${3 * 1.5}rem)`,
// 											}}
// 											className='bg-white absolute top-0 inline-flex w-12 aspect-square rounded ring ring-offset-2 border-none ring-gray-200 items-center text-xs justify-center text-gray-300 font-medium'>
// 											<TbPlus /> {post._count.attachments - post.urls?.length}
// 										</div>}
// 									</div>
// 								)}
// 							</div>
// 						</div>
// 					</div>
// 					<div className="border-secondary/50 flex flex-wrap items-center justify-evenly gap-5 border-t border-dashed pt-5 text-xs text-gray-500 md:justify-between md:gap-0">
// 						{!['compact', 'compact'].includes(display) && <Link href={`/user/${post.userId}`}>
// 							Posted by{' '}
// 							<span className="text-primary font-medium capitalize">
// 								{post?.user?.firstname} {post?.user?.lastname}
// 							</span>
// 						</Link>}
// 						{!['compact', 'minimal'].includes(display) && <div className={cn("flex items-center gap-4 md:gap-8")}>
// 							<p className="flex items-center gap-1 md:gap-2">
// 								<TbClock className="text-sm" />
// 								<span className="block pt-0.5">{post.readTime} min read</span>
// 							</p>
// 							<p className="flex items-center gap-1 md:gap-2">
// 								<TbCalendar className="text-sm" />
// 								<span className="block pt-0.5">
// 									{moment(post.createdAt).format('MMM DD, yyyy')}
// 								</span>
// 							</p>
// 						</div>}
// 						{['compact'].includes(display) && <div className={cn("flex items-center justify-between gap-4 w-full")}>
// 							{post?.urls?.length > 0 && ['compact'].includes(display) && (
// 								<div className="group relative ">
// 									{post.urls?.map((item, idx) => (
// 										<div
// 											key={item}
// 											className={`top-0 inline-block bg-white`}
// 											style={{
// 												transform: `translateX(-${idx * 1}rem)`,
// 											}}>
// 											<ImageContainer
// 												allowFullSizeViewing={
// 													false
// 												}
// 												size="xsmall"
// 												src={item}
// 											/>
// 										</div>
// 									))}
// 									{post?._count?.attachments > post?.urls?.length && <div
// 										style={{
// 											transform: `translateX(-${3 * 1}rem)`,
// 										}}
// 										className='bg-white absolute top-0 inline-flex w-8 aspect-square rounded ring ring-offset-2 border-none ring-gray-200 items-center text-xs justify-center text-gray-300 font-medium'>
// 										<TbPlus /> {post._count.attachments - post.urls?.length}
// 									</div>}
// 								</div>
// 							)}
// 							<div className=''>
// 								<PostVotes post={post} display='horizontal' />
// 							</div>
// 						</div>}
// 						<div className="block md:hidden">
// 							<PostVotes post={post} />
// 						</div>
// 					</div>
// 				</div>
// 				{!['minimal', 'compact'].includes(display) && <div className="pl-5 border-l border-dashed border-secondary flex flex-row items-center justify-between gap-10 text-gray-500 md:flex-col font-light">
// 					<div className="hidden md:block">
// 						<BookmarkButton
// 							bookmarked={post.bookmarked ?? false}
// 							postId={post.id ?? ''}
// 						/>
// 					</div>
// 					<p className="mt-1 flex flex-col items-center gap-2 text-xs bg-secondary/50 px-1.5 py-2 rounded text-gray-400 ">
// 						{post.views}
// 						<TbEye />
// 					</p>
// 				</div>}
// 			</div>
// 		</div> : <Card>
// 			<section className='flex gap-5 items-center'>
// 				<div className='border-r border-dashed border-secondary pr-5'>
// 					<PostVotes post={post} />
// 				</div>
// 				<section className='flex gap-5 items-center w-full'>
// 					{post.headerImage && <div className="relative h-16 aspect-square">
// 						<Image
// 							alt="Header Image"
// 							src={post.headerImage}
// 							fill={true}
// 							className="rounded-md object-fill"
// 							onError={e => {
// 								const target =
// 									e.target as HTMLImageElement
// 								target.onerror = null
// 								target.src =
// 									'/fallback-image.png'
// 							}}
// 						/>
// 					</div>}
// 					<div className='space-y-2 w-full'>
// 						<Link href={`/user/${post.userId}`} className='text-xs flex gap-1 font-normal justify-between '>
// 							<span className="text-primary capitalize">
// 								{post?.user?.firstname} {post?.user?.lastname}
// 							</span>
// 							<span className="text-gray-400">
// 								{moment(post.createdAt).format('MMM DD, yyyy')}
// 							</span>
// 						</Link>
// 						<Link href={`/post/${post.id}`} className={cn("text-sm font-semibold text-gray-800 hover:text-primary hover:underline underline-offset-8  flex items-center gap-2", display === 'minimal' && 'text-md')}>
// 							{post.title}
// 						</Link>
// 						<h4 className='text-xs text-gray-400 font-medium line-clamp-2'>{post.description}</h4>
// 					</div>
// 				</section>
// 				{post?.urls?.length > 0 && (
// 					<div className="w-36 flex flex-wrap gap-2.5 border-l border-dashed border-secondary pl-5">
// 						{post.urls?.map((item) => (
// 							<div
// 								key={item}
// 								className={``}
// 							>
// 								<ImageContainer
// 									allowFullSizeViewing={
// 										false
// 									}
// 									size="xsmall"
// 									src={item}
// 								/>
// 							</div>
// 						))}
// 						{post?._count?.attachments > post?.urls?.length && <div className='bg-secondary/20 w-8 aspect-square rounded ring ring-offset-2 border-none ring-gray-200 flex items-center text-xs justify-center text-gray-300 font-medium'>
// 							<TbPlus /> {post._count.attachments - post.urls?.length}
// 						</div>}
// 					</div>
// 				)}
// 			</section>
// 		</Card>
// 	)
// }

'use client'

import Link from 'next/link'
import Image from 'next/image'
import moment from 'moment'
import { motion } from 'motion/react'
import { TbClock, TbCalendar, TbEye, TbPlus, TbPinFilled } from 'react-icons/tb'
import type { AllEchoesType } from '@/actions/post'
import type { PostLayout } from '@/types/layout'
import BookmarkButton from '../bookmark-button'

export interface PostCardProps {
	post: AllEchoesType['data'][0]
	display?: PostLayout // 'full' | 'compact' | 'minimal' | 'slim'
}

/* helpers */
const fmtDate = (d?: string | Date) => (d ? moment(d).format('MMM DD, yyyy') : '')
const nf = (n?: number) => (typeof n === 'number' ? new Intl.NumberFormat().format(n) : '0')
const initials = (fn?: string | null, ln?: string | null) =>
	`${(fn?.[0] ?? '').toUpperCase()}${(ln?.[0] ?? '').toUpperCase()}` || 'E'

const Chip = ({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) => (
	<span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600">
		{icon}
		{children}
	</span>
)

/* extra images stack */
const ExtraImages = ({ urls, total }: { urls: string[]; total: number }) => {
	if (!urls.length) return null
	const show = urls.slice(0, 3)
	const overflow = Math.max(0, total - show.length)
	return (
		<div className="flex -space-x-3">
			{show.map((src, idx) => (
				<div key={src} className="relative h-12 w-12 overflow-hidden rounded-md ring-2 ring-white bg-white shadow-xl">
					<Image
						alt={`Attachment ${idx + 1}`}
						src={src}
						fill
						className="object-cover"
						onError={(e) => {
							const t = e.target as HTMLImageElement
							t.onerror = null
							t.src = '/fallback-image.png'
						}}
					/>
				</div>
			))}
			{overflow > 0 && (
				<div className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-500 ring-2 ring-white z-50 shadow-lg">
					<TbPlus /> {overflow}
				</div>
			)}
		</div>
	)
}

/* placeholder actions */
const ActionBar = () => (
	<div className="flex items-center gap-5 text-xs text-gray-500">
		<button className="hover:text-primary transition-colors">👍 24</button>
		<button className="hover:text-primary transition-colors">💬 8</button>
	</div>
)

/* image box */
const ImageBox = ({ src, alt }: { src: string; alt: string }) => (
	<div className="relative w-full aspect-[4/1] overflow-hidden rounded-md bg-gray-50">
		<Image
			alt={alt}
			src={src}
			fill
			className="object-cover"
			onError={(e) => {
				const t = e.target as HTMLImageElement
				t.onerror = null
				t.src = '/fallback-image.png'
			}}
		/>
	</div>
)

/* slim */
const Slim = ({ post }: { post: AllEchoesType['data'][0] }) => (
	<motion.article
		initial={{ opacity: 0, y: 4 }}
		animate={{ opacity: 1, y: 0 }}
		className="flex items-center gap-3 rounded border border-secondary-light bg-white p-3 "
	>
		{post.headerImage && (
			<div className="relative h-14 w-14 overflow-hidden rounded-md bg-gray-100">
				<Image alt="Header" src={post.headerImage} fill className="object-cover" />
			</div>
		)}
		<div className="min-w-0 flex-1">
			<Link href={`/post/${post.id}`} className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-primary">
				{post.title}
			</Link>
			<div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500">
				<span className="capitalize">{post.user?.firstname} {post.user?.lastname}</span> • <span>{fmtDate(post.createdAt)}</span>
			</div>
		</div>
		<BookmarkButton postId={post.id} bookmarked={post.bookmarked} />

	</motion.article>
)

/* minimal */
const Minimal = ({ post }: { post: AllEchoesType['data'][0] }) => (
	<motion.article
		initial={{ opacity: 0, y: 4 }}
		animate={{ opacity: 1, y: 0 }}
		className="space-y-2 rounded border border-secondary-light bg-white p-3 "
	>
		{post.headerImage && (
			<div className="relative w-full aspect-[8/1] overflow-hidden rounded-md bg-gray-100">
				<Image alt="Header" src={post.headerImage} fill className="object-cover" />
			</div>
		)}
		<Link href={`/post/${post.id}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-primary">
			{post.title}
		</Link>
		<div className="flex flex-wrap gap-1">
			<Chip icon={<TbClock className="text-[12px]" />}>{nf(post.readTime)}m</Chip>
			<Chip icon={<TbCalendar className="text-[12px]" />}>{fmtDate(post.createdAt)}</Chip>
		</div>
	</motion.article>
)

/* compact */
const Compact = ({ post }: { post: AllEchoesType['data'][0] }) => {
	const urls = post.urls ?? []
	const total = post?._count?.attachments ?? urls.length
	return (
		<motion.article
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex gap-5 rounded border border-secondary-light bg-white p-4 "
		>

			{post.headerImage && (
				<div className="relative w-44 aspect-square overflow-hidden rounded-md bg-gray-100">
					<Image alt="Header" src={post.headerImage} fill className="object-cover" />
				</div>
			)}

			<div className="flex-1 space-y-2">
				<div className="flex items-center justify-between gap-4">
					<div className='flex items-center justify-between w-full'>
						<div className='flex items-center gap-2'>

							{post.isPinned && <TbPinFilled className='text-warning' />}
							<div className="text-xs text-gray-500 capitalize">{post.user?.firstname} {post.user?.lastname}</div>
						</div>
						<div className="mt-1 flex flex-wrap gap-1">
							<Chip icon={<TbClock className="text-[12px]" />}>{nf(post.readTime)}m</Chip>
							<Chip icon={<TbEye className="text-[12px]" />}>{nf(post.views)}</Chip>
						</div>
					</div>
					<BookmarkButton postId={post.id} bookmarked={post.bookmarked} />
				</div>
				<Link href={`/post/${post.id}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-primary">
					{post.title}
				</Link>

				{post.description && (
					<p className="line-clamp-2 text-xs text-gray-600">{post.description}</p>
				)}
				<div className=' mt-5 space-y-5'>
					{urls.length > 0 && <ExtraImages urls={urls} total={total} />}
					<ActionBar />
				</div>
			</div>
		</motion.article>
	)
}

/* full */
const Full = ({ post }: { post: AllEchoesType['data'][0] }) => {
	const urls = post.urls ?? []
	const total = post?._count?.attachments ?? urls.length
	return (
		<motion.article
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			className="grid gap-6 rounded border border-secondary-light bg-white p-10 md:grid-cols-[1fr,260px]"
		>
			<div className="space-y-10">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2">
						<div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
							{initials(post.user?.firstname, post.user?.lastname)}
						</div>
						<div>
							<div className="text-sm font-medium capitalize">{post.user?.firstname} {post.user?.lastname}</div>
							<div className="text-[11px] text-gray-500">{fmtDate(post.createdAt)}</div>
						</div>
					</div>
					<div className='flex items-center gap-8'>
						<div className="flex flex-wrap gap-2">
							<Chip icon={<TbClock className="text-[12px]" />}>{nf(post.readTime)}m</Chip>
							<Chip icon={<TbEye className="text-[12px]" />}>{nf(post.views)}</Chip>
						</div>
						<BookmarkButton postId={post.id} bookmarked={post.bookmarked} />
					</div>
				</div>
				{post.headerImage && <ImageBox src={post.headerImage} alt="Header" />}
				<div className='flex flex-col gap-2'>
					<Link href={`/post/${post.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary">
						{post.title}
					</Link>
					{post.description && (
						<p className="line-clamp-3 text-sm text-gray-600">{post.description}</p>
					)}
				</div>
				{urls.length > 0 && <ExtraImages urls={urls} total={total} />}
				<ActionBar />
			</div>
		</motion.article>
	)
}

/* main export */
export default function PostCard({ post, display = 'full' }: PostCardProps) {
	if (display === 'slim') return <Slim post={post} />
	if (display === 'minimal') return <Minimal post={post} />
	if (display === 'compact') return <Compact post={post} />
	return <Full post={post} />
}
