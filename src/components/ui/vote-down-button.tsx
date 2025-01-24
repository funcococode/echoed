'use client'
import { TbArrowDown } from "react-icons/tb";

export interface VoteDownButtonProps {
    isVoted?: boolean;
    handlerFn?: (voted: boolean) => void
}


export default function VoteDownButton({ handlerFn, isVoted = false }: VoteDownButtonProps) {
    return (
        <div>
            <button
                onClick={() => handlerFn?.(false)}
                className={`text-lg md:text-sm ${isVoted ? 'text-red-600' : 'text-gray-400'}`}
            >
                <TbArrowDown />
            </button>
        </div>
    )
}

