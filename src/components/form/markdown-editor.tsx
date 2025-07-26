'use client'
import Heading from '@tiptap/extension-heading'
import { type Editor, EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { type ReactNode, type Dispatch, type SetStateAction } from 'react'
import { TbBold, TbH1, TbH2, TbH3, TbItalic, TbUnderline } from 'react-icons/tb'

interface Props {
    editorContent: string;
    setEditorContent: Dispatch<SetStateAction<string>>
}

const MenuButton = ({ icon, editor, onClick, name }: { icon: ReactNode, editor: Editor; onClick: () => void, name: string }) => {
    return <button onClick={onClick} className={`text-lg text-white px-2 py-1 rounded ${editor.isActive(name) ? 'bg-primary ' : 'bg-black/90'}`}>
        {icon}
    </button>
}

const MarkdownEditor = ({ editorContent, setEditorContent }: Props) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({
                HTMLAttributes: {
                    class: "text-2xl font-bold capitalize",
                    levels: [1, 2, 3, 4],
                },
            }),
        ],
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class:
                    "appearance-none min-h-96 border rounded w-full py-2 px-3 bg-gray-100 text-black text-sm leading-tight focus:outline-none",
            },
        },
        content: editorContent,
        onUpdate: ({ editor }) => {
            setEditorContent?.(editor.getHTML());
        },
    });

    if (!editor) return null;

    return (
        <div>
            <EditorContent editor={editor} className='rounded ' />
            <BubbleMenu editor={editor} className='border border-gray-200 bg-white shadow p-2 rounded flex items-center gap-4' options={{
                placement: 'bottom-start'
            }}>
                <div className='flex items-center gap-1'>
                    <MenuButton icon={<TbBold />} onClick={() => editor?.chain().focus().toggleBold().run()} name={'bold'} editor={editor} />
                    <MenuButton icon={<TbItalic />} onClick={() => editor?.chain().focus().toggleItalic().run()} name={'italic'} editor={editor} />
                    <MenuButton icon={<TbUnderline />} onClick={() => editor?.chain().focus().toggleUnderline().run()} name={'underline'} editor={editor} />
                </div>

                <div className='flex items-center gap-1'>
                    <MenuButton icon={<TbH1 />} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} name={'heading'} editor={editor} />
                    <MenuButton icon={<TbH2 />} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} name={'heading'} editor={editor} />
                    <MenuButton icon={<TbH3 />} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} name={'heading'} editor={editor} />
                </div>
            </BubbleMenu>
        </div>
    )
}

export default MarkdownEditor
