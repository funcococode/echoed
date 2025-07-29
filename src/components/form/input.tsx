'use client'
import { type ReactElement } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

export interface InputProps<T extends FieldValues> {
  type?: string;
  name: string;
  control: Control<T>
  placeholder?: string;
  showLabel?: boolean
  withIcon?: boolean
  icon?: ReactElement | null
}

export default function Input<T extends FieldValues>({ type = 'text', control, name, placeholder, showLabel = true, withIcon = false, icon = null }: InputProps<T>) {
  return (
    <div className="space-y-1 ">
      {showLabel && <label className="text-sm font-medium block text-gray-800 capitalize" htmlFor={name}>{name}</label>}
      <div className="flex items-stretch rounded border border-secondary divide-secondary bg-gray-100 divide-x group">
        {withIcon && icon && <label htmlFor={name} className="flex items-center px-2 text-gray-400 group-focus-within:text-black">{icon}</label>}
        <Controller
          name={name as FieldPath<T>}
          control={control}
          render={({ field: { onChange, value } }) => <input
            type={type}
            onChange={onChange}
            name={name}
            id={name}
            value={value}
            className="w-full p-2 text-sm outline-none bg-gray-100"
            placeholder={placeholder}
          />}
        />
      </div>
    </div>
  )
}
