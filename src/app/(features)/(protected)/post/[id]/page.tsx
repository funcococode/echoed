'use client'
import {
	deleteEcho,
	getPostDetails,
	type PostDetailType,
	toggleEchoArchive,
	togglePostVisibilty,
	updateViewCount,
} from '@/actions/post'
import BookmarkButton from '@/components/ui/bookmark-button'
import CommentsContainer from '@/components/ui/comment/comments-container'
import Dropdown, { type DropdownOption } from '@/components/ui/dropdown/dropdown'
import Icon from '@/components/ui/icon'
import ImageContainer from '@/components/ui/image-container'
import TagContainer from '@/components/ui/tag/tags-container'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { HiOutlineCollection } from 'react-icons/hi'
import {
	TbArchive,
	TbArchiveOff,
	TbArrowDown,
	TbArrowUp,
	TbEye,
	TbEyeClosed,
	TbEyeglass,
	TbEyeglassOff,
	TbFile,
	TbLoader2,
	TbPencil,
	TbTrash,
} from 'react-icons/tb'
import { toast } from 'sonner'
import SearchChamber from '../../(feed-layout)/chambers/_components/search-chamber'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import { addEchoToChamber } from '@/actions/chambers'
import SectionHeading from '@/components/ui/section-heading'
import Card from '@/components/ui/card/card'

