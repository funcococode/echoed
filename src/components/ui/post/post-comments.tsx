
import { useState } from 'react'
import { type AllEchoesType } from '@/actions/post'
import { TbMessage2 } from 'react-icons/tb'
import { cn } from '@/utils/cn'

export interface PostVotesProps {
    post: AllEchoesType['data'][0]
    display?: 'horizontal' | 'vertical'
}

export default function PostComments({ post, display = 'vertical' }: PostVotesProps) {
    const [currentPost, setCurrentPost] = useState(post)


    return currentPost ? (
        <div className={cn("mt-1 flex flex-col items-center gap-2 text-xs bg-secondary/50 px-1.5 py-2 rounded text-gray-400 ", display === 'horizontal' && 'flex-row px-0 py-0 bg-transparent')}>
            <span className={cn(display === 'horizontal' && 'order-2')}>
                {currentPost._count?.comments}
            </span>
            <span className={cn(display === 'horizontal' && 'order-1')}>
                <TbMessage2 />
            </span>
        </div>
    ) : (
        <></>
    )
}

