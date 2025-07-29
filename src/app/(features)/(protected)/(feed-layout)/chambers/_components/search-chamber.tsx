import { type ChamberType, listChambers } from "@/actions/chambers";
import { Modal } from "@/components/ui/modal";
import Link from "next/link";
import { useState } from "react";

interface Props {
    onSelect: (option: string) => void;
    onClose: () => void;
}

export default function SearchChamber({ onSelect, onClose }: Props) {
    const [data, setData] = useState<ChamberType>([])

    const search = async (query: string) => {
        if (query.length) {
            const response = await listChambers(query);
            setData(response);
        } else {
            setData([])
        }
    }

    return (
        <Modal open title="Search for a chamber" onClose={onClose}>
            <div className="w-96 space-y-5">
                <div className="border-b pb-5 border-dashed border-secondary">
                    <input className="w-full outline-none border rounded border-gray-200 p-4 text-sm bg-gray-100" type="text" name="Chamber Name" onChange={(e) => search(e.target.value)} placeholder="Search Chambers" />
                </div>
                <div className="space-y-5 rounded mt-2 text-xs min-h-44">
                    <h1 className="font-semibold text-xs text-primary">Results</h1>
                    <div className="grid grid-cols-2 gap-4">
                        {data?.map(item => <Link href={`/chambers/${item.id}`} key={item.id} className="flex flex-col gap-2 border p-4 rounded">
                            <span className="font-semibold">{item.name}</span>
                            <span className="line-clamp-3">{item.description}</span>
                        </Link>)}
                        {/* {!data.length && 'No Results Found'} */}
                    </div>
                </div>
            </div>
        </Modal>
    )
}
