'use client'
import {Controller, type Control,type FieldPath, type FieldValues } from "react-hook-form";

export interface InputProps<T extends FieldValues>{
    type?: string;
    name: string;
    control: Control<T> 
    placeholder?: string;
}

export default function Input<T extends FieldValues>({type='text', control, name, placeholder}: InputProps<T>) {
  return (
    <div className="space-y-1 ">
        <label className="text-sm font-medium block text-gray-800 capitalize" htmlFor={name}>{name}</label>
        <Controller
            name={name as FieldPath<T>}
            control={control }
            render={({field: {onChange, value}}) => <input 
                type={type}
                onChange={onChange}
                name={name}
                id={name}
                value={value}
                className="w-full border p-2 rounded text-sm min-w-60"
                placeholder={placeholder}
            />}
        />
    </div>
  )
}
