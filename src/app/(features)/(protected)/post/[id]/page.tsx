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
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
	TbLoader2,
	TbPencil,
	TbTrash,
} from 'react-icons/tb'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import SearchChamber from '../../(feed-layout)/chambers/_components/search-chamber'
import rehypeRaw from 'rehype-raw'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'

export default function Post() {
	const { id } = useParams<{ id: string }>()
	const [data, setData] = useState<PostDetailType>()
	const [isLoading, setIsLoading] = useState(true)
	const [showChamberModal, setShowChamberModal] = useState(false)
	const { data: sessionData } = useSession()
	const { control } = useForm()

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

	const editor = useEditor(
		{
			immediatelyRender: false,
			editable: false,
			extensions: [
				StarterKit,
				Heading.configure({
					HTMLAttributes: {
						class: 'text-2xl font-bold capitalize',
						levels: [1, 2, 3, 4],
					},
				}),
			],
			content: data?.main_text,
			editorProps: {
				attributes: {
					class: 'appearance-none min-h-96 border rounded w-full py-2 px-3 bg-gray-100 text-black text-sm leading-tight focus:outline-none',
				},
			},
		},
		[data],
	)

	if (isLoading)
		return (
			<div className="grid w-full place-content-center">
				<div className="flex items-center gap-2">
					<TbLoader2 className="animate-spin text-xl" /> Fetching Data
				</div>
			</div>
		)
	return (
		<div className="flex flex-wrap gap-5 divide-y md:divide-x md:divide-y-0">
			<div className="flex-[2] space-y-10">
				<div className="space-y-5">
					<div className="flex flex-wrap justify-between md:items-center md:text-sm">
						<Link
							href={`/user/${data?.userId}`}
							className="capitalize text-primary">
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
							<div className="flex list-none items-center rounded border border-indigo-200 bg-indigo-500/10 text-xs font-medium text-primary">
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
									{moment(data?.createdAt).format('MMM DD, YYYY')}
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
				<h1 className="text-3xl font-bold leading-normal text-gray-800 md:text-4xl">
					{data?.title}
				</h1>
				<div className="space-y-10">
					<p className="border-l-4 border-primary pl-5 text-base font-light text-gray-600">
						{data?.description}
					</p>
					{/* <Markdown
						rehypePlugins={[rehypeRaw]}
						// className={'prose'}
						remarkPlugins={[remarkGfm]}>
						{data?.main_text}
					</Markdown> */}
					<EditorContent editor={editor} allowTransparency />
				</div>
				<footer>
					<div className="space-y-8 rounded-md border bg-gray-50 p-8">
						<h1 className="text-sm font-semibold text-gray-500">Attachments</h1>
						{!!data?.cids?.length && (
							<div className="grid grid-cols-3 gap-4">
								{data?.cids?.map(item => (
									<ImageContainer key={item} src={item} />
								))}
							</div>
						)}
					</div>
				</footer>
			</div>
			<div className="flex-1 space-y-10 md:pl-4">
				<TagContainer postId={id} userId={data?.userId} showHeading />
				<CommentsContainer postId={id} />
			</div>
			{showChamberModal && (
				<SearchChamber onClose={() => setShowChamberModal(false)} onSelect={() => {}} />
			)}
		</div>
	)
}
