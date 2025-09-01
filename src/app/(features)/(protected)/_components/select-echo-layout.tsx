'use client'
import { SelectInput } from "@/components/form/select-input";
import useLayoutStore from "@/stores/layout-store";
import { TbLayout, TbLayoutBoardSplit, TbLayoutGridAdd, TbTextCaption } from "react-icons/tb";

export default function SelectEchoLayout() {
    const { echoLayout, setEchoLayout } = useLayoutStore();
    return (
        <SelectInput
            options={[
                { label: 'Full Size', value: 'FULL', icon: <TbLayoutBoardSplit />, selected: echoLayout === 'FULL' },
                { label: 'Compact', value: 'COMPACT', icon: <TbLayout />, selected: echoLayout === 'COMPACT' },
                { label: 'Slim', value: 'SLIM', icon: <TbLayoutGridAdd />, selected: echoLayout === 'SLIM' },
                { label: 'Minimal', value: 'MINIMAL', icon: <TbTextCaption />, selected: echoLayout === 'MINIMAL' },
            ]}
            onChange={setEchoLayout}
            placeholder="Layout"
            label='Echo Layout'
        />
    )
}
