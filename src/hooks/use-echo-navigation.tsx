'use client'

import { type ChamberType, listChambers } from "@/actions/chambers";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactElement } from "react";
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
    const [chambers, setChambers] = useState<ChamberType>([]);

    const fetchChambers = async () => {
        const response = await listChambers({ mine: true });
        setChambers(response);
    }
    useEffect(() => {
        fetchChambers();
    }, [])

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
        ...(chambers.length > 0 ? {
            chambers: chambers.map(chamber => ({
                link: `/chambers/${chamber.id}`,
                title: chamber.name,
                sectionHeading: 'Chambers',
                icon: <HiOutlineCollection />,
                current: `/chambers/${chamber.id}` === pathname
            }))
        } : {})
    }), [pathname, chambers]);

    return { navigationData, setCurrentPath, currentPath }
}
