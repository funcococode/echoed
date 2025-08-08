import { SelectInput } from "@/components/form/select-input";
import useLayoutStore from "@/stores/layout-store";
import { TbLayout, TbLayoutBoardSplit, TbLayoutGridAdd, TbTextCaption } from "react-icons/tb";

export default function SelectEchoLayout() {
    const { echoLayout, setEchoLayout } = useLayoutStore();
    return (
        <SelectInput
            options={[
                { label: 'Full Size', value: 'full', icon: <TbLayoutBoardSplit />, selected: echoLayout === 'full' },
                { label: 'Compact', value: 'compact', icon: <TbLayout />, selected: echoLayout === 'compact' },
                { label: 'Slim', value: 'slim', icon: <TbLayoutGridAdd />, selected: echoLayout === 'slim' },
                { label: 'Minimal', value: 'minimal', icon: <TbTextCaption />, selected: echoLayout === 'minimal' },
            ]}
            onChange={setEchoLayout}
            placeholder="Layout"
            label='Echo Layout'
        />
    )
}
