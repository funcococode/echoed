'use client'
import { createPortal } from "react-dom";

interface Props {
    children: React.ReactElement
}

export default function SearchResultsPortal({ children }: Props) {
    const container = document.getElementById("search-results");
    if (!container) return null;
    return createPortal(children, container);
}
