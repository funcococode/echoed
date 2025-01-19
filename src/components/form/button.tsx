import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    text: string;
    onClick?: () => void;
}

export default function Button({text, type = 'button', onClick, ...rest}: ButtonProps) {
  return (
    <button onClick={onClick} type={type} className="rounded w-fit px-4 py-1 text-sm font-medium text-white bg-indigo-600" {...rest}>{text}</button>
  )
}
