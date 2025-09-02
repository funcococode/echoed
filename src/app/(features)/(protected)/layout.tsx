import { type ReactElement } from "react"
import Sidebar from "./_components/sidebar"
import { SessionProvider } from "next-auth/react"
import Loader from "./_components/loader"
import { auth } from "@/auth"
import { listChambers } from "@/actions/chambers"
import { unstable_cache } from "next/cache"
import ProtectedLayoutClient from "./client"
import { getSettings } from "./settings/actions"

interface Props {
    children: ReactElement
    pageHeading?: ReactElement | null
}
const getChambersData = async (userId: string) => {
    const cached = unstable_cache(
        async () => listChambers({ userId }),
        ["my-chambers", userId],
        { tags: [`my-chambers:${userId}`] }
    );
    return cached();
};

// const getLayoutData = async (userId: string) => {
//     const cached = unstable_cache(
//         async () => getSettings(),
//         ["layout-settings", userId],
//         { tags: [`layout-settings:${userId}`] }
//     );
//     return cached();
// };

export default async function FeedLayout({ children, pageHeading }: Props) {
    const session = await auth();
    const chambers = await getChambersData(session?.user?.id ?? '');
    const { data: { feedDensity, echoLayout, theme } } = await getSettings();

    return (
        // Lock the whole layout to the viewport and prevent page scroll
        <SessionProvider>
            <main className="relative mx-auto grid max-w-[80vw] grid-cols-12 gap-2 min-h-dvh h-dvh overflow-hidden items-start">
                <Loader />
                {/* Non-scrolling sidebar (it can scroll internally if taller than viewport) */}
                <aside className="col-span-2 h-full rounded shadow-md shadow-gray-500/10">
                    <Sidebar
                        user={{
                            id: session?.user?.id || '',
                            name: `${session?.user?.firstname} ${session?.user?.lastname}`,
                            username: session?.user?.username || '',
                            displayName: session?.user?.displayName || '',
                        }}
                        chambers={chambers}
                    />
                </aside>

                {/* Only this column scrolls */}
                <ProtectedLayoutClient pageHeading={pageHeading} feedDensity={feedDensity} echoLayout={echoLayout} theme={theme}>
                    {children}
                </ProtectedLayoutClient>
                <div id="search-results" />
            </main>
        </SessionProvider>
    )
}
