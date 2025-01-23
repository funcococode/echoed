'use client'
import { getPostDetails, type PostDetailType, updateViewCount } from "@/actions/post"
import CommentsContainer from "@/components/ui/comment/comments-container"
import moment from "moment"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { TbArrowDown, TbArrowUp, TbBookmark, TbEye, TbHash, TbLoader, TbLoader2 } from "react-icons/tb"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function Post() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PostDetailType>()
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (id) {
      const postData = await getPostDetails(id);
      setData(postData);
    }
  }, [id])

  useEffect(() => {
    updateViewCount(id).catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetchData().catch(err => console.log(err)).finally(() => setIsLoading(false))
  }, [fetchData])

  if (isLoading) return <div className="w-full grid place-content-center">
    <div className="flex items-center gap-2">
      <TbLoader2 className="text-xl animate-spin" /> Fetching Data
    </div>
  </div>

  return (
    <div className="flex gap-5 divide-x">
      <div className="space-y-10 px-5 flex-[2]">
        <div className="space-y-5">
          <div className="space-y-2 flex justify-between items-center text-sm">
            <Link href={`/user/${data?.userId}`} className="text-indigo-600 capitalize">{data?.user.firstname} {data?.user.lastname}</Link>
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-5 font-light text-xs">
              <p>
                Posted on <span className="font-medium">{moment(data?.createdAt).format('MMM DD, YYYY')}</span>
              </p>
              <button className="rounded-full p-2 border text-gray-400 text-base hover:bg-gray-500/10 hover:text-gray-700">
                <TbBookmark />
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <ul className="flex items-center gap-2">
              {['philosophy', 'meditation', 'vedanta', 'indian']?.map(item => <li key={item} className="list-none flex text-xs font-medium rounded border items-center text-gray-400">
                <span className="p-1 border-r"><TbHash /></span>
                <span className="px-1.5">{item}</span>
              </li>)}
            </ul>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 leading-normal">
          {data?.title}
        </h1>
        <div className="space-y-10">
          <p className="text-base font-light text-gray-600 border-l-4 border-indigo-700 pl-5">{data?.description}</p>
          <Markdown className={'prose'} remarkPlugins={[remarkGfm]}>{data?.main_text}</Markdown>
        </div>
      </div>
      <div className="flex-1">
        <CommentsContainer postId={id} />
      </div>
    </div>
  )
}
