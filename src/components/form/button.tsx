import { cn } from "@/utils/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary' | 'ghost'
  icon?: ReactNode
  classNames?: string
}

const VARIANTS = {
  'primary': 'border rounded w-fit px-4 py-2 text-xs font-medium text-white bg-primary',
  'secondary': 'border rounded w-fit px-4 py-2 text-xs font-medium text-black bg-gray-100',
  'outline-primary': 'rounded w-fit px-4 py-2 text-xs font-medium text-primary border border-primary hover:bg-primary hover:text-white',
  'outline-secondary': 'rounded w-fit px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-black',
  'ghost': 'rounded w-full px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-200 hover:text-black border border-transparent text-left'
}

export default function Button({ classNames, text, type = 'button', onClick, variant = 'primary', icon, ...rest }: ButtonProps) {
  return (
    <button onClick={onClick} type={type} className={cn(VARIANTS[variant], 'cursor-pointer flex items-center gap-2', classNames)} {...rest}>
      {icon && <p className="text-base">
        {icon}
      </p>}
      {text}
    </button>
  )
}
