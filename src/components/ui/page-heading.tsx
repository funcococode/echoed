import { type ReactElement } from "react";

interface PageHeadingProps {
    text: string;
    icon?: ReactElement
    count?: number
}

export default function PageHeading({ text, count = 0, icon }: PageHeadingProps) {
    return (
        <div>
            <h1 className={`text-md font-semibold h-20 flex items-center justify-between px-4 rounded-md bg-gray-50 text-gray-400 border`}>
                <span className="flex items-center gap-2">
                    {icon}
                    {text}
                </span>
                {count && <span className="">
                    {count}
                </span>}
            </h1>
        </div>
    )
}
