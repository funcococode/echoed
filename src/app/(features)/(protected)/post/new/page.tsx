'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	TbCheck,
	TbHash,
	TbX,
	TbInfoCircle,
	TbSparkles,
	TbChevronRight,
	TbChevronLeft,
	TbPhoto,
	TbEye,
} from 'react-icons/tb'
import { toast } from 'sonner'

import { addNewEcho } from '@/actions/post'
import MarkdownEditor from '@/components/form/markdown-editor'
import FileUploadForm from '@/components/ui/file-upload-form'
import { cn } from '@/utils/cn'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface Props {
	chamberId?: string
}

// ──────────────────────────────────────────────────────────────────────────────
// New UX: Guided composer (4-step wizard) with live preview
// ──────────────────────────────────────────────────────────────────────────────
const TITLE_MAX = 120
const DESC_MAX = 240

function Counter({ value, max }: { value: number; max: number }) {
	const pct = Math.min(100, Math.round((value / max) * 100))
	return (
		<div className="flex items-center gap-2 text-xs">
			<div className="h-1 w-20 rounded bg-gray-200">
				<div
					style={{ width: `${pct}%` }}
					className={cn(
						'h-1 rounded transition-all',
						pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500',
					)}
				/>
			</div>
			<span className={cn('tabular-nums', value > max ? 'text-rose-600' : 'text-gray-500')}>
				{value}/{max}
			</span>
		</div>
	)
}

function Helper({ children }: { children: React.ReactNode }) {
	return (
		<p className="mt-1 flex items-center gap-2 text-xs text-gray-500">
			<TbInfoCircle className="size-4" />
			{children}
		</p>
	)
}

function TagInput({ tags, setTags, max = 5 }: { tags: string[]; setTags: (t: string[]) => void; max?: number }) {
	const [value, setValue] = useState('')
	const inputRef = useRef<HTMLInputElement | null>(null)

	const add = useCallback(
		(v: string) => {
			const clean = v.trim().replace(/\s+/g, '-')
			if (!clean) return
			if (tags.includes(clean)) return toast.message('Tag already added')
			if (tags.length >= max) return toast.error(`Up to ${max} tags`)
			setTags([...tags, clean])
			setValue('')
		},
		[tags, setTags, max],
	)

	return (
		<div className="border-secondary-light rounded-md border bg-white px-2 py-1">
			<div className="flex flex-wrap items-center gap-2">
				{tags.map(t => (
					<span
						key={t}
						className="group bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
						<TbHash />
						{t}
						<button
							type="button"
							onClick={() => setTags(tags.filter(x => x !== t))}
							className="opacity-70 transition-opacity hover:opacity-100"
							aria-label={`Remove ${t}`}>
							<TbX className="size-4" />
						</button>
					</span>
				))}
				<input
					ref={inputRef}
					value={value}
					onChange={e => setValue(e.target.value)}
					onKeyDown={e => {
						if (e.key === 'Enter' || e.key === ',') {
							e.preventDefault()
							add(value)
						} else if (e.key === 'Backspace' && !value && tags.length) {
							setTags(tags.slice(0, -1))
						}
					}}
					placeholder={tags.length ? '' : 'Add up to 5 tags, press Enter'}
					className="min-w-40 flex-1 bg-transparent p-2 text-sm outline-none placeholder:text-gray-400"
				/>
			</div>
		</div>
	)
}

