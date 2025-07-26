import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Icon from "../icon";
import useEchoNavigation, { type NavigationLinkProps } from "@/hooks/use-echo-navigation";
import useNavigationStore from "@/stores/navigation-store";
import { cn } from "@/utils/cn";

interface Props {
    slim?: boolean
}


export default function LeftSidebar({ slim = false }: Props) {
    const pathname = usePathname();
    const { navigationData: data } = useEchoNavigation();
    const { setCurrentPath, setIsChangingPath } = useNavigationStore()

    useEffect(() => {
        setIsChangingPath(false)
    }, [pathname, setIsChangingPath]);

    const handleClick = (item: NavigationLinkProps) => {
        setIsChangingPath(true);
        setCurrentPath({
            ...item,
            current: true
        })
    }

    return (
        <>
            {slim ?
                <div className='hidden gap-1 items-center absolute md:block px-10 left-0 -translate-x-full space-y-4'>
                    {Object.entries(data)?.map(([key, value]) =>
                        <div key={key} className="flex flex-col gap-4 border px-2 py-4 border-gray-100 rounded">
                            {value.map(item => <Link onClick={() => handleClick(item)} title={item.title} key={item.link} href={item.link} >
                                <Icon icon={item.icon} hoverEffect size="small" />
                            </Link>)}
                        </div>
                    )}
                </div>
                : <div className="md:space-y-5 flex items-center justify-between md:block rounded  border border-gray-100 py-5 px-2">
                    {Object.entries(data)?.map(([key, value]) => <div key={key} className="space-y-3">
                        {key !== 'default' && <h1 className="text-xs font-semibold text-gray-400 capitalize pl-2">{key}</h1>}
                        <div>

                            {value?.map(item => {
                                return <Link
                                    onClick={() => handleClick(item)}
                                    key={item.link}
                                    href={item.link}
                                    className={`flex items-center gap-3 p-1 md:rounded border-b md:border-b-0 ${item.current ? "text-primary bg-primary/10" : "border-transparent"}`}
                                >
                                    <div className={cn(item.current && 'bg-primary text-white', 'rounded p-2')}>
                                        {item.icon}
                                    </div>
                                    <h2 className="text-xs font-semibold">{item.title}</h2>
                                </Link>
                            })}
                        </div>
                    </div>)}
                </div>}
        </>
    )
}
