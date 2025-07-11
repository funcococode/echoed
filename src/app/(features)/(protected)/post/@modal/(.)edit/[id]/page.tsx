'use client'
import { getPostDetails, updatePost, type PostDetailType } from "@/actions/post";
import { Modal } from "@/components/ui/modal";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";

export default function EditModal() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [data, setData] = useState<PostDetailType>()
    const [isLoading, setIsLoading] = useState(true);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');

    const fetchData = useCallback(async () => {
        if (id) {
            const postData = await getPostDetails(id);
            setData(postData);
            setTitle(postData?.title || '');
            setContent(postData?.description || '');
        }
    }, [id])

    useEffect(() => {
        fetchData().catch(err => console.log(err)).finally(() => setIsLoading(false))
    }, [fetchData])

    const handleSubmit = async () => {
        const payload = {
            title,
            description: content
        }
        const response = await updatePost(id, payload)
        if (response) {
            router.back();
        }
    }

    return (
        <Modal
            title="Edit Post"
            primaryButtonAction={handleSubmit}
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
        >
            {isLoading ? <BiLoader className="animate-spin" /> :
                <div className="flex flex-col space-y-4 min-w-96 rounded-lg">
                    <div className="flex flex-col space-y-2 bg-gray-50 border p-2 rounded">
                        <label htmlFor="title" className="text-xs font-medium text-gray-500">Title</label>
                        <textarea placeholder="Title" id="title" name='title' className="text-sm py-2 rounded outline-none bg-gray-50" value={title} onChange={e => setTitle(e.target.value)}></textarea>
                    </div>
                    <div className="flex flex-col space-y-2 p-2 border bg-gray-50 rounded">
                        <label htmlFor="content" className="text-xs font-medium text-gray-500">Content</label>
                        <textarea placeholder="Content" id='content' name="content" className=" text-sm py-2 rounded min-h-64 outline-none bg-gray-50" value={content} onChange={e => setContent(e.target.value)}></textarea>
                    </div>
                </div>
            }
        </Modal>
    )
}
