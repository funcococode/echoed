'use client'
import { cn } from '@/lib/utils'
import useNavigationStore from '@/stores/navigation-store'
import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { TbLoader2 } from 'react-icons/tb'

interface PageHeadingProps {
	children?: ReactNode
	className?: string;
}

export default function PageHeading({ children, className }: PageHeadingProps) {
	const { isChangingPath } = useNavigationStore()
	// Ensure the page heading is rendered in the correct place
	if (!children) return null

	// Create a portal to render the page heading in the designated element
	// This allows the page heading to be styled and positioned correctly

	if (typeof document === 'undefined') return null // Ensure this runs only in the browser
	const pageHeadingElement = document.getElementById('page-heading')
	if (!pageHeadingElement) return null // Ensure the element exists

	return createPortal(
		isChangingPath ? (
			<div className="min-h-32 max-h-max animate-pulse overflow-hidden rounded border border-gray-100">
				<section className="flex h-32 items-center justify-between gap-1 px-4">
					<div className="text-secondary flex w-1/4 items-center justify-start gap-4 text-5xl">
						<TbLoader2 className="animate-spin" />
						<span className="font-extralight">Fetching...</span>
					</div>
				</section>
			</div>
		) : (
			<div className={cn("flex min-h-32 h-auto py-5 flex-col overflow-hidden rounded border border-gray-100 *:h-full *:flex-1", className)}>
				{children}
			</div>
		),
		document.getElementById('page-heading')!,
	)
}
