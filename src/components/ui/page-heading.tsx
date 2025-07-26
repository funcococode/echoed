import useNavigationStore from "@/stores/navigation-store";
import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import { TbLoader2 } from "react-icons/tb";

interface PageHeadingProps {
    children?: ReactNode
}

export default function PageHeading({ children }: PageHeadingProps) {
    const { isChangingPath } = useNavigationStore();
    // Ensure the page heading is rendered in the correct place
    if (!children) return null;

    // Create a portal to render the page heading in the designated element
    // This allows the page heading to be styled and positioned correctly

    if (typeof document === 'undefined') return null; // Ensure this runs only in the browser
    const pageHeadingElement = document.getElementById("page-heading");
    if (!pageHeadingElement) return null; // Ensure the element exists

    return createPortal(
        isChangingPath ? <div className='animate-pulse border border-gray-100 min-h-32 rounded overflow-hidden'>
            <section className='h-32 flex items-center justify-between px-4 gap-1 '>
                <div className='w-1/4 text-5xl flex justify-start gap-4 items-center text-secondary'>
                    <TbLoader2 className="animate-spin" />
                    <span className="font-extralight">Fetching...</span>
                </div>
            </section>
        </div> : <div className='border border-gray-100  min-h-32 rounded overflow-hidden'>
            {children}
        </div>,
        document.getElementById("page-heading")!
    )
}
