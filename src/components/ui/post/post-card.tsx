import { TbCalendar, TbClock, TbEye, TbMessage } from 'react-icons/tb'
import moment from 'moment'
import Link from 'next/link'
import BookmarkButton from '../bookmark-button'
import PostVotes from './post-votes'
import type { AllEchoesType } from '@/actions/post'
import Image from 'next/image'
import ImageContainer from '../image-container'
import Icon from '../icon'

export interface PostCardProps {
	post: AllEchoesType['data'][0]
}

export default function PostCard({ post }: PostCardProps) {
	return (
		<div className="group flex min-h-62 flex-col gap-5 rounded border border-gray-100 p-4 shadow-md shadow-gray-500/10 md:flex-row md:p-10">
			<div className="border-secondary flex flex-row items-center justify-between gap-10 font-semibold text-gray-500 md:flex-col">
				<p className="mt-1 flex flex-row items-center gap-2 text-xs md:flex-col">
					<Icon icon={<TbEye />} size="small" />
					{post.views}
				</p>
				<div className="hidden md:block">
					<PostVotes post={post} />
				</div>
			</div>
			<div className="border-dashbed border-secondary/50 flex flex-1 flex-col gap-5 border-l border-dashed pl-5">
				<div className="flex-grow space-y-4">
					<div className="flex gap-4">
						<div className="space-y-5">
							<h1 className="text-lg font-semibold text-gray-800">
								{post.title}
							</h1>
							<p className="text-sm font-light text-gray-500">
								{post.description}
							</p>
							{post?.urls?.length > 0 && (
								<div className="group border-secondary/50 relative border-t border-dashed pt-5">
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
								</div>
							)}
						</div>
						{!!post.headerImage && (
							<div className="border-secondary flex min-w-52 border-l border-dashed pl-5">
								<div className="relative min-h-44 flex-1">
									<Image
										alt="Header Image"
										src={post.headerImage}
										fill={true}
										className="rounded-md object-cover outline-1 outline-offset-4 outline-indigo-50"
										onError={e => {
											const target =
												e.target as HTMLImageElement
											target.onerror = null
											target.src =
												'/fallback-image.png'
										}}
									/>
								</div>
								{/* {!!post.urls?.length && <div className="flex items-center gap-2 flex-wrap border-t pt-5 border-dashed border-gray-200">
                  {post.urls?.map(item => (
                    <ImageContainer allowFullSizeViewing={false} size="thumbnail" key={item} src={item} />
                  ))}
                </div>} */}
							</div>
						)}
					</div>
				</div>
				<div className="border-secondary/50 flex flex-wrap items-center justify-evenly gap-5 border-t border-dashed pt-5 text-xs text-gray-500 md:justify-between md:gap-0">
					<Link href={`/user/${post.userId}`}>
						Posted by{' '}
						<span className="text-primary font-medium capitalize">
							{post?.user?.firstname} {post?.user?.lastname}
						</span>
					</Link>
					<div className="flex items-center gap-4 md:gap-8">
						<p className="flex items-center gap-1 md:gap-2">
							<TbMessage />
							{post._count?.comments ?? ''}
						</p>
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
						<Link
							className="text-primary underline-offset-2 hover:underline"
							href={`/post/${post.id}`}>
							Open
						</Link>
						<BookmarkButton
							bookmarked={post.bookmarked ?? false}
							postId={post.id ?? ''}
						/>
					</div>
					<div className="block md:hidden">
						<PostVotes post={post} />
					</div>
				</div>
			</div>
		</div>
	)
}
