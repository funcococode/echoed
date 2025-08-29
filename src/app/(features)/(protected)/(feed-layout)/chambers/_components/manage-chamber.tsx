import { Dropdown } from "@/components/elements/dropdown";
import Button from "@/components/form/button";
import { TbPencilCog, TbSettings, TbUserCog } from "react-icons/tb";

interface Props {
    chamberId: string
}
export default function ManageChamber({ chamberId }: Props) {
    if (!chamberId) return null

    return (
        <Dropdown
            groups={[
                { label: "Settings", value: 'settings', href: `/chambers/${chamberId}/manage/settings`, icon: <TbSettings className="text-lg" /> },
                { label: "Manage Members", value: 'manage-members', href: `/chambers/${chamberId}/manage/members`, icon: <TbUserCog className='text-lg' /> },
                { label: "Manage Echoes", value: 'manage-echoes', href: `/chambers/${chamberId}/manage/echoes`, icon: <TbPencilCog className='text-lg' /> },
            ]}
            trigger={<Button variant='outline-secondary' classNames='rounded-full' text="Manage" icon={<TbSettings className="text-lg" />} />}
            contentProps={{ align: "end", sideOffset: 8 }}
        />
    )
}
