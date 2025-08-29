
'use client'
import { SelectInput } from "@/components/form/select-input";
import useLayoutStore from "@/stores/layout-store";
import { TbGridDots, TbLayoutList } from "react-icons/tb";

export default function SelectEchoesContainerLayout() {
    const { layout, setLayout } = useLayoutStore();
    return (
        <SelectInput
            options={[
                { label: 'Rows', value: 'rows', icon: <TbLayoutList />, selected: layout === 'rows' },
                { label: 'Grid', value: 'grid', icon: <TbGridDots />, selected: layout === 'grid' },
            ]}
            onChange={setLayout}
            placeholder="Layout"
            label='Echoes Layout'
        />
    )
}
