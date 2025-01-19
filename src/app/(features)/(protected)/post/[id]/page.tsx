import { db } from "@/server/db"
import moment from "moment"
import { TbArrowDown, TbArrowUp, TbBookmark, TbEye, TbHash } from "react-icons/tb"

export default async function Post({params} : {params: Promise<{id: string}>}) {
  const id = (await params)?.id

  const updateViewCount = async () => {
    await db.post.update({
      where: {id},
      data: {
        views: {
          increment: 1
        }
      }
    });
  }

  const fetchData = async () => {
    'use server'
    const response = await db.post.findFirst({
      where: {
        id
      },
      include: {
        user: true,
        votes: true,
        _count: true,
        tag: true,
        comments: true
      },
    })
    if(response?.id){
      return response;
    }
  }

  await updateViewCount();
  const data = await fetchData();

  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <div className="space-y-2 flex justify-between items-center text-sm">
          <h1 className="text-indigo-600 capitalize">{data?.user.firstname} {data?.user.lastname}</h1>
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
      <div>
        <p className="text-2xl font-light">{data?.description}</p>
      </div>
    </div>
  )
}
