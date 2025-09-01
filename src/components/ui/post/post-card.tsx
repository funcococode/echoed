'use client'

import Link from 'next/link'
import Image from 'next/image'
import moment from 'moment'
import { motion } from 'motion/react'
import { TbClock, TbCalendar, TbEye, TbPlus, TbPinFilled } from 'react-icons/tb'
import type { AllEchoesType } from '@/actions/post'
import type { PostLayout } from '@/types/layout'
import BookmarkButton from '../bookmark-button'
import Avatar from '../avatar'

export interface PostCardProps {
	post: AllEchoesType['data'][0]
	display?: PostLayout // 'FULL' | 'COMPACT' | 'MINIMAL' | 'SLIM'
}

/* helpers */
const fmtDate = (d?: string | Date) => (d ? moment(d).format('MMM DD, yyyy') : '')
const nf = (n?: number) => (typeof n === 'number' ? new Intl.NumberFormat().format(n) : '0')
const initials = (fn?: string | null, ln?: string | null) =>
	`${(fn?.[0] ?? '').toUpperCase()}${(ln?.[0] ?? '').toUpperCase()}` || 'E'

const Chip = ({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) => (
	<span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white dark:bg-neutral-800 dark:border-neutral-900 dark:text-neutral-400 px-2 py-0.5 text-[11px] font-medium text-gray-600">
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

/* SLIM */
const SLIM = ({ post }: { post: AllEchoesType['data'][0] }) => (
	<motion.article
		initial={{ opacity: 0, y: 4 }}
		animate={{ opacity: 1, y: 0 }}
		className="flex items-center gap-3 rounded border border-secondary-light bg-white dark:bg-neutral-900 dark:border-neutral-800 p-3 "
	>
		{post.headerImage && (
			<div className="relative h-14 w-14 overflow-hidden rounded-md bg-gray-100">
				<Image alt="Header" src={post.headerImage} fill className="object-cover" />
			</div>
		)}
		<div className="min-w-0 flex-1">
			<Link href={`/post/${post.id}`} className="line-clamp-1 text-sm font-semibold text-gray-900 hover:text-primary dark:text-neutral-100">
				{post.title}
			</Link>
			<div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500">
				<span className="capitalize">{post.user?.firstname} {post.user?.lastname}</span> • <span>{fmtDate(post.createdAt)}</span>
			</div>
		</div>
		<BookmarkButton postId={post.id} bookmarked={post.bookmarked} />

	</motion.article>
)

/* MINIMAL */
const MINIMAL = ({ post }: { post: AllEchoesType['data'][0] }) => (
	<motion.article
		initial={{ opacity: 0, y: 4 }}
		animate={{ opacity: 1, y: 0 }}
		className="space-y-2 rounded border border-secondary-light bg-white p-3 dark:bg-neutral-900 dark:border-neutral-800 "
	>
		{post.headerImage && (
			<div className="relative w-full aspect-[8/1] overflow-hidden rounded-md bg-gray-100">
				<Image alt="Header" src={post.headerImage} fill className="object-cover" />
			</div>
		)}
		<Link href={`/post/${post.id}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-primary dark:text-neutral-100">
			{post.title}
		</Link>
		<div className="flex flex-wrap gap-1">
			<Chip icon={<TbClock className="text-[12px]" />}>{nf(post.readTime)}m</Chip>
			<Chip icon={<TbCalendar className="text-[12px]" />}>{fmtDate(post.createdAt)}</Chip>
		</div>
	</motion.article>
)

/* COMPACT */
const COMPACT = ({ post }: { post: AllEchoesType['data'][0] }) => {
	const urls = post.urls ?? []
	const total = post?._count?.attachments ?? urls.length
	return (
		<motion.article
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex gap-5 rounded border border-secondary-light bg-white dark:bg-neutral-900 dark:border-neutral-800 p-4 "
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
							<div className='flex items-start gap-2'>
								<Avatar url={post?.user?.image} name={post?.user?.displayName} size="sm" />
								<div>
									<div className="text-sm font-medium capitalize">{post?.user?.displayName ?? `${post?.user?.firstname} ${post?.user?.lastname}`}</div>
									<div className="text-[11px] text-gray-500">{fmtDate(post.createdAt)}</div>
								</div>
							</div>
						</div>
						<div className="mt-1 flex flex-wrap gap-1">
							<Chip icon={<TbClock className="text-[12px]" />}>{nf(post.readTime)}m</Chip>
							<Chip icon={<TbEye className="text-[12px]" />}>{nf(post.views)}</Chip>
						</div>
					</div>
					<BookmarkButton postId={post.id} bookmarked={post.bookmarked} />
				</div>
				<Link href={`/post/${post.id}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-primary dark:text-neutral-100 ">
					{post.title}
				</Link>

				{post.description && (
					<p className="line-clamp-2 text-xs text-gray-600 dark:text-neutral-400">{post.description}</p>
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
			className="grid gap-6 rounded border border-secondary-light bg-white dark:bg-neutral-900 dark:border-neutral-800 p-10 md:grid-cols-[1fr,260px]"
		>
			<div className="space-y-10">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-2">
						<Avatar url={post?.user?.image} name={post?.user?.displayName} size="md" shape="rounded" />
						<div>
							<div className="text-sm font-medium capitalize">{post?.user?.displayName ?? `${post?.user?.firstname} ${post?.user?.lastname}`}</div>
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
					<Link href={`/post/${post.id}`} className="text-lg font-semibold text-gray-900 hover:text-primary dark:text-neutral-100">
						{post.title}
					</Link>
					{post.description && (
						<p className="line-clamp-3 text-sm text-gray-600 dark:text-neutral-400">{post.description}</p>
					)}
				</div>
				{urls.length > 0 && <ExtraImages urls={urls} total={total} />}
				<ActionBar />
			</div>
		</motion.article>
	)
}

/* main export */
export default function PostCard({ post, display = 'FULL' }: PostCardProps) {
	if (display === 'SLIM') return <SLIM post={post} />
	if (display === 'MINIMAL') return <MINIMAL post={post} />
	if (display === 'COMPACT') return <COMPACT post={post} />
	return <Full post={post} />
}
