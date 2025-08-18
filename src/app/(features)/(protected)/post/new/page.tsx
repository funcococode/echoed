'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	TbCheck,
	TbHash,
	TbSparkles,
	TbChevronRight,
	TbChevronLeft,
	TbPhoto,
	TbEye,
	TbPencil,
} from 'react-icons/tb'
import { toast } from 'sonner'

import { type AddEchoInput, addNewEcho } from '@/actions/post'
import MarkdownEditor from '@/components/form/markdown-editor'
import FileUploadForm from '@/components/ui/file-upload-form'
import { cn } from '@/utils/cn'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Counter from '@/components/form/input-counter'
import TagInput from '@/components/ui/tag/tag-input'
import Input from '@/components/form/input'
import Textarea from '@/components/form/textarea'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'motion/react'

interface Props {
	chamberId?: string
}

const TITLE_MAX = 120
const DESC_MAX = 240
type Step = 1 | 2 | 3 | 4;

const slideVariants = {
	enter: (dir: number) => ({
		x: dir > 0 ? 24 : -24,
		opacity: 0,
		scale: 0.98,
	}),
	center: {
		x: 0,
		opacity: 1,
		scale: 1,
		transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
	},
	exit: (dir: number) => ({
		x: dir > 0 ? -24 : 24,
		opacity: 0,
		scale: 0.98,
		transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
	}),
};

const fieldStagger = {
	hidden: { opacity: 0, y: 4 },
	show: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: 0.06 * i, duration: 0.18 },
	}),
};

