import VoteUpButton from "../vote-up-button";
import VoteDownButton from "../vote-down-button";
import { useState } from "react";
import { addVote } from "@/actions/vote";
import { getPost, type PostType } from "@/actions/post";

export interface PostVotesProps {
    post: PostType;
}

export default function PostVotes({ post }: PostVotesProps) {
    const [currentPost, setCurrentPost] = useState(post);

    const handleClick = async (positive: boolean) => {
        if (post.id) {
            await addVote(post.id, positive)
            const newData = await getPost(post.id);
            setCurrentPost(newData)
        }
    }

    return (
        currentPost ? <div className={`flex flex-row md:flex-col items-center gap-2 `}>
            <VoteUpButton handlerFn={handleClick} isVoted={currentPost?.votePositive && currentPost?.votedByMe} />
            <p className={`text-lg md:text-xs ${currentPost.votedByMe && (currentPost.votePositive ? 'text-primary' : 'text-red-500')}`}>
                {currentPost._count?.votes}
            </p>
            <VoteDownButton handlerFn={handleClick} isVoted={currentPost.votePositive === false && currentPost.votedByMe} />
        </div> : <></>
    )
}
