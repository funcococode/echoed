'use client'
import { TbArrowDown } from 'react-icons/tb'
import Icon from './icon'

export interface VoteDownButtonProps {
	isVoted?: boolean
	handlerFn?: (voted: boolean) => void
}

export default function VoteDownButton({ handlerFn, isVoted = false }: VoteDownButtonProps) {
	return (
		<div>
			<button
				onClick={() => handlerFn?.(false)}
				className={`cursor-pointer text-lg transition hover:scale-105 md:text-sm`}>
				<Icon
					icon={<TbArrowDown />}
					size="small"
					color={isVoted ? 'danger-light-bg' : 'default'}
				/>
			</button>
		</div>
	)
}
