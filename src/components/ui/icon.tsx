import { type ReactElement } from "react"

interface Props {
    icon: ReactElement
    hoverEffect?: boolean
    size: 'large' | 'medium' | 'normal' | 'small' | 'x-small'
    color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'default' | 'primary-light-bg' | 'secondary-light-bg' | 'danger-light-bg' | 'success-light-bg' | 'warning-light-bg' | 'info-light-bg'
}

const SIZE_CLASS_MAPPING = {
    'large': 'text-2xl p-6',
    'medium': 'text-md p-4',
    'normal': 'p-2',
    'small': 'text-sm p-1.5',
    'x-small': 'text-xs p-1',
}

const COLOR_CLASS_MAPPING = {
    default: 'bg-gray-400/10 text-gray-400',
    'primary': 'bg-primary text-white hover:bg-primary/90',
    'primary-light-bg': 'bg-primary/10 text-primary hover:bg-primary/20',
    'secondary': 'bg-gray-100 text-gray-800 hover:bg-gray-100/90',
    'secondary-light-bg': 'bg-gray-100/10 text-gray-100 hover:bg-gray-100/20',
    'danger': 'bg-red-600 text-white hover:bg-red-600/90',
    'danger-light-bg': 'bg-red-600/10 text-red-600 hover:bg-red-600/20',
    'success': 'bg-teal-600 text-white hover:bg-teal-600/90',
    'success-light-bg': 'bg-teal-600/10 text-teal-600 hover:bg-teal-600/20',
    'warning': 'bg-yellow-500 text-white hover:bg-yellow-500/90',
    'warning-light-bg': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    'info': 'bg-blue-500 text-white hover:bg-blue-500/90',
    'info-light-bg': 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
}

export default function Icon({ icon, hoverEffect = false, size = 'normal', color = 'default' }: Props) {
    if (!icon) return <></>

    return (
        <div
            className={`grid place-content-center ${SIZE_CLASS_MAPPING[size]} rounded-full  border border-gray-100 ${!!hoverEffect && "hover:bg-primary hover:text-white"} ${color && COLOR_CLASS_MAPPING[color]}`}>
            {icon}
        </div>
    )
}
