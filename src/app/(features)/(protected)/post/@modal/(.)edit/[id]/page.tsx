'use client'
import { getPostDetails, updatePost, type PostDetailType } from "@/actions/post";
import Button from "@/components/form/button";
import { Modal } from "@/components/ui/modal";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BiLoader } from "react-icons/bi";
import { TbChecks, TbPencilPlus } from "react-icons/tb";

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
            setTitle(postData?.title ?? '');
            setContent(postData?.description ?? '');
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
            title="Edit Echo"
            description="Make minor updates to your Echo"
            open={true}
            onClose={() => router.back()}
        >
            {isLoading ? <BiLoader className="animate-spin" /> :
                <div className="flex flex-col space-y-4 min-w-96 rounded-lg">
                    <div className="flex flex-col space-y-2 bg-gray-50 border p-2 rounded">
                        <label htmlFor="title" className="text-xs font-medium text-gray-500">Title</label>
                        <textarea placeholder="Title" id="title" name='title' className="text-sm py-2 rounded outline-none bg-gray-50" value={title} onChange={e => setTitle(e.target.value)}></textarea>
                    </div>
                    <div className="flex flex-col space-y-2 p-2 border bg-gray-50 rounded">
                        <label htmlFor="content" className="text-xs font-medium text-gray-500">Short Description</label>
                        <textarea placeholder="Content" id='content' name="content" className=" text-sm py-2 rounded min-h-44 outline-none bg-gray-50" value={content} onChange={e => setContent(e.target.value)}></textarea>
                    </div>

                    <footer className='flex items-center justify-between'>
                        <Button onClick={() => window.location.reload()} text={"Edit full Echo"} variant='outline-secondary' icon={<TbPencilPlus />} />
                        <div className="space-x-4 flex justify-end">
                            <Button text={'Save'} onClick={handleSubmit} icon={<TbChecks />} />
                        </div>
                    </footer>
                </div>
            }
        </Modal>
    )
}
