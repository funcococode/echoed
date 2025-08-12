'use client'
import Heading from '@tiptap/extension-heading'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import { renderToMarkdown } from '@tiptap/static-renderer/pm/markdown'

import { type ReactNode, type Dispatch, type SetStateAction } from 'react'
import {
	TbBold,
	TbH1,
	TbH2,
	TbH3,
	TbItalic,
	TbUnderline,
	TbStrikethrough,
	TbCode,
	TbLink,
	TbList,
	TbListNumbers,
	TbQuote,
	TbMinus,
	TbArrowBackUp,
	TbArrowForwardUp,
} from 'react-icons/tb'

interface Props {
	/** Pass/receive MARKDOWN here */
	editorContent: string
	setEditorContent: Dispatch<SetStateAction<string>>
}

const IconBtn = ({
	icon,
	onClick,
	active = false,
	title,
	disabled = false,
}: {
	icon: ReactNode
	onClick: () => void
	active?: boolean
	title?: string
	disabled?: boolean
}) => (
	<button
		type="button"
		title={title}
		onClick={onClick}
		disabled={disabled}
		className={`rounded px-2 py-1 text-lg text-white transition ${active ? 'bg-primary' : 'bg-black/90 hover:bg-black'} disabled:cursor-not-allowed disabled:opacity-40`}>
		{icon}
	</button>
)

const MarkdownEditor = ({ editorContent, setEditorContent }: Props) => {
	const editor = useEditor({
		extensions: [
			// StarterKit gives: Paragraph, Text, Document, Bold, Italic, Strike,
			// Blockquote, BulletList, OrderedList, Code, CodeBlock, HorizontalRule, History, etc.
			StarterKit,
			Underline,
			Link.configure({
				openOnClick: false,
				autolink: true,
				protocols: ['http', 'https', 'mailto', 'tel'],
				HTMLAttributes: { rel: 'noopener noreferrer nofollow' },
			}),
			Heading.configure({
				levels: [1, 2, 3, 4],
				HTMLAttributes: {
					class: 'font-bold capitalize',
				},
			}),
		],
		// You can pass initial markdown directly too (see setContent below)
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class: 'appearance-none min-h-96 border border-secondary rounded w-full py-2 px-3 bg-gray-100 text-black text-sm leading-tight focus:outline-none',
			},
		},
		onUpdate: ({ editor }) => {
			const md = renderToMarkdown({
				extensions: editor.extensionManager.extensions,
				content: editor.getJSON(),
			})
			setEditorContent(md) // now you're storing Markdown
		},
	})

	if (!editor) return null

	const isHeading = (level: 1 | 2 | 3) => editor.isActive('heading', { level })

	const toggleLink = () => {
		const prev = editor.getAttributes('link')?.href as string | undefined
		const url = window.prompt('Enter URL', prev || '')
		if (url === null) return
		if (url.trim() === '') {
			editor.chain().focus().unsetLink().run()
			return
		}
		editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
	}

	return (
		<div>
			<EditorContent editor={editor} className="rounded" />
			<BubbleMenu
				editor={editor}
				className="flex flex-wrap items-center gap-2 rounded border border-gray-200 bg-white p-2 shadow"
				options={{ placement: 'bottom-start' }}>
				{/* Inline formatting */}
				<div className="flex items-center gap-1">
					<IconBtn
						title="Bold"
						icon={<TbBold />}
						active={editor.isActive('bold')}
						onClick={() => editor.chain().focus().toggleBold().run()}
					/>
					<IconBtn
						title="Italic"
						icon={<TbItalic />}
						active={editor.isActive('italic')}
						onClick={() => editor.chain().focus().toggleItalic().run()}
					/>
					<IconBtn
						title="Underline"
						icon={<TbUnderline />}
						active={editor.isActive('underline')}
						onClick={() => editor.chain().focus().toggleUnderline().run()}
					/>
					<IconBtn
						title="Strikethrough"
						icon={<TbStrikethrough />}
						active={editor.isActive('strike')}
						onClick={() => editor.chain().focus().toggleStrike().run()}
					/>
					<IconBtn
						title="Inline code"
						icon={<TbCode />}
						active={editor.isActive('code')}
						onClick={() => editor.chain().focus().toggleCode().run()}
					/>
					<IconBtn
						title="Link"
						icon={<TbLink />}
						active={editor.isActive('link')}
						onClick={toggleLink}
					/>
				</div>

				{/* Headings */}
				<div className="flex items-center gap-1">
					<IconBtn
						title="Heading 1"
						icon={<TbH1 />}
						active={isHeading(1)}
						onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					/>
					<IconBtn
						title="Heading 2"
						icon={<TbH2 />}
						active={isHeading(2)}
						onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					/>
					<IconBtn
						title="Heading 3"
						icon={<TbH3 />}
						active={isHeading(3)}
						onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					/>
				</div>

				{/* Blocks & lists */}
				<div className="flex items-center gap-1">
					<IconBtn
						title="Bullet list"
						icon={<TbList />}
						active={editor.isActive('bulletList')}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					/>
					<IconBtn
						title="Ordered list"
						icon={<TbListNumbers />}
						active={editor.isActive('orderedList')}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					/>
					<IconBtn
						title="Blockquote"
						icon={<TbQuote />}
						active={editor.isActive('blockquote')}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					/>
					<IconBtn
						title="Code block"
						icon={<TbCode />}
						active={editor.isActive('codeBlock')}
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					/>
					<IconBtn
						title="Horizontal rule"
						icon={<TbMinus />}
						onClick={() => editor.chain().focus().setHorizontalRule().run()}
					/>
				</div>

				{/* History */}
				<div className="flex items-center gap-1">
					<IconBtn
						title="Undo"
						icon={<TbArrowBackUp />}
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
					/>
					<IconBtn
						title="Redo"
						icon={<TbArrowForwardUp />}
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
					/>
				</div>
			</BubbleMenu>
		</div>
	)
}

export default MarkdownEditor
