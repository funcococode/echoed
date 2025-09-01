'use client'
import useLayoutStore from "@/stores/layout-store"
import { type Layout, type PostLayout } from "@/types/layout"
import { useEffect, type ReactElement } from "react"

interface Props {
    children: ReactElement
    pageHeading?: ReactElement | null
    feedDensity: Layout
    echoLayout: PostLayout
    theme: "dark" | "light" | "system" | null
}
export default function ProtectedLayoutClient({ children, pageHeading, feedDensity, echoLayout, theme }: Props) {
    const { setTheme, setEchoLayout, setLayout } = useLayoutStore();

    useEffect(() => {
        setLayout(feedDensity);
        setEchoLayout(echoLayout);
        localStorage.setItem('theme', theme);
    }, [feedDensity, echoLayout, setLayout, setEchoLayout, setTheme, theme])

    return (
        <div className="relative col-span-10 h-full overflow-y-auto scrollbar-hide">
            <section id="page-heading" className='relative'>
                {pageHeading ?? null}
            </section>
            {children}
        </div>

    )
}
