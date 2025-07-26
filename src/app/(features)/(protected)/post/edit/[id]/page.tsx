'use client'
import { getPostDetails, updatePost, type PostDetailType } from "@/actions/post";
import Button from "@/components/form/button";
import FileUploadForm from "@/components/ui/file-upload-form";
import Icon from "@/components/ui/icon";
import ImageContainer from "@/components/ui/image-container";
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
    const [description, setDescription] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [attachmentUrl, setAttachmentUrl] = useState<string[]>([]);

    const fetchData = useCallback(async () => {
        if (id) {
            const postData = await getPostDetails(id);
            setData(postData);
            setTitle(postData?.title ?? '');
            setDescription(postData?.description ?? '');
            setContent(postData?.main_text ?? '');
            setAttachmentUrl(postData.cids);
        }
    }, [id])

    useEffect(() => {
        fetchData().catch(err => console.log(err)).finally(() => setIsLoading(false))
    }, [fetchData])

    const handleSubmit = async () => {
        const payload = {
            title,
            description,
            main_text: content
        }
        const response = await updatePost(id, payload)
        if (response) {
            router.back();
        }
    }

    return (
        isLoading ? <BiLoader className="animate-spin" /> :
            <div className="flex flex-col space-y-4 min-w-96 rounded-lg">
                <div className="flex items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Icon icon={<TbPencilPlus />} size="medium" color="primary" />
                        <div>
                            <h1 className="text-lg font-bold">Edit Echo</h1>
                            <p className="text-sm font-medium text-gray-400">Make changes to your Echo and don't forget to save it!</p>
                        </div>
                    </div>
                    <div className="space-x-4 flex justify-end">
                        <Button text={'Save'} onClick={handleSubmit} icon={<TbChecks />} />
                    </div>
                </div>
                <div className="flex flex-col space-y-2 bg-gray-50 border p-4 rounded">
                    <label htmlFor="title" className="text-xs font-medium text-gray-500">Title</label>
                    <textarea placeholder="Title" id="title" name='title' className="text-sm py-2 rounded outline-none bg-gray-50" value={title} onChange={e => setTitle(e.target.value)}></textarea>
                </div>
                <div className="flex flex-col space-y-2 p-4 border bg-gray-50 rounded">
                    <label htmlFor="content" className="text-xs font-medium text-gray-500">Short Description</label>
                    <textarea placeholder="Content" id='content' name="content" className=" text-sm py-2 rounded min-h-44 outline-none bg-gray-50" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                </div>
                <div className="flex flex-col space-y-2 p-4 border bg-gray-50 rounded">
                    <label htmlFor="content" className="text-xs font-medium text-gray-500">Main Content</label>
                    <textarea placeholder="Content" id='content' name="content" className=" text-sm py-2 rounded min-h-96 outline-none bg-gray-50" value={content} onChange={e => setContent(e.target.value)}></textarea>
                </div>
                <div className="flex flex-col p-4 border bg-gray-50 rounded space-y-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xs font-medium text-gray-500">Attachments</h1>
                        <FileUploadForm postId={id} />
                    </div>
                    {!!attachmentUrl.length && <div className="grid grid-cols-4 gap-4 items-start">
                        {attachmentUrl.map(item =>
                            <ImageContainer src={item} key={item} />
                        )}
                    </div>}

                </div>
                <footer className='flex items-start justify-between'>
                </footer>
            </div>

    )
}

