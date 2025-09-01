'use client'

import { cn } from '@/lib/utils'
import { type ReactElement, useMemo, useState } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { TbAlertCircle, TbCheck, TbEye, TbEyeOff } from 'react-icons/tb'
import { Input as FormInput } from '../ui/input'

export interface InputProps<T extends FieldValues> {
  type?: string
  name: string
  control: Control<T>
  placeholder?: string
  showLabel?: boolean
  withIcon?: boolean
  icon?: ReactElement | null
  label?: string
  description?: string
  autoComplete?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  maxLength?: number
  allowClear?: boolean
  showCounter?: boolean
  disabled?: boolean
  kind?: 'text' | 'email' | 'password'
  matchToValue?: string
  matchToLabel?: string
  showPasswordStrength?: boolean
  showPasswordVisiblilityToggle?: boolean
  /** Wrap with  section like your design */
  sectioned?: boolean
  /** Optional custom counter renderer (e.g. your <Counter />) */
  counterRenderer?: (len: number, max?: number) => React.ReactNode
}

function scorePassword(pw: string) {
  let score = 0
  if (!pw) return { score, label: 'Too weak' } as const
  if (pw.length >= 8) score += 1
  if (pw.length >= 12) score += 1
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)
  const hasSymbol = /[^A-Za-z0-9]/.test(pw)
  const variety = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length
  if (variety >= 2) score += 1
  if (variety >= 3) score += 1
  const labels = ['Too weak', 'Weak', 'Okay', 'Good', 'Strong'] as const
  return { score: Math.min(score, 4), label: labels[Math.min(score, 4)] } as const
}

export default function Input<T extends FieldValues>({
  type = 'text',
  control,
  name,
  placeholder,
  showLabel = true,
  withIcon = false,
  icon = null,
  label,
  description,
  autoComplete,
  inputMode,
  maxLength,
  allowClear = false,
  showCounter = false,
  disabled,
  kind,
  matchToValue,
  matchToLabel = 'Password',
  showPasswordStrength = false,
  showPasswordVisiblilityToggle = false,
  sectioned = true,
  counterRenderer,
}: InputProps<T>) {
  const isPasswordKind = (kind ?? type) === 'password'
  const isEmailKind = (kind ?? type) === 'email'
  const [showPw, setShowPw] = useState(false)
  const [capsOn, setCapsOn] = useState(false)

  return (
    <div className={cn(sectioned && 'border-secondary-light border-b border-dashed dark:border-neutral-800 pb-5')}>
      <Controller
        name={name as FieldPath<T>}
        control={control}
        render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
          const valueStr = (value ?? '') as string
          const pwScore = useMemo(() => scorePassword(isPasswordKind ? valueStr : ''), [isPasswordKind, valueStr])
          const showMatch = isPasswordKind && typeof matchToValue === 'string' && valueStr.length > 0
          const matched = showMatch ? valueStr === matchToValue : undefined

          const counterNode =
            counterRenderer?.(valueStr.length, maxLength) ??
            (showCounter && typeof maxLength === 'number' ? (
              <span className="text-xs tabular-nums text-gray-500">{valueStr.length}/{maxLength}</span>
            ) : null)

          return (
            <>
              {/* Top row: label + counter (right) */}
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

              {/* Field container: rounded, white bg, thin border; turns rose on error */}
              <div
                className={cn(
                  'relative rounded-md border bg-white',
                  error && 'border-rose-300',
                  disabled && 'opacity-60 pointer-events-none',
                  'dark:border-neutral-800'
                )}
              >
                {/* Optional left icon */}
                {withIcon && icon && (
                  <label
                    htmlFor={name}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {icon}
                  </label>
                )}

                <FormInput
                  ref={ref}
                  id={name}
                  name={name}
                  type={isPasswordKind ? (showPw ? 'text' : 'password') : type}
                  value={valueStr}
                  onChange={(e) => {
                    if (maxLength && e.target.value.length > maxLength) return;
                    onChange(e);
                  }}
                  onBlur={onBlur}
                  onKeyUp={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  inputMode={inputMode}
                  aria-invalid={!!error}
                  className={cn(
                    // base
                    'w-full rounded-md border-0 bg-transparent p-3.5 text-sm focus:outline-none',
                    'text-gray-800 placeholder:text-gray-400 caret-slate-900 selection:bg-slate-200/70',
                    // dark mode
                    'dark:text-white dark:placeholder:text-white/50 dark:caret-white dark:selection:bg-white/20 dark:bg-neutral-950 ',
                    // platform hints (prevents odd autofill colors)
                    'autofill:bg-transparent [color-scheme:light] dark:[color-scheme:dark]',
                    // states
                    'disabled:opacity-50 read-only:opacity-60',
                    // icon padding
                    withIcon && icon ? 'pl-10' : ''
                  )}
                />


                {/* Right-side adornments (password toggle / clear) */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                  {allowClear && !isPasswordKind && valueStr && (
                    <button
                      type="button"
                      aria-label="Clear"
                      onClick={() => onChange('')}
                      className="pointer-events-auto rounded px-1 text-gray-400 hover:text-gray-700"
                    >
                      ×
                    </button>
                  )}
                  {isPasswordKind && showPasswordVisiblilityToggle && (
                    <button
                      type="button"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPw((s) => !s)}
                      className="pointer-events-auto grid h-6 w-6 place-items-center text-gray-400 hover:text-gray-700"
                    >
                      {showPw ? <TbEye /> : <TbEyeOff />}
                    </button>
                  )}
                </div>
              </div>

              {/* Helper / error line (kept minimal like your sample) */}
              <div className="mt-1 flex items-start justify-between text-[11px] leading-4">
                <div className="text-neutral-500">
                  {error?.message ? (
                    <span className="text-red-600">{error.message}</span>
                  ) : description ? (
                    <span>{description}</span>
                  ) : isEmailKind ? (
                    <span>We’ll never share your email.</span>
                  ) : null}
                </div>
              </div>

              {/* Password helpers: caps lock + strength bar + match state (fits under your section) */}
              {isPasswordKind && showPasswordStrength && (
                <div className="mt-2 space-y-1">
                  {capsOn && (
                    <p className="text-[11px] text-amber-600">Caps Lock is on</p>
                  )}

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className={cn(
                        'h-full transition-all duration-300',
                        pwScore.score === 0 && 'w-1/12 bg-red-500',
                        pwScore.score === 1 && 'w-1/4 bg-orange-500',
                        pwScore.score === 2 && 'w-1/2 bg-yellow-500',
                        pwScore.score === 3 && 'w-3/4 bg-lime-500',
                        pwScore.score === 4 && 'w-full bg-green-600'
                      )}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-600">
                    <span>
                      Strength: <span className="font-medium">{pwScore.label}</span>
                      {valueStr.length < 12 && <> · Use 12+ chars for better security</>}
                    </span>

                    {showMatch && (
                      <span className={matched ? 'text-green-600' : 'text-red-600'}>
                        {matched ? (
                          <span className="inline-flex items-center gap-1"><TbCheck /> Matches</span>
                        ) : (
                          <span className="inline-flex items-center gap-1"><TbAlertCircle /> Invalid match</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )
        }}
      />
    </div>
  )
}
