'use client'

import OverlayLoader from "@/components/ui/loaders/overlay-loader"
import useNavigationStore from "@/stores/navigation-store"
import { type ReactElement } from "react"

interface Props {
    children: ReactElement
}

export default function FeedLayout({ children }: Props) {
    const { isChangingPath } = useNavigationStore()
    return (
        <>
            <OverlayLoader loading={isChangingPath} />
            {children}
        </>
    )
}