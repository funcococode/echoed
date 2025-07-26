'use client'
import { addNewEcho } from "@/actions/post";
import MarkdownEditor from "@/components/form/markdown-editor";
import FileUploadForm from "@/components/ui/file-upload-form";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { TbCheck, TbTag } from "react-icons/tb";
import { toast } from "sonner";

export default function NewPost() {
    const { control } = useForm();
    const [question, setQuestion] = useState('');
    const [description, setDescription] = useState('');
    const [details, setDetails] = useState('');

    const onSubmit = async () => {
        // if (question && description) {
        try {
            const payload = {
                title: question,
                description,
                main_text: details
            }
            const response = await addNewEcho(payload);
            if (response.success) {
                toast.success(response.message, {
                    richColors: true
                })
                setQuestion('')
                setDescription('')
                setDetails('')
            } else {
                throw new Error(response.message);

            }
        } catch (e: unknown) {
            if (e instanceof Error) {
                toast.error(e.message, {
                    richColors: true
                })
            }
        }
        // }
    }

    return (
        <div className="p-5 rounded-lg border space-y-5">
            <h1 className="text-lg font-semibold text-gray-700">Create a new Echo</h1>
            <div className="space-y-2">
                <label className='text-sm font-medium text-gray-500' htmlFor="question">Title</label>
                <input value={question} onChange={e => setQuestion(e.target.value)} className="p-3 bg-gray-100 rounded w-full outline-none text-gray-600 text-sm" name="question" placeholder="What's on your mind?" />
            </div>
            <div className="space-y-2">
                <label className='text-sm font-medium text-gray-500' htmlFor="description">Short Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="min-h-36 resize-none p-3 bg-gray-100 rounded w-full outline-none text-gray-600 text-sm"
                    name="description"
                    placeholder="Give us a little context about your thought / question, some references? some examples?"
                />
            </div>
            <div className="space-y-2">
                <label className='text-sm font-medium text-gray-500' htmlFor="description">Details</label>
                <MarkdownEditor />
                {/* <textarea
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    className="min-h-80 resize-none p-3 bg-gray-100 rounded w-full outline-none text-gray-600 text-sm"
                    name="details"
                    placeholder="Describe your thought in detail here."
                /> */}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <button className="flex items-center gap-2 text-xs font-medium rounded px-4 py-2 bg-teal-100/30 text-teal-800/50 border border-teal-800/20">
                        <TbTag />
                        Add a tag
                    </button>
                    <FileUploadForm postId="" />
                </div>
                <button onClick={onSubmit} className="flex items-center gap-2 text-xs font-medium rounded px-4 py-2 hover:bg-primary hover:text-white border border-primary text-primary">
                    <TbCheck />
                    Publish
                </button>
            </div>
        </div>
    )
}