export default function NewPost({ chamberId }: Props) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [details, setDetails] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [cover, setCover] = useState<string | null>(null)
	const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
	const [submitting, setSubmitting] = useState(false)

	const titleTooLong = title.length > TITLE_MAX
	const descTooLong = description.length > DESC_MAX
	const baseValid = title.trim().length >= 4 && description.trim().length >= 20 && !titleTooLong && !descTooLong
	const detailsValid = details.trim().length >= 30
	const canSubmit = baseValid && detailsValid && !submitting

	// keyboard shortcut
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'enter') {
				e.preventDefault()
				if (canSubmit) void onSubmit()
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [canSubmit])

	const onSubmit = useCallback(async () => {
		try {
			setSubmitting(true)
			const payload = {
				title: title.trim(),
				description: description.trim(),
				main_text: details,
				chamberId,
				tags,
				cover,
			}
			const response = await addNewEcho(payload)
			if (response?.success) {
				toast.success(response.message ?? 'Your Echo is live!', { richColors: true })
				setTitle('')
				setDescription('')
				setDetails('')
				setTags([])
				setCover(null)
				setStep(1)
			} else {
				throw new Error(response?.message || 'Failed to publish')
			}
		} catch (e: unknown) {
			toast.error(e instanceof Error ? e.message : 'Something went wrong', { richColors: true })
		} finally {
			setSubmitting(false)
		}
	}, [title, description, details, chamberId, tags, cover])

	// progress
	const progress = useMemo(() => {
		const s = step
		return s === 1 ? 25 : s === 2 ? 50 : s === 3 ? 75 : 100
	}, [step])

	return (
		<div className="border-secondary-light rounded-md border bg-white shadow-sm">
			{/* top progress */}
			<div className="h-1 w-full bg-gray-100">
				<div className="bg-primary h-1 transition-all" style={{ width: `${progress}%` }} />
			</div>

			<div className="grid grid-cols-12 gap-0">
				{/* Left: stepper */}
				<aside className="border-secondary-light col-span-12 border-r p-4 md:col-span-3">
					<h2 className="mb-3 text-sm font-semibold text-gray-700">Compose Echo</h2>
					<ol className="space-y-2">
						{[1, 2, 3, 4].map(n => (
							<li key={n}>
								<button
									type="button"
									onClick={() => setStep(n as any)}
									className={cn(
										'border-secondary-light flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition-colors',
										step === n
											? 'bg-primary/5 text-primary'
											: 'hover:bg-gray-50',
									)}>
									<span
										className={cn(
											'grid size-6 place-items-center rounded-md text-xs',
											step === n
												? 'bg-primary text-white'
												: 'bg-gray-100 text-gray-500',
										)}>
										{n}
									</span>
									{n === 1 && 'Title & Summary'}
									{n === 2 && 'Details'}
									{n === 3 && 'Extras'}
									{n === 4 && 'Preview & Publish'}
								</button>
							</li>
						))}
					</ol>

					<div className="border-secondary-light mt-6 rounded-md border bg-gradient-to-br from-indigo-50 to-teal-50 p-3">
						<div className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-800">
							<TbSparkles className="size-4" /> Pro tip
						</div>
						<p className="text-xs text-gray-600">
							Use clear headings in Details. Press Cmd/Ctrl + Enter to publish
							quickly.
						</p>
					</div>
				</aside>

				{/* Center: content */}
				<main className="col-span-12 space-y-5 p-5 md:col-span-6">
					{step === 1 && (
						<section className="space-y-10">
							<div className="border-secondary-light border-b border-dashed pb-5">
								<div className="flex items-center justify-between">
									<label
										htmlFor="title"
										className="mb-1 block text-sm font-medium text-gray-700">
										Title
									</label>
									<Counter value={title.length} max={TITLE_MAX} />
								</div>
								<div
									className={cn(
										'relative rounded-md border bg-white',
										titleTooLong
											? 'border-rose-300'
											: 'border-secondary-light',
									)}>
									<input
										id="title"
										value={title}
										onChange={e => setTitle(e.target.value)}
										maxLength={TITLE_MAX + 40}
										placeholder="Concise & compelling (e.g. ‘Writing better hooks in React’)."
										className="w-full rounded-md border-0 bg-transparent p-3.5 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none"
									/>
								</div>
								<Helper>Keep it under {TITLE_MAX} characters.</Helper>
							</div>

							<div className="border-secondary-light border-b border-dashed pb-5">
								<div className="flex items-center justify-between">
									<label
										htmlFor="description"
										className="mb-1 block text-sm font-medium text-gray-700">
										Short Description
									</label>
									<Counter
										value={description.length}
										max={DESC_MAX}
									/>
								</div>
								<div
									className={cn(
										'relative rounded-md border bg-white',
										descTooLong
											? 'border-rose-300'
											: 'border-secondary-light',
									)}>
									<textarea
										id="description"
										value={description}
										onChange={e =>
											setDescription(e.target.value)
										}
										maxLength={DESC_MAX + 80}
										rows={3}
										placeholder="A quick summary to hook readers and set context."
										className="w-full resize-none rounded-md border-0 bg-transparent p-3.5 text-sm leading-6 text-gray-800 placeholder:text-gray-400 focus:outline-none"
									/>
								</div>
								<Helper>
									Aim for {Math.round(DESC_MAX * 0.6)}–{DESC_MAX}{' '}
									characters.
								</Helper>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Tags
								</label>
								<TagInput tags={tags} setTags={setTags} />
							</div>
						</section>
					)}

					{step === 2 && (
						<section className="space-y-3">
							<label
								htmlFor="details"
								className="mb-1 block text-sm font-medium text-gray-700">
								Details
							</label>
							<div className="border-secondary-light overflow-hidden rounded-md border">
								<MarkdownEditor
									editorContent={details}
									setEditorContent={setDetails}
								/>
							</div>
							<Helper>
								Use headings, lists, and code blocks for clarity.
							</Helper>
						</section>
					)}

					{step === 3 && (
						<section className="space-y-5">
							{/* Cover uploader (simple URL input / placeholder) */}
							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Cover image (optional)
								</label>
								<div className="border-secondary-light flex items-center gap-3 rounded-md border bg-white p-3">
									<TbPhoto className="size-5 text-gray-500" />
									<input
										type="url"
										value={cover ?? ''}
										onChange={e =>
											setCover(e.target.value || null)
										}
										placeholder="Paste image URL or leave blank"
										className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
									/>
								</div>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium text-gray-700">
									Attachments
								</label>
								<div className="border-secondary-light rounded-md border bg-white p-3">
									<FileUploadForm postId="" />
								</div>
							</div>
						</section>
					)}

					{step === 4 && (
						<section className="space-y-4">
							<div className="border-secondary-light rounded-md border bg-white p-4">
								<div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
									<TbEye className="size-4" /> Preview
								</div>
								<article className="prose prose-headings:mt-4 prose-p:leading-7 max-w-none">
									<h1 className="mb-1 text-2xl font-bold text-gray-900">
										{title || 'Untitled Echo'}
									</h1>
									<p className="text-gray-600">
										{description ||
											'Short description will appear here.'}
									</p>
									{cover && (
										<img
											src={cover}
											alt="cover"
											className="border-secondary-light mt-3 w-full rounded-md border object-cover"
										/>
									)}
									{/* <div className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-gray-800">{details || 'Start writing your details in the previous step…'}</div> */}
									<Markdown
										rehypePlugins={[rehypeRaw]}
										remarkPlugins={[remarkGfm]}>
										{details ?? ''}
									</Markdown>
									{!!tags.length && (
										<div className="mt-4 flex flex-wrap gap-2">
											{tags.map(t => (
												<span
													key={t}
													className="border-secondary-light inline-flex items-center gap-1 rounded-full border bg-gray-50 px-2 py-1 text-xs text-gray-700">
													<TbHash /> {t}
												</span>
											))}
										</div>
									)}
								</article>
							</div>
						</section>
					)}

					{/* nav */}
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setStep(s => (s > 1 ? ((s - 1) as any) : s))}
							className="border-secondary-light inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
							<TbChevronLeft /> Back
						</button>
						{step < 4 ? (
							<button
								type="button"
								onClick={() => setStep(s => (s + 1) as any)}
								className="border-secondary-light text-primary hover:bg-primary inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:text-white">
								Next <TbChevronRight />
							</button>
						) : (
							<button
								onClick={onSubmit}
								disabled={!canSubmit}
								className={cn(
									'group inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors',
									canSubmit
										? 'border-primary text-primary hover:bg-primary hover:text-white'
										: 'border-secondary-light cursor-not-allowed text-gray-400',
								)}>
								<TbCheck className="size-5" /> Publish
							</button>
						)}
					</div>
				</main>

				{/* Right: live card preview */}
				<aside className="border-secondary-light col-span-12 border-l p-5 md:col-span-3">
					<h3 className="mb-3 text-sm font-semibold text-gray-700">Card Preview</h3>
					<div className="border-secondary-light rounded-md border bg-white p-4">
						{cover ? (
							<div className="border-secondary-light mb-3 overflow-hidden rounded-md border">
								<img
									src={cover}
									alt="cover"
									className="aspect-[16/9] w-full object-cover"
								/>
							</div>
						) : (
							<div className="border-secondary-light mb-3 grid aspect-[16/9] place-items-center rounded-md border bg-gray-50 text-gray-400">
								<TbPhoto className="size-7" />
							</div>
						)}
						<div className="space-y-2">
							<h4 className="line-clamp-2 text-sm font-semibold text-gray-900">
								{title || 'Your title will appear here'}
							</h4>
							<p className="line-clamp-3 text-xs text-gray-600">
								{description ||
									'Your short description will appear here.'}
							</p>
							{!!tags.length && (
								<div className="flex flex-wrap gap-1">
									{tags.map(t => (
										<span
											key={t}
											className="border-secondary-light rounded-full border bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700">
											#{t}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}
