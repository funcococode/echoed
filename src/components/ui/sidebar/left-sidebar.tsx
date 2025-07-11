import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { GrLineChart } from "react-icons/gr";
import { HiOutlineCollection } from "react-icons/hi";
import { TbArchive, TbBookmark, TbEyeClosed, TbHome2, TbRobotFace, TbTag } from "react-icons/tb";
import OverlayLoader from "../loaders/overlay-loader";

interface Props {
    slim?: boolean
}

interface Data {
    link: string;
    title: string;
    icon: ReactElement;
    current: boolean
}

type SidebarDataProp = Record<string, Data[]>

export default function LeftSidebar({ slim = false }: Props) {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useMemo(() => {
        setLoading(false)
    }, [pathname])

    const data: SidebarDataProp = {
        default: [
            {
                link: '/feed',
                title: 'Home',
                icon: <TbHome2 />,
                current: '/feed' === pathname
            },
            {
                link: '/chambers',
                title: 'Chambers',
                icon: <HiOutlineCollection />,
                current: '/chambers' === pathname
            },
        ],
        posts: [
            {
                link: '/mine',
                title: 'Mine',
                icon: <TbRobotFace />,
                current: '/mine' === pathname,
            },
            {
                link: '/saved',
                title: 'Saved',
                icon: <TbBookmark />,
                current: '/saved' === pathname,
            },
            {
                link: '/hidden',
                title: 'Hidden',
                icon: <TbEyeClosed />,
                current: '/hidden' === pathname,
            },
            {
                link: '/archived',
                title: 'Archived',
                icon: <TbArchive />,
                current: '/archived' === pathname,
            },
        ],
        tags: [
            {
                link: '/tags',
                title: 'All Tags',
                icon: <TbTag />,
                current: '/tags' === pathname
            },
            {
                link: '/tags/trending',
                title: 'Trending',
                icon: <GrLineChart />,
                current: '/tags/trending' === pathname
            },
        ]
    }

    const handleClick = () => {
        setLoading(true);
    }


    return (
        <>
            <OverlayLoader loading={loading} />
            {slim ?
                <div className='hidden gap-1 items-center absolute md:block px-10 left-0 -translate-x-full space-y-4'>
                    {Object.entries(data)?.map(([key, value]) =>
                        <div key={key} className="space-y-3 border px-2 py-4 border-gray-100 rounded">
                            {value.map(item => <Link onClick={handleClick} title={item.title} key={item.link} href={item.link} className='grid place-content-center p-2 rounded-full bg-gray-400/10 text-gray-400 border border-gray-100 hover:bg-indigo-700 hover:text-white'>{item.icon}</Link>)}
                        </div>
                    )}
                </div>
                : <div className="md:space-y-5 flex items-center justify-between md:block rounded  border border-gray-100 py-5 px-2">
                    {Object.entries(data)?.map(([key, value]) => <div key={key} className="space-y-3">
                        {key !== 'default' && <h1 className="text-xs font-semibold text-gray-400 capitalize pl-2">{key}</h1>}
                        <div>

                            {value?.map(item => {
                                return <Link
                                    onClick={handleClick}
                                    key={item.link}
                                    href={item.link}
                                    className={`flex items-center gap-3 pl-2 py-2 md:rounded border-b md:border-b-0 ${item.current ? "text-indigo-700 bg-indigo-700/10" : "border-transparent"}`}
                                >
                                    {item.icon}
                                    <h2 className="text-xs font-medium">{item.title}</h2>
                                </Link>
                            })}
                        </div>
                    </div>)}
                </div>}
        </>
    )
}
