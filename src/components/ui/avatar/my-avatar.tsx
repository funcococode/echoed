'use client'
import { useSession } from "next-auth/react";
import Avatar from "./avatar";

export default function MyAvatar() {
    const { data: session } = useSession();
    return (
        <Avatar url={session?.user?.image} username={session?.user?.username} size="sm" shape="circle" />
    )
}
