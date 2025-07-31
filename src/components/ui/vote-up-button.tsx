'use client'
import { TbArrowUp } from 'react-icons/tb'
import Icon from './icon'

export interface VoteUpButtonProps {
	isVoted?: boolean
	handlerFn?: (voted: boolean) => void
}

export default function VoteUpButton({ isVoted = false, handlerFn }: VoteUpButtonProps) {
	return (
		<div>
			<button
				onClick={() => handlerFn?.(true)}
				className={`cursor-pointer text-lg hover:scale-105 md:text-sm`}>
				<Icon
					icon={<TbArrowUp />}
					size="small"
					color={isVoted ? 'success-light-bg' : 'default'}
				/>
			</button>
		</div>
	)
}
