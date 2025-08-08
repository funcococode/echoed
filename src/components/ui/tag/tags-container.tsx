'use client'
import { TbHash, TbTagPlus } from "react-icons/tb";
import SectionHeading from "../section-heading";
import { useState } from "react";
import TagInput from "./tag-input";
import useTags from "@/hooks/use-tag";
import { useSession } from "next-auth/react";
import Card from "../card/card";

export interface TagContainerProps {
    showHeading?: boolean;
    postId?: string;
    userId?: string;
}

export default function TagContainer({ showHeading = false, postId, userId }: TagContainerProps) {
    const [showAddTagInput, setShowAddTagInput] = useState(false);
    const { data, isLoading, refetch } = useTags({ postId });
    const { data: sessionData } = useSession();

    if (isLoading) return <div className="text-xs font-medium text-gray-500">
        Loading...
    </div>

    return (
        <Card className="space-y-4">
            {showHeading && <div className="flex items-center justify-between">

                <SectionHeading icon={<TbHash />} text={`Tags (${data?.length})`} />
                {sessionData?.user?.id === userId && < button onClick={() => setShowAddTagInput(prev => !prev)} className="border bg-white cursor-pointer py-2 flex items-center text-xs gap-2 text-gray-400 px-2 w-fit rounded">
                    <TbTagPlus />
                    Add Tag
                </button>}
            </div>
            }
            {data?.length ? <ul className="flex items-center gap-2 flex-wrap">
                {data?.map(item => <li key={item?.id} className="list-none flex md:text-xs text-sm font-medium rounded border items-center text-gray-400">
                    <span className="p-1 border-r"><TbHash /></span>
                    <span className="px-1.5">{item?.name}</span>
                </li>)}
            </ul> : <p className="text-xs font-medium text-gray-400">No Tags</p>}
            {showAddTagInput && <TagInput refetch={refetch} postId={postId} />}
        </Card >
    )
}
