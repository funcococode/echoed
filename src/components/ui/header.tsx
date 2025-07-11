'use client';
import React from "react";
import { TbUser } from "react-icons/tb";
import Button from "../form/button";
import { signOut, useSession } from "next-auth/react";
import Logo from "./logo";
import Link from "next/link";
import SearchBar from "./search-bar";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 flex z-10 items-center justify-between rounded-b border border-gray-100 bg-white p-5">
      <Link href={'/'} className="flex items-center gap-2">
        <Logo />
        <h1 className="text-sm font-bold">Echoed</h1>
      </Link>
      <SearchBar />
      <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
        <button className="flex items-center gap-2">
          <TbUser /> {session?.user?.firstname}
        </button>
        <Button
          className="hover:text-red-500"
          onClick={() => signOut()}
          text="Logout"
        />
      </div>
    </header>
  );
}
