'use client'
import { useCallback, useRef, useState } from "react";
import { TbHash, TbX } from "react-icons/tb";
import { toast } from "sonner";

export default function TagInput({ tags, setTags, max = 5 }: { tags: string[]; setTags: (t: string[]) => void; max?: number }) {
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