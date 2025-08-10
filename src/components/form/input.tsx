'use client'

import { cn } from '@/lib/utils'
import { type ReactElement, useMemo, useState } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { TbAlertCircle, TbCheck, TbEye, TbEyeOff } from 'react-icons/tb'

// Minimal inline icons to avoid extra deps

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
  /** When set, enables password-specific UI regardless of `type` */
  kind?: 'text' | 'email' | 'password'
  /** For confirm password, pass the value to compare with */
  matchToValue?: string
  matchToLabel?: string
  showPasswordStrength?: boolean;
  showPasswordVisiblilityToggle?: boolean;
}

// Password strength scoring
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
  showPasswordVisiblilityToggle = false
}: InputProps<T>) {
  const isPasswordKind = (kind ?? type) === 'password'
  const isEmailKind = (kind ?? type) === 'email'

  const [showPw, setShowPw] = useState(false)
  const [capsOn, setCapsOn] = useState(false)

  return (
    <div className="space-y-1">
      {showLabel && (
        <label className="text-sm font-medium block text-gray-800 capitalize" htmlFor={name}>
          {label ?? name}
        </label>
      )}

      <Controller
        name={name as FieldPath<T>}
        control={control}
        render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => {
          const valueStr = (value ?? '') as string
          const pwScore = useMemo(() => scorePassword(isPasswordKind ? valueStr : ''), [isPasswordKind, valueStr])
          const showMatch = isPasswordKind && typeof matchToValue === 'string' && valueStr.length > 0
          const matched = showMatch ? valueStr === matchToValue : undefined

          return (
            <>
              <div
                className={`flex items-stretch rounded border bg-gray-100 group ${error ? 'border-red-500 divide-red-200' : 'border-secondary divide-secondary'
                  } ${disabled ? 'opacity-60 pointer-events-none' : ''}`}
              >
                {withIcon && icon && (
                  <label htmlFor={name} className="flex items-center px-2 text-gray-400 group-focus-within:text-black">
                    {icon}
                  </label>
                )}

                <input
                  ref={ref}
                  id={name}
                  name={name}
                  type={isPasswordKind ? (showPw ? 'text' : 'password') : type}
                  value={valueStr}
                  onChange={(e) => {
                    if (maxLength && e.target.value.length > maxLength) return
                    onChange(e)
                  }}
                  onBlur={onBlur}
                  onKeyUp={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  inputMode={inputMode}
                  aria-invalid={!!error}
                  className={cn("w-full p-2 text-sm outline-none bg-gray-100", isPasswordKind && 'border-r pr-2')}
                />


                {/* Right side adornments */}
                <div className="flex items-center gap-1 px-2 text-gray-500">
                  {/* Clear button */}
                  {allowClear && !isPasswordKind && valueStr && (
                    <button type="button" aria-label="Clear" onClick={() => onChange('')} className="hover:text-gray-800">×</button>
                  )}

                  {/* Password show/hide toggle */}
                  {isPasswordKind && showPasswordVisiblilityToggle && (
                    <button
                      type="button"
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPw((s) => !s)}
                      className="grid place-items-center w-6 h-6 hover:text-gray-800"
                    >
                      {showPw ? <TbEye /> : <TbEyeOff />}
                    </button>
                  )}

                </div>
              </div>

              {/* Subtext row: error / helper / counters */}
              <div className="flex items-start justify-between text-[11px] leading-4 mt-1">
                <div className="text-neutral-500">
                  {error?.message ? (
                    <span className="text-red-600">{error.message}</span>
                  ) : description ? (
                    <span>{description}</span>
                  ) : isEmailKind ? (
                    <span>We’ll never share your email.</span>
                  ) : null}
                </div>
                {showCounter && typeof maxLength === 'number' && (
                  <div className={`tabular-nums ${valueStr.length > maxLength * 0.9 ? 'text-gray-700' : 'text-neutral-400'}`}>
                    {valueStr.length}/{maxLength}
                  </div>
                )}
              </div>

              {/* Password helpers: caps lock + strength + match */}
              {isPasswordKind && showPasswordStrength && (
                <div className="space-y-1 mt-1">
                  {capsOn && (
                    <p className="text-[11px] text-amber-600">Caps Lock is on</p>
                  )}

                  {/* Strength meter */}
                  <div className="h-1.5 w-full rounded-full bg-neutral-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${pwScore.score === 0
                        ? 'w-1/12 bg-red-500'
                        : pwScore.score === 1
                          ? 'w-1/4 bg-orange-500'
                          : pwScore.score === 2
                            ? 'w-1/2 bg-yellow-500'
                            : pwScore.score === 3
                              ? 'w-3/4 bg-lime-500'
                              : 'w-full bg-green-600'
                        }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>
                      Strength: <span className="font-medium">{pwScore.label}</span>
                      {valueStr.length < 12 && <> · Use 12+ chars for better security</>}
                    </span>
                    {showMatch && (
                      <span className={matched ? 'text-green-600' : 'text-red-600'}>
                        {matched ? <p className='flex items-center gap-1'><TbCheck /> Matches </p> : <p className='flex items-center gap-1 '><TbAlertCircle /> Invalid match </p>}`
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
