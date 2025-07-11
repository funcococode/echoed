import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary'
}

const VARIANTS = {
  'primary': 'border rounded w-fit px-4 py-2 text-xs font-medium text-white bg-indigo-600',
  'secondary': 'border rounded w-fit px-4 py-2 text-xs font-medium text-black bg-gray-100',
  'outline-primary': 'rounded w-fit px-4 py-1 text-sm font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white',
  'outline-secondary': 'rounded w-fit px-4 py-1 text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-200 hover:text-black',
}

export default function Button({ text, type = 'button', onClick, variant = 'primary', ...rest }: ButtonProps) {
  return (
    <button onClick={onClick} type={type} className={VARIANTS[variant]} {...rest}>{text}</button>
  )
}
