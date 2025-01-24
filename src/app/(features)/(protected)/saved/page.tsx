import { auth } from "@/auth";
import { db } from "@/server/db";
import moment from "moment";
import Link from "next/link";
import { TbArrowUp, TbBookmark, TbEye, TbMessage } from "react-icons/tb";

export default async function MyTopics() {
  const session = await auth();
  const fetchData = async () => {
    const response = await db.savedPost.findMany({
      where: {
        userId: session?.user?.id
      },
      select: {
        post: {
          include: {
            user: true,
            _count: {
              select: {
                votes: true,
                comments: true,
                saves: true,
              }
            }
          }
        }
      },
    })
    return response;
  }

  const data = await fetchData();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold h-44 flex items-center justify-between px-4 bg-orange-400/10 rounded-md text-orange-300">
        <span className="flex items-center gap-2">
          <TbBookmark />
          Saved Posts
        </span>
        <span className="">
          {data?.length}
        </span>
      </h1>
      <div className="grid md:grid-cols-2 gap-4">
        {data?.map(item => <li className='space-y-4 list-none p-5 rounded shadow shadow-gray-400/10 border flex flex-col justify-between' key={item.post.id}>
          <div className="space-y-4">
            <div className="font-light text-xs text-gray-400 flex justify-between">
              <p className="">
                Posted by <span className="capitalize text-indigo-700 font-medium">{item.post.user?.firstname} {item.post.user?.lastname}</span>
              </p>
              <p>{moment(item.post.createdAt).format('MMM DD, YYYY')}</p>
            </div>
            <Link href={`/post/${item.post.id}`} className="font-medium block hover:text-indigo-700">{item.post.title}</Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
              <h2><TbEye /></h2>
              <p>{item.post?.views}</p>
            </div>
            <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
              <h2><TbArrowUp /></h2>
              <p>{item.post._count?.votes}</p>
            </div>
            <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
              <h2><TbMessage /></h2>
              <p>{item.post._count?.comments}</p>
            </div>
            <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
              <h2><TbBookmark /></h2>
              <p>{item.post._count?.saves}</p>
            </div>
          </div>
        </li>)}
      </div>
    </div>
  )
}
