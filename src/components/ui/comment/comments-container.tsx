'use client'

import { type CommentType, getComments, postComment } from "@/actions/comment"
import { useCallback, useEffect, useState } from "react"
import Comment from "./comment";

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
        <div className="text-sm rounded-md border-gray-100 pl-4 py-4 space-y-10">
            <div className="space-y-4">
                <h1 className="font-medium">Comments</h1>
                <form action={handlePostComment} className="space-y-2">
                    <textarea name="comment" id="comment" className="w-full resize-none bg-gray-50 border rounded min-h-32 outline-none p-2 text-gray-600 text-sm" placeholder="Contribute your thoughts here"></textarea>
                    <button className="font-semibold rounded-md px-4 py-1.5 bg-gray-100 text-gray-500 hover:bg-gray-800 hover:text-white">Submit</button>
                </form>
            </div>
            <div className="space-y-5">
                <h2 className="pl-4 border-l-4 border-indigo-700 text-indigo-700">All comments ({data?.length})</h2>
                <div className="space-y-2">
                    {data?.map((comment) => {
                        return <Comment key={comment.id} comment={comment} />
                    })}
                </div>
            </div>
        </div>
    )
}