export default function NewPost({ chamberId }: Props) {
	// const [title, setTitle] = useState('')
	// const [description, setDescription] = useState('')
	// const [details, setDetails] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [cover, setCover] = useState<string | null>(null)
	const [step, setStep] = useState<Step>(1)
	const [submitting, setSubmitting] = useState(false)
	const [direction, setDirection] = useState(0); // -1 back, +1 next
	const [showSuccessAnim, setShowSuccessAnim] = useState(false)



	const { control, watch, reset, setValue, getValues } = useForm<AddEchoInput>({
		mode: 'onChange',
		defaultValues: {
			title: '',
			description: '',
			main_text: '',
			tags: []
		}
	})

	const title = watch('title');
	const description = watch('description');
	const details = watch('main_text');


	const titleTooLong = title.length > TITLE_MAX
	const descTooLong = description.length > DESC_MAX
	const baseValid = title.trim().length >= 4 && description.trim().length >= 20 && !titleTooLong && !descTooLong
	const detailsValid = details!.trim().length >= 30
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
				main_text: details?.trim(),
				chamberId,
				tags,
				cover,
			}
			const response = await addNewEcho(payload)
			if (response?.success) {
				toast.success(response.message ?? 'Your Echo is live!', { richColors: true })
				setShowSuccessAnim(true)
				setTimeout(() => {
					reset({
						title: '',
						description: '',
						main_text: '',
						tags: [],
					})
					setTags([]);
					setCover('');
					setStep(1);
					setShowSuccessAnim(false)
				}, 2000)

			} else {
				throw new Error(response?.message || 'Failed to publish')
			}
		} catch (e: unknown) {
			toast.error(e instanceof Error ? e.message : 'Something went wrong', { richColors: true })
		} finally {
			setSubmitting(false)
		}
	}, [title, description, details, chamberId, tags, cover])

	// setDirection
	const go = useCallback((to: Step) => {
		setDirection(to > step ? 1 : -1);
	}, [step]);

	// progress
	const progress = useMemo(() => {
		const s = step
		go(step)
		return s === 1 ? 25 : s === 2 ? 50 : s === 3 ? 75 : 100
	}, [step, go])



	return (
		<div className="border-secondary-light rounded-md border bg-white shadow-sm">
			{/* top progress */}
			<div className="h-1 w-full bg-gray-100">
				<div className="bg-primary h-1 transition-all" style={{ width: `${progress}%` }} />
			</div>

			<div className="grid grid-cols-12 gap-0">
				{/* Left: stepper */}
				<aside className="border-secondary-light col-span-12 border-r p-4 md:col-span-3">
					<h2 className="mb-3 text-sm font-semibold text-gray-700 flex items-center gap-2">
						<TbPencil className='text-lg' />
						Compose Echo
					</h2>
					<ol className="space-y-2">
						{[1, 2, 3, 4].map(n => (
							<li key={n}>
								<button
									type="button"
									onClick={() => setStep(n as Step)}
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
				<main className="col-span-12 space-y-5 p-5 md:col-span-9">
					<AnimatePresence mode='wait' custom={direction}>
						{step === 1 && (
							<motion.section initial='hidden' animate='show' className="space-y-5">
								<motion.div custom={0} variants={fieldStagger} className="border-secondary-light border-b border-dashed pb-5">
									<Input
										control={control}
										name='title'
										label='Title'
										maxLength={TITLE_MAX + 40}
										placeholder="Concise & compelling (e.g. ‘Writing better hooks in React’)."
										counterRenderer={(len, max) => <Counter value={len} max={max ?? 0} />}
									/>
								</motion.div>

								<motion.div custom={1} variants={fieldStagger} className="border-secondary-light border-b border-dashed pb-5">
									<Textarea
										control={control}
										name='description'
										label='Short Description'
										maxLength={DESC_MAX + 80}
										placeholder="A quick summary to hook readers and set context."
										counterRenderer={(len, max) => <Counter value={len} max={max ?? 0} />}

									/>
								</motion.div>

								<div>
									<label className="mb-1 block text-sm font-medium text-gray-700">
										Tags
									</label>
									<TagInput tags={tags} setTags={setTags} />
								</div>
							</motion.section>
						)}

						{step === 2 && (
							<motion.div
								key="step-2"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
							>
								<motion.section initial='hidden' animate='show' className="space-y-5">
									<motion.div custom={0} variants={fieldStagger} className="border-secondary-light border-b border-dashed pb-5">
										<label
											htmlFor="details"
											className="mb-1 block text-sm font-medium text-gray-700">
											Details
										</label>
										<div className="border-secondary-light overflow-hidden rounded-md border">
											<MarkdownEditor
												editorContent={getValues('main_text') ?? details ?? ''}
												setEditorContent={value => setValue('main_text', value)}
											/>
										</div>
									</motion.div>
								</motion.section>
							</motion.div>
						)}

						{step === 3 && (
							<motion.div
								key="step-3"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
							>

								<motion.section initial='hidden' animate='show' className="space-y-5">
									{/* Cover uploader (simple URL input / placeholder) */}
									<motion.div custom={0} variants={fieldStagger} className="border-secondary-light border-b border-dashed pb-5">
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
									</motion.div>

									<motion.div custom={1} variants={fieldStagger} className="border-secondary-light border-b border-dashed pb-5">
										<label className="mb-1 block text-sm font-medium text-gray-700">
											Attachments
										</label>
										<div className="border-secondary-light rounded-md border bg-white p-3">
											<FileUploadForm postId="" />
										</div>
									</motion.div>
								</motion.section>
							</motion.div>
						)}

						{step === 4 && (
							<motion.div
								key="step-4"
								custom={direction}
								variants={slideVariants}
								initial="enter"
								animate="center"
								exit="exit"
							>
								<motion.section initial='hidden' animate='show' className="space-y-5">
									<motion.div custom={0} variants={fieldStagger} className="border-secondary-light border-b border-dashed pb-5">
										<div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
											<TbEye className="size-4" /> Preview
										</div>
										<article className="prose prose-headings:mt-4 prose-p:leading-7 max-w-none">
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
											<h1 className="mb-1 text-2xl font-bold text-gray-900">
												{title ?? 'Untitled Echo'}
											</h1>
											<p className="text-gray-600">
												{description ??
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
										</article>
									</motion.div>
								</motion.section>
							</motion.div>
						)}

						{showSuccessAnim && (
							<motion.div
								initial={{ opacity: 0, scale: 0.6 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.6 }}
								transition={{ duration: 0.4 }}
								className="fixed inset-0 flex items-center justify-center z-50"
							>
								<div className="bg-white shadow-2xl rounded-full p-6 border-4 border-green-500">
									<TbCheck className="text-green-500 w-16 h-16" />
								</div>
							</motion.div>
						)}

					</AnimatePresence>

					{/* nav */}
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setStep(s => (s > 1 ? ((s - 1) as Step) : s))}
							className="border-secondary-light inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
							<TbChevronLeft /> Back
						</button>
						{step < 4 ? (
							<button
								type="button"
								onClick={() => setStep(s => (s + 1) as Step)}
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
				{/* <aside className="border-secondary-light col-span-12 border-l p-5 md:col-span-3">
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
				</aside> */}
			</div>
		</div>
	)
}


