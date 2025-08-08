'use client';
import React from "react";
import { TbPlus } from "react-icons/tb";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Icon from "./icon";
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
      <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
        {pathname !== '/post/new' ? <Link href='/post/new' className=" text-primary text-xs font-semibold flex items-center gap-2 w-full rounded px-4 py-1">
          <Icon
            icon={<TbPlus className="text-base" />}
            size="x-small"
            color="primary"
          />
          New Echo
        </Link> : <></>}
      </div>
    </header>
  );
}
