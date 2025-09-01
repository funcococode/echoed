
'use client'
import { SelectInput } from "@/components/form/select-input";
import useLayoutStore from "@/stores/layout-store";
import { TbGridDots, TbLayoutList } from "react-icons/tb";

export default function SelectEchoesContainerLayout() {
    const { layout, setLayout } = useLayoutStore();

    return (
        <SelectInput
            options={[
                { label: 'Rows', value: 'ROWS', icon: <TbLayoutList />, selected: layout === 'ROWS' },
                { label: 'Grid', value: 'GRID', icon: <TbGridDots />, selected: layout === 'GRID' },
            ]}
            onChange={setLayout}
            placeholder="Layout"
            label='Echoes Layout'
        />
    )
}
