'use client'
import { getPostDetails, type PostDetailType, togglePostVisibilty, updateViewCount } from "@/actions/post"
import CommentsContainer from "@/components/ui/comment/comments-container"
import Dropdown, { type DropdownOption } from "@/components/ui/dropdown/dropdown"
import TagContainer from "@/components/ui/tag/tags-container"
import moment from "moment"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { TbArchive, TbArrowDown, TbArrowUp, TbBookmark, TbEye, TbEyeClosed, TbEyeDown, TbEyeglass, TbEyeglass2, TbEyeglassOff, TbLoader2, TbPencil, TbTrash } from "react-icons/tb"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PostDetailType>()
  const [isLoading, setIsLoading] = useState(true);
  const { data: sessionData } = useSession();

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
        alert(`Post visibility updated`)
      }
    }).catch(err => console.log(err))
  }

  if (isLoading) return <div className="w-full grid place-content-center">
    <div className="flex items-center gap-2">
      <TbLoader2 className="text-xl animate-spin" /> Fetching Data
    </div>
  </div>

  const menuOptions: DropdownOption<undefined>[] = [
    {
      label: 'Edit',
      icon: <TbPencil />,
      link: `./edit/${id}`
    },
    {
      label: 'Delete',
      icon: <TbTrash />,
    },

    {
      label: 'Archive',
      icon: <TbArchive />,
    },

    {
      label: data?.is_hidden ? 'Unhide' : 'Hide',
      icon: data?.is_hidden ? <TbEyeglass /> : <TbEyeglassOff />,
      action: handleVisibility
    }
  ]

  return (
    <div className="flex gap-5 divide-y md:divide-y-0 md:divide-x flex-wrap">
      <div className="space-y-10 md:px-5 flex-[2]">
        <div className="space-y-5">
          <div className="flex flex-wrap justify-between md:items-center md:text-sm">
            <Link href={`/user/${data?.userId}`} className="text-indigo-600 capitalize">{data?.user.firstname} {data?.user.lastname}</Link>
            <div className="flex items-center gap-2">
              {data?.is_hidden && <div className="list-none flex text-xs font-medium rounded border items-center text-gray-400 bg-gray-500/10 border-gray-200">
                <span className="p-1 border-r border-gray-200"><TbEyeClosed /></span>
                <span className="px-1.5">Hidden</span>
              </div>}
              <div className="list-none flex text-xs font-medium rounded border items-center text-indigo-700 bg-indigo-500/10 border-indigo-200">
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
              {sessionData?.user?.id !== data?.userId && <button className="rounded-full p-2 border text-gray-400 text-base hover:bg-gray-500/10 hover:text-gray-700">
                <TbBookmark />
              </button>}
              {sessionData?.user?.id === data?.userId && <Dropdown options={menuOptions || []} title="Edit Post" />}
            </div>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-normal">
          {data?.title}
        </h1>
        <div className="space-y-10">
          <p className="text-base font-light text-gray-600 border-l-4 border-indigo-700 pl-5">{data?.description}</p>
          <Markdown className={'prose'} remarkPlugins={[remarkGfm]}>{data?.main_text}</Markdown>
        </div>
      </div>
      <div className="flex-1 md:pl-4 space-y-10">
        <TagContainer postId={id} />
        <CommentsContainer postId={id} />
      </div>
    </div>
  )
}
