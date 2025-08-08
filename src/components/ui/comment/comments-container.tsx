'use client'

import { type CommentType, getComments, postComment } from "@/actions/comment"
import { useCallback, useEffect, useState } from "react"
import Comment from "./comment";
import SectionHeading from "../section-heading";
import Card from "../card/card";
import { TbMessage2 } from "react-icons/tb";

export default function CommentsContainer({ postId }: { postId: string, depth?: number }) {
    const [data, setData] = useState<CommentType[]>([])
    const [refetch, setRefetch] = useState(false);
    const fetchData = useCallback(async () => {
        if (postId) {
            const comments = await getComments(postId);
            setData(comments);
        }
    }, [postId])

    const handlePostComment = useCallback(async (data: FormData) => {
        const payload = {
            comment: data.get('comment') as string ?? '',
            postId
        }
        const response = await postComment(payload);
        if (response?.id) {
            setRefetch(prev => !prev)
        }
    }, [])

    useEffect(() => {
        fetchData().catch(err => console.log(err))
    }, [refetch, fetchData])

    return (
        <Card className="text-xs ">
            <div className="space-y-5">
                <SectionHeading icon={<TbMessage2 />} text={`All comments (${data?.[0]?.post?._count?.comments ?? 0})`} />
                {!data?.length && <p className='text-xs font-medium text-gray-400'>No Comments</p>}
                <div className="space-y-4">
                    <form action={handlePostComment} className="space-y-2">
                        <textarea name="comment" id="comment" className="w-full resize-none bg-white border border-secondary rounded min-h-32 outline-none p-2 text-gray-800 text-sm" placeholder="Contribute your thoughts here"></textarea>
                        <button className="font-semibold rounded px-4 py-1.5 bg-secondary text-gray-500 hover:bg-gray-800 hover:text-white">Submit</button>
                    </form>
                </div>
                {!!data?.length && <div className="space-y-2">
                    {data?.map((comment) => {
                        return <Comment key={comment.id} comment={comment} />
                    })}
                </div>}
            </div>
        </Card>
    )
}
