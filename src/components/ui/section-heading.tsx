import { type ReactElement } from "react"

export interface SectionHeadingProps {
    text: string
    icon?: ReactElement
}
export default function SectionHeading({ text, icon }: SectionHeadingProps) {
    return (
        <div className="text-primary flex items-center gap-2">
            {!!icon && icon}
            <h2 className="text-xs font-medium ">{text}</h2>
        </div>
    )
}
