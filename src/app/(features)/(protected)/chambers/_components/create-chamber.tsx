'use client'

import { createChamber } from "@/actions/chambers";
import { Modal } from "@/components/ui/modal"
import { useState } from "react"
import { TbPlus } from "react-icons/tb";
import { toast } from "sonner";

export default function CreateChamberModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateChamber = async () => {
        if (!name || !description) {
            toast.error('Please provide a name and a description for the Chamber you are trying to create', {
                richColors: true
            })
            return;
        }

        const response = await createChamber(name, description);
        if (response?.id) {
            toast.success(`${response.name} created successfully!`, {
                richColors: true
            })
            setDescription('');
            setName('');
            onClose?.()
        }
    }

    return (<Modal open={true} title="Create new Chamber" onClose={onClose}>
        <div className="space-y-5 min-w-96">
            <div className="flex flex-col gap-1 ">
                <label htmlFor="Name" className="text-xs font-medium text-gray-500">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} type="text" name="Name" placeholder="e.g. Consciousness, Tech Ethics, Urban Myths" className="border p-4 text-sm rounded border-gray-200" />
            </div>
            <div className="flex flex-col gap-1 ">
                <label htmlFor="Description" className="text-xs font-medium text-gray-500">Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} name="Description" placeholder="e.g. A space to explore the nature of mind and self-awareness." className="border p-4 text-sm rounded border-gray-200 min-h-44" ></textarea>
            </div>
            <button onClick={handleCreateChamber} className="flex items-center gap-2 bg-primary text-white p-4 rounded w-full justify-center font-medium"><TbPlus className="text-lg" /> Create</button>
        </div>
    </Modal>
    )
}
