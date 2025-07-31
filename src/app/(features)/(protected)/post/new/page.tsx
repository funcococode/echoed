'use client'
import { addNewEcho } from '@/actions/post'
import MarkdownEditor from '@/components/form/markdown-editor'
import FileUploadForm from '@/components/ui/file-upload-form'
import { useState } from 'react'
import { TbCheck, TbTag } from 'react-icons/tb'
import { toast } from 'sonner'

export default function NewPost() {
	const [question, setQuestion] = useState('')
	const [description, setDescription] = useState('')
	const [details, setDetails] = useState('')

	const onSubmit = async () => {
		// if (question && description) {
		try {
			const payload = {
				title: question,
				description,
				main_text: details,
			}
			const response = await addNewEcho(payload)
			if (response.success) {
				toast.success(response.message, {
					richColors: true,
				})
				setQuestion('')
				setDescription('')
				setDetails('')
			} else {
				throw new Error(response.message)
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				toast.error(e.message, {
					richColors: true,
				})
			}
		}
		// }
	}

	return (
		<div className="border-secondary space-y-5 rounded-lg border p-5">
			<h1 className="text-lg font-semibold text-gray-700">Create a new Echo</h1>
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-500" htmlFor="question">
					Title
				</label>
				<input
					value={question}
					onChange={e => setQuestion(e.target.value)}
					className="w-full rounded bg-gray-100 p-3 text-sm text-gray-600 outline-none"
					name="question"
					placeholder="What's on your mind?"
				/>
			</div>
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-500" htmlFor="description">
					Short Description
				</label>
				<textarea
					value={description}
					onChange={e => setDescription(e.target.value)}
					className="min-h-36 w-full resize-none rounded bg-gray-100 p-3 text-sm text-gray-600 outline-none"
					name="description"
					placeholder="Give us a little context about your thought / question, some references? some examples?"
				/>
			</div>
			<div className="space-y-2">
				<label className="text-sm font-medium text-gray-500" htmlFor="description">
					Details
				</label>
				<MarkdownEditor editorContent={details} setEditorContent={setDetails} />
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
					<button className="flex items-center gap-2 rounded border border-teal-800/20 bg-teal-100/30 px-4 py-2 text-xs font-medium text-teal-800/50">
						<TbTag />
						Add a tag
					</button>
					<FileUploadForm postId="" />
				</div>
				<button
					onClick={onSubmit}
					className="border-primary text-primary hover:bg-primary flex items-center gap-2 rounded border px-4 py-2 text-xs font-medium hover:text-white">
					<TbCheck />
					Publish
				</button>
			</div>
		</div>
	)
}
