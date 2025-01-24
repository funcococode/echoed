import { TbCalendar, TbClock, TbEye, TbMessage } from "react-icons/tb";
import moment from "moment";
import Link from "next/link";
import BookmarkButton from "../bookmark-button";
import PostVotes from "./post-votes";
import { type PostType } from "@/actions/post";

export interface PostCardProps {
  post: PostType
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="shadow-md shadow-gray-500/10 rounded p-4 md:p-10 flex flex-col md:flex-row gap-5 md:gap-10 border border-gray-100">
      <div className="flex flex-row md:flex-col items-center justify-between text-gray-400 font-semibold">
        <p className="flex flex-row md:flex-col items-center gap-2 text-xs mt-1">{post.views}<TbEye /></p>
        <div className="hidden md:block">
          <PostVotes post={post} />
        </div>
      </div>
      <div className="flex flex-col divide-y gap-5 flex-1">
        <div className="space-y-4 flex-grow">
          <h1 className="text-lg font-semibold text-gray-800">{post.title}</h1>
          <p className="text-sm text-gray-500 font-normal">{post.description}</p>
        </div>
        <div className="flex flex-wrap gap-5 md:gap-0 items-center justify-evenly md:justify-between text-gray-500 text-xs pt-5">
          <Link href={`/user/${post.userId}`}>Posted by <span className="text-indigo-700 capitalize font-medium">{post?.user?.firstname} {post?.user?.lastname}</span></Link>
          <div className="flex items-center gap-4 md:gap-8">
            <p className="flex items-center gap-1 md:gap-2"><TbMessage />{post._count?.comments ?? ''}</p>
            <p className="flex items-center gap-1 md:gap-2">
              <TbClock className="text-sm" />
              <span className="block pt-0.5">
                {post.readTime} min read
              </span>
            </p>
            <p className="flex items-center gap-1 md:gap-2">
              <TbCalendar className="text-sm" />
              <span className="block pt-0.5">
                {moment(post.createdAt).format('MMM DD, yyyy')}
              </span>
            </p>
            <Link className="text-indigo-700 hover:underline underline-offset-2" href={`/post/${post.id}`}>Open</Link>
            <BookmarkButton bookmarked={post.bookmarked ?? false} postId={post.id ?? ''} />
          </div>
          <div className="block md:hidden">
            <PostVotes post={post} />
          </div>
        </div>
      </div>
    </div>
  )
}
