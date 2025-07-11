'use client'
import { useRouter } from "next/navigation";
import { type ReactElement, useState, type Dispatch, type SetStateAction } from "react";
import { TbMenu2, TbX } from "react-icons/tb";

export interface DropdownOption<T> {
    label: string;
    icon?: ReactElement;
    link?: string;
    action?: () => void;
    stateAction?: Dispatch<SetStateAction<T>>
}

interface Props<T> {
    options: DropdownOption<T>[],
    open?: boolean;
    title?: string;
}


export default function Dropdown<T>({ options, open = false, title }: Props<T>) {
    const [menuOpen, setMenuOpen] = useState(open);
    const router = useRouter();

    const toggleMenu = () => {
        setMenuOpen(prev => !prev)
    }

    const handleLink = (link: string) => {
        router.push(link)
    }

    return (
        <div className="relative">
            <button onClick={toggleMenu} className="relative z-10 rounded p-1.5 border text-gray-400 text-sm hover:bg-gray-500/10 hover:text-gray-700">
                {!menuOpen && <TbMenu2 />}
                {menuOpen && <TbX />}
            </button>
            {menuOpen && <div className="bg-white absolute -top-2 -right-2 space-y-4 min-w-36 max-w-max border rounded shadow">
                {title && <h1 className='font-semibold px-4 pt-4'>{title}</h1>}
                {!options?.length && <p className="text-gray-400">No menu items available</p>}
                <div className="space-y-1 ">
                    {options?.map(item => {

                        return <button onClick={item.action ? item.action : item.link ? () => handleLink(item.link ?? '') : () => { }}
                            key={item.label}
                            className="w-full flex items-center gap-2 py-1 text-sm hover:bg-gray-100 px-4 cursor-pointer"
                        >
                            {!!item.icon && item.icon}
                            <p className="">{item.label}</p>
                        </button>
                    })}
                </div>
            </div>}
        </div>
    )
}
