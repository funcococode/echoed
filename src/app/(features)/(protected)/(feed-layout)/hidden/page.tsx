import { auth } from "@/auth";
import PageHeading from "@/components/ui/page-heading";
import { db } from "@/server/db";
import moment from "moment";
import Link from "next/link";
import { TbArrowUp, TbBook, TbBookmark, TbEye, TbEyeClosed, TbMessage } from "react-icons/tb";

export default async function Hidden() {
    const session = await auth();
    const fetchData = async () => {
        const response = await db.post.findMany({
            where: {
                userId: session?.user?.id,
                is_hidden: true
            },
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
        })
        return response;
    }

    const data = await fetchData();
    return (
        <div className="space-y-4">
            <PageHeading text='Hidden Posts' count={data?.length} icon={<TbEyeClosed />} />
            <div className="grid md:grid-cols-2 gap-4">
                {data?.map(item => <li className='space-y-4 list-none p-5 rounded shadow shadow-gray-400/10 border flex flex-col justify-between' key={item.id}>
                    <div className="space-y-4">
                        <div className="font-light text-xs text-gray-400 flex justify-between">
                            <p className="">
                                Posted by <span className="capitalize text-indigo-700 font-medium">{item.user?.firstname} {item.user?.lastname}</span>
                            </p>
                            <p>{moment(item.createdAt).format('MMM DD, YYYY')}</p>
                        </div>
                        <Link href={`/post/${item.id}`} className="font-medium block hover:text-indigo-700">{item.title}</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
                            <h2><TbEye /></h2>
                            <p>{item.views}</p>
                        </div>
                        <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
                            <h2><TbArrowUp /></h2>
                            <p>{item._count?.votes}</p>
                        </div>
                        <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
                            <h2><TbMessage /></h2>
                            <p>{item._count?.comments}</p>
                        </div>
                        <div className="flex items-center text-xs gap-2 text-gray-400 border rounded px-2 w-fit">
                            <h2><TbBookmark /></h2>
                            <p>{item._count?.saves}</p>
                        </div>
                        {item?.is_hidden && <div className="list-none flex text-xs font-medium rounded border items-center text-gray-400 bg-gray-500/10 border-gray-200">
                            <span className="p-1 border-r border-gray-200"><TbEyeClosed /></span>
                            <span className="px-1.5">Hidden</span>
                        </div>}
                    </div>
                </li>)}
            </div>
        </div>
    )
}
