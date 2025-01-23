'use client'
import { getAllPosts, type PostType } from "@/actions/post";
import { getUser, type UserType } from "@/actions/user";
import PostCard from "@/components/ui/post/post-card";
import moment from "moment";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { id } = useParams();
  const [data, setData] = useState<UserType>();
  const [posts, setPosts] = useState<PostType[]>([]);


  const fetchData = async () => {
    const userData = await getUser({ id: id as string })
    const postData = (await getAllPosts({ userId: id as string })).data;
    setData(userData);
    setPosts(postData);
  }

  useEffect(() => {
    if (!id) return redirect('/')
    fetchData().catch(err => console.log(err));
  }, [])

  return (
    <section className="space-y-10">
      <div className="space-y-5 p-5 border border-gray-100 shadow shadow-gray-400/10 rounded-md">
        <div className="text-2xl rounded-md bg-white w-fit flex items-center gap-2">
          <h1 className="font-medium capitalize">{data?.firstname} {data?.lastname}</h1>
          <p className="font-light text-gray-500">(@{data?.username})</p>
        </div>
        <div className="flex items-center gap-10">
          <p className="space-y-2 flex flex-col bg-white rounded-md w-fit">
            <span className="text-xs tex-gray-200">
              Posts
            </span>
            <span className="text-sm font-bold">
              {data?._count?.Posts}
            </span>
          </p>
          <p className="space-y-2 flex flex-col bg-white rounded-md w-fit">
            <span className="text-xs tex-gray-200">
              Joined on
            </span>
            <span className="text-sm font-bold">
              {moment(data?.createdAt).format('MMM DD, YYYY')}
            </span>
          </p>
          <p className="space-y-2 flex flex-col bg-white rounded-md w-fit">
            <span className="text-xs tex-gray-200">
              Tags Followed
            </span>
            <span className="text-sm font-bold">
              {data?._count?.tag}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-10 ">
        <h1 className="text-sm text-indigo-700 border-l-4 border-indigo-700 pl-5">Posts</h1>
        {posts?.map(item => <PostCard key={item.id} post={item} />)}
      </div>

    </section>
  )
}
