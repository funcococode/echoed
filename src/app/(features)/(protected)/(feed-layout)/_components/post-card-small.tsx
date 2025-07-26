'use client'

import { type EchoesByType_TypeDef } from "@/actions/post"
import Card from "@/components/ui/card/card"
import moment from "moment"
import Link from "next/link"
import { TbArchive, TbArrowUp, TbBookmark, TbEye, TbEyeClosed, TbMessage } from "react-icons/tb"

interface SmallPostCardProps {
    item: EchoesByType_TypeDef[0]
}

export default function SmallPostCard({ item }: SmallPostCardProps) {
    return (
        <Card>
            <div className="space-y-4">
                <div className="font-light text-xs text-gray-400 flex justify-between">
                    <p className="">
                        Posted by <span className="capitalize text-primary font-medium">{item.user?.firstname} {item.user?.lastname}</span>
                    </p>
                    <p>{moment(item.createdAt).format('MMM DD, YYYY')}</p>
                </div>
                <Link href={`/post/${item.id}`} className="font-medium block hover:text-primary">{item.title}</Link>
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

                {item.is_archived && <div className="list-none flex text-xs font-medium rounded border items-center text-orange-400 bg-orange-500/10 border-orange-200">
                    <span className="p-1 border-r border-orange-200"><TbArchive /></span>
                    <span className="px-1.5">Archived</span>
                </div>}
            </div>
        </Card>
    )
}
