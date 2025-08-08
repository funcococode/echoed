import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Option {
    label: string;
    value: string;
    icon?: React.ReactElement
    selected?: boolean;
}

interface SelectInputProps {
    placeholder?: string;
    options?: Option[]
    onChange: (value: string) => void
    label?: string
}

export function SelectInput({ placeholder, options, onChange, label }: SelectInputProps) {
    return (
        <Select onValueChange={onChange} defaultValue={options?.find(item => item.selected)?.value} >
            <SelectTrigger className="text-xs font-semibold bg-gray-50 rounded-md">
                <SelectValue placeholder={placeholder || 'Select Value'} />
            </SelectTrigger>
            <SelectContent className="" position="popper" align="end">
                <SelectGroup>
                    {label && <SelectLabel className="text-xs">{label}</SelectLabel>}
                    {options?.map(item =>
                        <SelectItem key={item.value} value={item.value} className="text-sm font-semibold text-gray-500">
                            {!!item.icon && <span className="text-lg inline-block border-r pr-2">{item.icon}</span>}
                            <span>{item.label}</span>
                        </SelectItem>
                    )}
                </SelectGroup>
                {!options?.length && <SelectItem value="null" disabled>No Options</SelectItem>}
            </SelectContent>
        </Select>
    )
}
