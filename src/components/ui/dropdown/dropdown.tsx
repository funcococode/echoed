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

    const handleClick = (param: string | (() => void) | null) => {
        if (typeof param === 'string') {
            router.push(param)
        }
        if (typeof param === 'function') {
            param()
        }

        setMenuOpen(false)
    }

    return (
        <div className="relative">
            <button onClick={toggleMenu} className={`border-secondary relative rounded p-0.5 border text-gray-600 text-xs hover:bg-gray-500/10 z-20 hover:text-gray-700`}>
                {!menuOpen && <TbMenu2 />}
                {menuOpen && <TbX />}
            </button>
            {menuOpen && <div className="bg-white absolute -top-2 -right-2 min-w-44 max-w-max border border-secondary rounded shadow z-10">
                {title && <h1 className='font-semibold px-2.5 py-4'>{title}</h1>}
                {!options?.length && <p className="text-gray-400">No menu items available</p>}
                <div className="space-y-1 pb-2">
                    {options?.map(item => {
                        return <button onClick={() => handleClick(item.action ?? item.link ?? null)}
                            key={item.label}
                            className="w-full flex items-center hover:bg-gray-100 px-2.5 gap-x-4 cursor-pointer justify-between"
                        >
                            <p className="font-medium text-xs">{item.label}</p>
                            {!!item.icon && item.icon}
                        </button>
                    })}
                </div>
            </div>}
        </div>
    )
}
