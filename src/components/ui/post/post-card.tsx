import { TbCalendar, TbClock, TbEye } from 'react-icons/tb'
import moment from 'moment'
import Link from 'next/link'
import BookmarkButton from '../bookmark-button'
import PostVotes from './post-votes'
import type { AllEchoesType } from '@/actions/post'
import Image from 'next/image'
import ImageContainer from '../image-container'
import PostComments from './post-comments'

export interface PostCardProps {
	post: AllEchoesType['data'][0]
}

export default function PostCard({ post }: PostCardProps) {
	return (
		<div className='group flex flex-col rounded border border-gray-100 shadow-md shadow-gray-500/10'>
			{!!post.headerImage && (
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
				<div className="flex flex-row items-center justify-between gap-10 font-semibold text-gray-500 md:flex-col">
					<div className="hidden md:block">
						<PostVotes post={post} />
					</div>
					<div className="hidden md:block">
						<PostComments post={post} />
					</div>
				</div>
				<div className="border-dashbed border-secondary flex flex-1 flex-col gap-5 border-x border-dashed px-5">
					<div className="flex-grow space-y-4">
						<div className="flex flex-col gap-4">
							<div className="space-y-5 order-2">
								<h1 className="text-lg font-semibold text-gray-800">
									{post.title}
								</h1>
								<p className="text-sm font-light text-gray-500">
									{post.description}
								</p>
								{post?.urls?.length > 0 && (
									<div className="group border-secondary/50 relative border-t border-dashed pt-5 ">
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
						</div>
						<div className="block md:hidden">
							<PostVotes post={post} />
						</div>
					</div>
				</div>
				<div className="border-secondary flex flex-row items-center justify-between gap-10 text-gray-500 md:flex-col font-light">
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
				</div>
			</div>
		</div>
	)
}
