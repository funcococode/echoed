import { type ReactElement } from "react";

interface Props {
    children: ReactElement
}

export default function RightSidebar({ children }: Props) {
    return (
        <div className="space-y-5">
            {children}
        </div>
    )
}
