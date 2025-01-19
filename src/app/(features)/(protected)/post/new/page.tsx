'use client'
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form"
import { TbCheck, TbPhoto, TbTag } from "react-icons/tb";
import { toast } from "sonner";

export default function NewPost() {
  const {control} = useForm();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');

  const onSubmit = async () => {
    if(question && description){
        const payload = {
            title: question,
            description
        }
        const response = (await axios.post('/api/post', payload)).data as {success: boolean; message: string}
        if(response.success){
            toast.success(response.message, {
                richColors: true
            })
            setQuestion('')
            setDescription('')
        }
    }
  }

  return (
    <div className="p-5 rounded-lg border space-y-5">
        <h1 className="text-lg font-semibold text-gray-700">Start a new topic</h1>
        <div className="space-y-2">
            <label className='text-sm font-medium text-gray-500' htmlFor="question">Question</label>
            <input value={question} onChange={e => setQuestion(e.target.value)} className="p-3 bg-gray-100 rounded w-full outline-none text-gray-600 text-sm" name="question" placeholder="What's on your mind?"/>
        </div>
        <div className="space-y-2">
            <label className='text-sm font-medium text-gray-500' htmlFor="description">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-60 resize-none p-3 bg-gray-100 rounded w-full outline-none text-gray-600 text-sm" name="description" placeholder="Give us a little context about your question, some references? some examples?"/>
        </div>

        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
                <button className="flex items-center gap-2 text-xs font-medium rounded px-4 py-2 bg-teal-100/30 text-teal-800/50 border border-teal-800/20">
                    <TbTag /> 
                    Add a tag
                </button>
                <button className="flex items-center gap-2 text-xs font-medium rounded px-4 py-2 bg-indigo-100/30 text-indigo-800/50 border border-indigo-800/20">
                    <TbPhoto /> 
                    Add Attachment
                </button>
            </div>
            <button onClick={onSubmit} className="flex items-center gap-2 text-xs font-medium rounded px-4 py-2 hover:bg-indigo-700 hover:text-white border border-indigo-700 text-indigo-700">
                <TbCheck /> 
                Publish
            </button>
        </div>
    </div>
  )
}
