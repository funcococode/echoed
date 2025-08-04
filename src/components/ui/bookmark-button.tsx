'use client'
import { addBookmark } from "@/actions/bookmark";
import { useState } from "react";
import { TbBookmark } from "react-icons/tb";
import Icon from "./icon";

export interface BookmarkButtonProps {
    postId: string;
    bookmarked: boolean
}
export default function BookmarkButton({ postId, bookmarked }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(bookmarked);


    const handleClick = async () => {
        await addBookmark(postId)
        setIsBookmarked(prev => !prev)
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className="cursor-pointer"
            >
                <Icon icon={<TbBookmark className={isBookmarked ? "text-white" : "text-gray-400"} />} size="small" color={`${isBookmarked ? 'primary' : 'secondary'}`} />
            </button>
        </div>
    )
}
