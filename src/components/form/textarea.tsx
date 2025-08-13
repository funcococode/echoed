'use client'

import { cn } from '@/lib/utils'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

export interface TextareaProps<T extends FieldValues> {
    name: string
    control: Control<T>
    placeholder?: string
    showLabel?: boolean
    label?: string
    description?: string
    autoComplete?: string
    maxLength?: number
    showCounter?: boolean
    disabled?: boolean
    sectioned?: boolean
    counterRenderer?: (len: number, max?: number) => React.ReactNode
    rows?: number
}

export default function Textarea<T extends FieldValues>({
    control,
    name,
    placeholder,
    showLabel = true,
    label,
    description,
    autoComplete,
    maxLength,
    showCounter = false,
    disabled,
    sectioned = true,
    counterRenderer,
    rows = 4,
}: TextareaProps<T>) {
    return (
        <div className={cn(sectioned && 'border-secondary-light border-b border-dashed pb-5')}>
            <Controller
                name={name as FieldPath<T>}
                control={control}
                render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
                    const valueStr = (value ?? '') as string
                    const counterNode =
                        counterRenderer?.(valueStr.length, maxLength) ??
                        (showCounter && typeof maxLength === 'number' ? (
                            <span className="text-xs tabular-nums text-gray-500">{valueStr.length}/{maxLength}</span>
                        ) : null)

                    return (
                        <>
                            {/* Top row: label + counter */}
                            {(showLabel || counterNode) && (
                                <div className="mb-1 flex items-center justify-between">
                                    {showLabel ? (
                                        <label
                                            htmlFor={name}
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            {label ?? name}
                                        </label>
                                    ) : <span />}
                                    {counterNode}
                                </div>
                            )}

                            {/* Field container */}
                            <div
                                className={cn(
                                    'relative rounded-md border bg-white',
                                    error ? 'border-rose-300' : 'border-secondary-light',
                                    disabled && 'opacity-60 pointer-events-none'
                                )}
                            >
                                <textarea
                                    ref={ref}
                                    id={name}
                                    name={name}
                                    value={valueStr}
                                    onChange={(e) => {
                                        if (maxLength && e.target.value.length > maxLength) return
                                        onChange(e)
                                    }}
                                    onBlur={onBlur}
                                    placeholder={placeholder}
                                    autoComplete={autoComplete}
                                    aria-invalid={!!error}
                                    rows={rows}
                                    className="w-full resize-y rounded-md border-0 bg-transparent p-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                                />
                            </div>

                            {/* Helper / error line */}
                            <div className="mt-1 flex items-start justify-between text-[11px] leading-4">
                                <div className="text-neutral-500">
                                    {error?.message ? (
                                        <span className="text-red-600">{error.message}</span>
                                    ) : description ? (
                                        <span>{description}</span>
                                    ) : null}
                                </div>
                            </div>
                        </>
                    )
                }}
            />
        </div>
    )
}
