import VoteUpButton from '../vote-up-button'
import VoteDownButton from '../vote-down-button'
import { useState } from 'react'
import { addVote } from '@/actions/vote'
import { type AllEchoesType, getPost } from '@/actions/post'
import { cn } from '@/utils/cn'

export interface PostVotesProps {
	post: AllEchoesType['data'][0]
	display?: 'vertical' | 'horizontal'
}

export default function PostVotes({ post, display = 'vertical' }: PostVotesProps) {
	const [currentPost, setCurrentPost] = useState(post)

	const handleClick = async (positive: boolean) => {
		if (post.id) {
			await addVote(post.id, positive)
			const newData = await getPost(post.id)
			setCurrentPost(newData)
		}
	}

	return currentPost ? (
		<div className={cn(`flex flex-col items-center gap-2 `, display === 'horizontal' && 'flex-row')}>
			<VoteUpButton
				handlerFn={handleClick}
				isVoted={currentPost?.votePositive && currentPost?.votedByMe}
			/>
			<p
				className={`text-lg md:text-xs ${currentPost.votedByMe && (currentPost.votePositive ? 'text-primary' : 'text-red-500')}`}>
				{currentPost._count?.votes}
			</p>
			<VoteDownButton
				handlerFn={handleClick}
				isVoted={currentPost.votePositive === false && currentPost.votedByMe}
			/>
		</div>
	) : (
		<></>
	)
}
