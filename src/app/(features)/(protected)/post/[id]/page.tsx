'use client'
import { deleteEcho, getPostDetails, type PostDetailType, toggleEchoArchive, togglePostVisibilty, updateViewCount } from "@/actions/post"
import Input from "@/components/form/input"
import BookmarkButton from "@/components/ui/bookmark-button"
import CommentsContainer from "@/components/ui/comment/comments-container"
import Dropdown, { type DropdownOption } from "@/components/ui/dropdown/dropdown"
import Icon from "@/components/ui/icon"
import ImageContainer from "@/components/ui/image-container"
import { Modal } from "@/components/ui/modal"
import TagContainer from "@/components/ui/tag/tags-container"
import moment from "moment"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { HiOutlineCollection } from "react-icons/hi"
import { TbArchive, TbArchiveOff, TbArrowDown, TbArrowUp, TbEye, TbEyeClosed, TbEyeglass, TbEyeglassOff, TbLoader2, TbPencil, TbTrash } from "react-icons/tb"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PostDetailType>()
  const [isLoading, setIsLoading] = useState(true);
  const [showChamberModal, setShowChamberModal] = useState(false);
  const { data: sessionData } = useSession();
  const { control } = useForm();

  const fetchData = useCallback(async () => {
    if (id) {
      const postData = await getPostDetails(id);
      setData(postData);
    }
  }, [id])

  useEffect(() => {
    if (data && sessionData?.user?.id !== data?.userId) {
      updateViewCount(id).catch(err => console.log(err))
    }
  }, [data])

  useEffect(() => {
    fetchData().catch(err => console.log(err)).finally(() => setIsLoading(false))
  }, [fetchData])

  const handleVisibility = () => {
    togglePostVisibilty(id, !data?.is_hidden).then(response => {
      if (response) {
        toast.success(`Post visibility updated`, {
          richColors: true
        })
      }
    }).catch(err => console.log(err))
  }

  const handleArchive = () => {
    toggleEchoArchive(id, !data?.is_archived).then(response => {
      if (response) {
        toast.success(!data?.is_archived ? "Post Archived" : 'Post Unarchived', {
          richColors: true
        })
      }
    }).catch(err => console.log(err))
  }

  const handleDelete = () => {
    deleteEcho(id).then(response => {
      if (response) {
        toast.success(`Echo Removed`, {
          richColors: true
        })
      }
    }).catch(err => console.log(err))
  }

  const handleAddToChamber = () => {
    setShowChamberModal(true)
  }

  if (isLoading) return <div className="w-full grid place-content-center">
    <div className="flex items-center gap-2">
      <TbLoader2 className="text-xl animate-spin" /> Fetching Data
    </div>
  </div>

  const menuOptions: DropdownOption<undefined>[] = [
    {
      label: 'Edit',
      icon: <Icon icon={<TbPencil />} size='small' />,
      link: `./edit/${id}`
    },
    {
      label: 'Delete',
      icon: <Icon icon={<TbTrash />} size='small' />,
      action: handleDelete
    },

    {
      label: data?.is_archived ? 'Unarchive' : 'Archive',
      icon: data?.is_archived ? <Icon icon={<TbArchiveOff />} size="small" /> : <Icon icon={<TbArchive />} size='small' />,
      action: handleArchive
    },

    {
      label: data?.is_hidden ? 'Unhide' : 'Hide',
      icon: data?.is_hidden ? <Icon icon={<TbEyeglass />} size='small' /> : <Icon icon={<TbEyeglassOff />} size='small' />,
      action: handleVisibility
    },
    {
      label: 'Add to Chamber',
      icon: <Icon icon={<HiOutlineCollection />} size='small' />,
      action: handleAddToChamber
    }
  ]

  return (
    <div className="flex gap-5 divide-y md:divide-y-0 md:divide-x flex-wrap">
      <div className="space-y-10 flex-[2]">
        <div className="space-y-5">
          <div className="flex flex-wrap justify-between md:items-center md:text-sm">
            <Link href={`/user/${data?.userId}`} className="text-primary capitalize">{data?.user?.firstname} {data?.user?.lastname}</Link>
            <div className="flex items-center gap-2">
              {data?.is_hidden && <div className="list-none flex text-xs font-medium rounded border items-center text-gray-400 bg-gray-500/10 border-gray-200">
                <span className="p-1 border-r border-gray-200"><TbEyeClosed /></span>
                <span className="px-1.5">Hidden</span>
              </div>}
              {data?.is_archived && <div className="list-none flex text-xs font-medium rounded border items-center text-orange-400 bg-orange-500/10 border-orange-200">
                <span className="p-1 border-r border-orange-200"><TbArchive /></span>
                <span className="px-1.5">Archived</span>
              </div>}
              <div className="list-none flex text-xs font-medium rounded border items-center text-primary bg-indigo-500/10 border-indigo-200">
                <span className="p-1 border-r border-indigo-200"><TbArrowUp /></span>
                <span className="px-1.5">{data?.votes?.filter(item => item.positive)?.length}</span>
              </div>
              <div className="list-none flex text-xs font-medium rounded border items-center text-red-700 bg-red-500/10 border-red-200">
                <span className="p-1 border-r border-red-200"><TbArrowDown /></span>
                <span className="px-1.5">{data?.votes?.filter(item => !item.positive)?.length}</span>
              </div>
              <div className="list-none flex text-xs font-medium rounded border items-center text-yellow-700 bg-yellow-500/10 border-yellow-300">
                <span className="p-1 border-r border-yellow-300"><TbEye /></span>
                <span className="px-1.5">{data?.views}</span>
              </div>
            </div>
            <div className="mt-5 md:mt-0 flex justify-between md:justify-normal w-full md:w-fit items-center gap-5 font-light text-sm md:text-xs">
              <p>
                Posted on <span className="font-medium">{moment(data?.createdAt).format('MMM DD, YYYY')}</span>
              </p>
              {sessionData?.user?.id !== data?.userId && <BookmarkButton bookmarked={!!data?.bookmarked} postId={data?.id ?? ''} />}
              {sessionData?.user?.id === data?.userId && <Dropdown options={menuOptions || []} title="Post Actions" />}
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-normal">
          {data?.title}
        </h1>
        <div className="space-y-10">
          <p className="text-base font-light text-gray-600 border-l-4 border-primary pl-5">{data?.description}</p>
          <Markdown className={'prose'} remarkPlugins={[remarkGfm]}>{data?.main_text}</Markdown>

        </div>
        <footer>
          <div className="p-8 rounded-md bg-gray-50 space-y-8 border">
            <h1 className="font-semibold text-sm text-gray-500">Attachments</h1>
            {!!data?.cids?.length && <div className="grid grid-cols-3 gap-4">
              {data?.cids?.map(item => <ImageContainer key={item} src={item} />)}
            </div>}
          </div>
        </footer>
      </div>
      <div className="flex-1 md:pl-4 space-y-10">
        <TagContainer postId={id} userId={data?.userId} showHeading />
        <CommentsContainer postId={id} />
      </div>
      {showChamberModal && <Modal title="Search for a chamber">
        <div>
          <Input name="Chamber Name" control={control} />
        </div>
      </Modal>}
    </div>
  )
}