export default function Post() {
	const { id } = useParams<{ id: string }>()
	const [data, setData] = useState<PostDetailType>()
	const [isLoading, setIsLoading] = useState(true)
	const [showChamberModal, setShowChamberModal] = useState(false)
	const { data: sessionData } = useSession()
	const router = useRouter();

	const fetchData = useCallback(async () => {
		if (id) {
			const postData = await getPostDetails(id)
			setData(postData)
		}
	}, [id])

	useEffect(() => {
		if (data && sessionData?.user?.id !== data?.userId) {
			updateViewCount(id).catch(err => console.log(err))
		}
	}, [data])

	useEffect(() => {
		fetchData()
			.catch(err => console.log(err))
			.finally(() => setIsLoading(false))
	}, [fetchData])

	const handleVisibility = () => {
		togglePostVisibilty(id, !data?.is_hidden)
			.then(response => {
				if (response) {
					toast.success(`Post visibility updated`, {
						richColors: true,
					})
				}
			})
			.catch(err => console.log(err))
	}

	const handleArchive = () => {
		toggleEchoArchive(id, !data?.is_archived)
			.then(response => {
				if (response) {
					toast.success(!data?.is_archived ? 'Post Archived' : 'Post Unarchived', {
						richColors: true,
					})
					setShowChamberModal(false)
					router.refresh();
				}
			})
			.catch(err => console.log(err))
	}

	const handleDelete = () => {
		deleteEcho(id)
			.then(response => {
				if (response) {
					toast.success(`Echo Removed`, {
						richColors: true,
					})
				}
			})
			.catch(err => console.log(err))
	}

	const handleAddToChamber = () => {
		setShowChamberModal(true)
	}

	const handleAddEchoToChamber = async (chamberId: string) => {
		const response = await addEchoToChamber(id, chamberId)
		if (response.id) {
			toast.success('Echo added to chamber', {
				richColors: true,
			})
		} else {
			toast.error('Error adding echo to chamber', {
				richColors: true,
			})
		}
	}

	const menuOptions: DropdownOption<undefined>[] = [
		{
			label: 'Edit',
			icon: <Icon icon={<TbPencil />} size="small" />,
			link: `./edit/${id}`,
		},
		{
			label: 'Delete',
			icon: <Icon icon={<TbTrash />} size="small" />,
			action: handleDelete,
		},

		{
			label: data?.is_archived ? 'Unarchive' : 'Archive',
			icon: data?.is_archived ? (
				<Icon icon={<TbArchiveOff />} size="small" />
			) : (
				<Icon icon={<TbArchive />} size="small" />
			),
			action: handleArchive,
		},

		{
			label: data?.is_hidden ? 'Unhide' : 'Hide',
			icon: data?.is_hidden ? (
				<Icon icon={<TbEyeglass />} size="small" />
			) : (
				<Icon icon={<TbEyeglassOff />} size="small" />
			),
			action: handleVisibility,
		},
		{
			label: 'Add to Chamber',
			icon: <Icon icon={<HiOutlineCollection />} size="small" />,
			action: handleAddToChamber,
		},
	]

	if (isLoading)
		return (
			<div className="grid w-full place-content-center">
				<div className="flex items-center gap-2">
					<TbLoader2 className="animate-spin text-xl" /> Fetching Data
				</div>
			</div>
		)
	return (
		<div className="space-y-5">
			<div className="divide-secondary flex flex-wrap gap-5 divide-y md:divide-x md:divide-y-0">
				<div className="flex-[5] space-y-10 pr-10">
					<div className="space-y-5">
						<div className="flex flex-wrap justify-between md:items-center md:text-sm">
							<Link
								href={`/user/${data?.userId}`}
								className="text-primary capitalize">
								{data?.user?.firstname} {data?.user?.lastname}
							</Link>
							<div className="flex items-center gap-2">
								{data?.is_hidden && (
									<div className="flex list-none items-center rounded border border-gray-200 bg-gray-500/10 text-xs font-medium text-gray-400">
										<span className="border-r border-gray-200 p-1">
											<TbEyeClosed />
										</span>
										<span className="px-1.5">Hidden</span>
									</div>
								)}
								{data?.is_archived && (
									<div className="flex list-none items-center rounded border border-orange-200 bg-orange-500/10 text-xs font-medium text-orange-400">
										<span className="border-r border-orange-200 p-1">
											<TbArchive />
										</span>
										<span className="px-1.5">Archived</span>
									</div>
								)}
								<div className="text-primary flex list-none items-center rounded border border-indigo-200 bg-indigo-500/10 text-xs font-medium">
									<span className="border-r border-indigo-200 p-1">
										<TbArrowUp />
									</span>
									<span className="px-1.5">
										{
											data?.votes?.filter(
												item => item.positive,
											)?.length
										}
									</span>
								</div>
								<div className="flex list-none items-center rounded border border-red-200 bg-red-500/10 text-xs font-medium text-red-700">
									<span className="border-r border-red-200 p-1">
										<TbArrowDown />
									</span>
									<span className="px-1.5">
										{
											data?.votes?.filter(
												item => !item.positive,
											)?.length
										}
									</span>
								</div>
								<div className="flex list-none items-center rounded border border-yellow-300 bg-yellow-500/10 text-xs font-medium text-yellow-700">
									<span className="border-r border-yellow-300 p-1">
										<TbEye />
									</span>
									<span className="px-1.5">{data?.views}</span>
								</div>
							</div>
							<div className="mt-5 flex w-full items-center justify-between gap-5 text-sm font-light md:mt-0 md:w-fit md:justify-normal md:text-xs">
								<p>
									Posted on{' '}
									<span className="font-medium">
										{moment(data?.createdAt).format(
											'MMM DD, YYYY',
										)}
									</span>
								</p>
								{sessionData?.user?.id !== data?.userId && (
									<BookmarkButton
										bookmarked={!!data?.bookmarked}
										postId={data?.id ?? ''}
									/>
								)}
								{sessionData?.user?.id === data?.userId && (
									<Dropdown
										options={menuOptions || []}
										title="Post Actions"
									/>
								)}
							</div>
						</div>
					</div>
					<h1 className="text-3xl leading-normal font-bold text-gray-800 md:text-4xl">
						{data?.title}
					</h1>
					<div className="space-y-10">
						<p className="border-primary border-l-4 pl-5 text-base font-light text-gray-600">
							{data?.description}
						</p>
						<div className="prose">
							<Markdown
								rehypePlugins={[rehypeRaw]}
								remarkPlugins={[remarkGfm]}>
								{data?.main_text ?? ''}
							</Markdown>
						</div>
					</div>
				</div>
				<div className="flex-[2] space-y-2 md:pr-5">
					{!!data?.cids.length && (
						<Card>
							<SectionHeading icon={<TbFile />} text={`Attachments (${data?._count?.attachments})`} />
							<div className="flex flex-wrap items-center gap-2">
								{data?.cids?.map(item => (
									<ImageContainer key={item} src={item} size='small' />
								))}
							</div>
						</Card>
					)}
					<TagContainer postId={id} userId={data?.userId} showHeading />
					<CommentsContainer postId={id} />
					<Card className='space-y-4'>
						<SectionHeading icon={<HiOutlineCollection />} text={`Chambers containing this Echo (${data?._count?.Chamber})`} />
						<div className='flex items-center gap-2 flex-wrap'>
							{data?.Chamber?.map(chamber =>
								<Link
									className='text-xs text-gray-500 font-medium border border-secondary bg-white rounded px-4 py-1 flex items-center gap-2'
									href={`/chambers/${chamber.id}`}
									key={chamber.id}
								>
									{chamber.name}
								</Link>
							)}
							{!data?._count?.Chamber && <p className='text-xs font-medium text-gray-400'>No Chambers</p>}
						</div>
					</Card>
				</div>
				{showChamberModal && (
					<SearchChamber
						onClose={() => setShowChamberModal(false)}
						onSelect={handleAddEchoToChamber}
					/>
				)}
			</div>
		</div>
	)
}
