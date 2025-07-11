'use client'
import { TbHash, TbTagPlus } from "react-icons/tb";
import SectionHeading from "../section-heading";
import { useState } from "react";
import TagInput from "./tag-input";
import useTags from "@/hooks/use-tag";

export interface TagContainerProps {
    showHeading?: boolean;
    postId?: string;
}

export default function TagContainer({ showHeading = false, postId }: TagContainerProps) {
    const [showAddTagInput, setShowAddTagInput] = useState(false);
    const { data, isLoading, refetch } = useTags({ postId });

    if (isLoading) return <div className="text-xs font-medium text-gray-500">
        Loading...
    </div>

    return (
        <div className="space-y-4">
            {showHeading && <SectionHeading text={`Tags`} />}
            {data?.length ? <ul className="flex items-center gap-2 flex-wrap">
                {data?.map(item => <li key={item?.id} className="list-none flex md:text-xs text-sm font-medium rounded border items-center text-gray-400">
                    <span className="p-1 border-r"><TbHash /></span>
                    <span className="px-1.5">{item?.name}</span>
                </li>)}
            </ul> : <></>}
            <button onClick={() => setShowAddTagInput(prev => !prev)} className="border flex items-center text-xs gap-2 text-gray-400 px-2 py-0.5 rounded">
                <TbTagPlus />
                Add Tag
            </button>
            {showAddTagInput && <TagInput refetch={refetch} postId={postId} />}
        </div>
    )
}
