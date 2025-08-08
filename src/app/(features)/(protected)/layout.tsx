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
        <main className="relative">
            {isChangingPath && <EchoLoader overlay />}
            <aside className=' shadow-md shadow-gray-500/10 h-fit rounded absolute -translate-x-full '>
                <LeftSidebar />
            </aside>
            <div id="search-results" className="flex-1"></div>
            {children}
        </main>
    )
}