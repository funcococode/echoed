'use client'
import { type AllEchoesType, getAllPosts } from "@/actions/post";
import PageHeading from "@/components/ui/page-heading";
import useNavigationStore from "@/stores/navigation-store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PostCard from "@/components/ui/post/post-card";

export default function HiddenEchoes() {
    const session = useSession();
    const { currentPath } = useNavigationStore()
    const [data, setData] = useState<AllEchoesType['data']>([]);

    const fetchData = async () => {
        const response = await getAllPosts({ type: 'hidden' });
        setData(response.data)
    }

    useEffect(() => {
        if (session.status === 'authenticated') {
            fetchData().catch(err => console.log(err));
        }
    }, [])

    return (
        <div className="space-y-4">
            <PageHeading>
                <section className='h-32 flex items-center justify-between px-4 gap-1 '>
                    <div className='w-1/4 text-5xl flex justify-start gap-4 items-center text-secondary'>
                        {currentPath.icon}
                        <span className="font-extralight">{data.length || ''}</span>
                    </div>
                </section>
            </PageHeading>
            <div className="grid md:grid-cols-2 gap-4">
                {data?.map(item => <PostCard key={item.id} post={item} />)}
            </div>
        </div>
    )
}
