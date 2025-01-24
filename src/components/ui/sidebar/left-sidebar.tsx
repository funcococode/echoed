import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbBookmark, TbHome2, TbMessage, TbQuestionMark, TbTag } from "react-icons/tb";

export default function LeftSidebar() {
    const pathname = usePathname();
    const data = [
        {
            link: '/feed',
            title: 'Home',
            icon: <TbHome2 />,
            current: '/feed' === pathname
        },
        {
            link: '/saved',
            title: 'Saved',
            icon: <TbBookmark />,
            current: '/saved' === pathname
        },
        {
            link: '/tags',
            title: 'Tags',
            icon: <TbTag />,
            current: '/tags' === pathname
        },
    ]
    return (
        <div className="md:space-y-2 flex items-center justify-between md:block rounded md:rounded-none">
            {data?.map(item => <Link
                key={item.link}
                href={item.link}
                className={`flex items-center gap-2 px-4 py-2 md:rounded border-b md:border-b-0 md:border-l-4  ${item.current ? "text-indigo-700 border-indigo-700" : "border-transparent"}`}
            >
                {item.icon}
                <h1 className="text-sm font-medium">{item.title}</h1>
            </Link>)}
        </div>
    )
}
