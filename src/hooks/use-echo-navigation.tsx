'use client'

import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactElement } from "react";
import { GrLineChart } from "react-icons/gr";
import { HiOutlineCollection } from "react-icons/hi";
import { TbArchive, TbBookmark, TbEyeClosed, TbHome2, TbRobotFace, TbTag } from "react-icons/tb";

export interface NavigationLinkProps {
    link: string;
    title: string;
    sectionHeading?: string;
    icon: ReactElement;
    current: boolean
}

type Props = Record<string, NavigationLinkProps[]>

export default function useEchoNavigation() {
    const pathname = usePathname();
    const [currentPath, setCurrentPath] = useState<NavigationLinkProps>();

    const navigationData = useMemo((): Props => ({
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
                sectionHeading: 'Chambers',
                icon: <HiOutlineCollection />,
                current: '/chambers' === pathname
            },
        ],
        posts: [
            {
                link: '/mine',
                title: 'Mine',
                sectionHeading: 'My Echoes',
                icon: <TbRobotFace />,
                current: '/mine' === pathname,
            },
            {
                link: '/saved',
                title: 'Saved',
                sectionHeading: 'Saved Echoes',
                icon: <TbBookmark />,
                current: '/saved' === pathname,
            },
            {
                link: '/hidden',
                title: 'Hidden',
                sectionHeading: 'Hidden Echoes',
                icon: <TbEyeClosed />,
                current: '/hidden' === pathname,
            },
            {
                link: '/archived',
                title: 'Archived',
                sectionHeading: 'Archived Echoes',
                icon: <TbArchive />,
                current: '/archived' === pathname,
            },
        ],
        tags: [
            {
                link: '/tags',
                title: 'All Tags',
                sectionHeading: 'All Tags',
                icon: <TbTag />,
                current: '/tags' === pathname
            },
            {
                link: '/tags/trending',
                title: 'Trending',
                sectionHeading: 'Trending Tags',
                icon: <GrLineChart />,
                current: '/tags/trending' === pathname
            },
        ],
    }), [pathname]);

    return { navigationData, setCurrentPath, currentPath }
}
