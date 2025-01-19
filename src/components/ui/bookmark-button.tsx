'use client'
import { addBookmark } from "@/actions/bookmark";
import { useState } from "react";
import { TbBookmark } from "react-icons/tb";

export interface BookmarkButtonProps{
    postId: string;
    bookmarked: boolean
}
export default function BookmarkButton({postId, bookmarked}: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(bookmarked);


    const handleClick = async () => {
        await addBookmark(postId)
        setIsBookmarked(prev => !prev)
    }

    return (
        <div>
            <button 
                onClick={handleClick} 
                className={`rounded-full p-1 border text-sm ${isBookmarked ? 'bg-indigo-600 text-white border-transparent' : 'text-gray-400  hover:bg-gray-500/10 hover:text-gray-700'}`}
            >
                <TbBookmark />
            </button>
        </div>
    )
}
