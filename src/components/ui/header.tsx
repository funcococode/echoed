'use client';
import React from "react";
import { useSession } from "next-auth/react";
import useNavigationStore from "@/stores/navigation-store";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { currentPath, isChangingPath } = useNavigationStore();

  return (
    <header className="sticky top-0 flex z-40 items-center justify-between rounded-b border border-gray-100 bg-white p-5">
      <div className="flex items-center gap-2">
        <p className={`text-xs text-gray-500 font-semibold ${isChangingPath ? "animate-pulse" : ""}`}>
          {!isChangingPath ? <span className="flex items-center gap-1">{currentPath?.sectionHeading || 'Feed'}</span> : ''}
        </p>
      </div>
    </header>
  );
}
