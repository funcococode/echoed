'use client'
import useNavigationStore from '@/stores/navigation-store'
import { type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { TbLoader2 } from 'react-icons/tb'

interface PageHeadingProps {
	children?: ReactNode
}

export default function PageHeading({ children }: PageHeadingProps) {
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
			<div className="min-h-32 animate-pulse overflow-hidden rounded border border-gray-100">
				<section className="flex h-32 items-center justify-between gap-1 px-4">
					<div className="text-secondary flex w-1/4 items-center justify-start gap-4 text-5xl">
						<TbLoader2 className="animate-spin" />
						<span className="font-extralight">Fetching...</span>
					</div>
				</section>
			</div>
		) : (
			<div className="flex min-h-32 flex-col overflow-hidden rounded border border-gray-100 *:h-full *:flex-1">
				{children}
			</div>
		),
		document.getElementById('page-heading')!,
	)
}
