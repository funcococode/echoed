
import { useState } from 'react'
import { addVote } from '@/actions/vote'
import { type AllEchoesType, getPost } from '@/actions/post'
import { TbMessage2 } from 'react-icons/tb'

export interface PostVotesProps {
    post: AllEchoesType['data'][0]
}

export default function PostComments({ post }: PostVotesProps) {
    const [currentPost, setCurrentPost] = useState(post)

    const handleClick = async (positive: boolean) => {
        if (post.id) {
            await addVote(post.id, positive)
            const newData = await getPost(post.id)
            setCurrentPost(newData)
        }
    }

    return currentPost ? (
        <div className="mt-1 flex flex-col items-center gap-2 text-xs bg-secondary/50 px-1.5 py-2 rounded text-gray-400 ">
            {currentPost._count?.comments}
            <TbMessage2 />
        </div>
    ) : (
        <></>
    )
}

