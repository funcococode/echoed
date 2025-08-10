'use client'

import EchoLoader from "@/components/ui/loaders/loader"
import LeftSidebar from "@/components/ui/sidebar/left-sidebar"
import useNavigationStore from "@/stores/navigation-store"
import { type ReactElement } from "react"

interface Props {
    children: ReactElement
}

export default function FeedLayout({ children }: Props) {
    const { isChangingPath } = useNavigationStore()

    return (
        // Lock the whole layout to the viewport and prevent page scroll
        <main className="relative mx-auto grid max-w-[80vw] grid-cols-12 gap-2 min-h-dvh h-dvh overflow-hidden items-start">
            {isChangingPath && <EchoLoader overlay />}

            {/* Non-scrolling sidebar (it can scroll internally if taller than viewport) */}
            <aside className="col-span-2 h-full rounded shadow-md shadow-gray-500/10">
                <LeftSidebar />
            </aside>

            {/* Only this column scrolls */}
            <div className="relative col-span-10 h-full overflow-y-auto scrollbar-hide">
                {children}
            </div>

            <div id="search-results" />
        </main>
    )
}
