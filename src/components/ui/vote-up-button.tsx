'use client'
import { TbArrowUp } from "react-icons/tb";

export interface VoteUpButtonProps {
    isVoted?: boolean;
    handlerFn?: (voted: boolean) => void
}

export default function VoteUpButton({ isVoted = false, handlerFn }: VoteUpButtonProps) {
    return (
        <div>
            <button
                onClick={() => handlerFn?.(true)}
                className={`text-lg md:text-sm ${isVoted ? 'text-indigo-600' : 'text-gray-400'}`}
            >
                <TbArrowUp />
            </button>
        </div>
    )
}

