import { type ChamberType, listChambers } from '@/actions/chambers'
import { Modal } from '@/components/ui/modal'
import { useState } from 'react'

interface Props {
	onSelect: (option: string) => void
	onClose: () => void
}

export default function SearchChamber({ onSelect, onClose }: Props) {
	const [data, setData] = useState<ChamberType>([])

	const search = async (query: string) => {
		if (query.length) {
			const response = await listChambers(query)
			setData(response)
		} else {
			setData([])
		}
	}

	const handleAddChamber = async (id: string) => {
		onSelect?.(id)
	}

	return (
		<Modal open title="Search for a chamber" onClose={onClose}>
			<div className="w-96 space-y-5">
				<div className="border-secondary border-b border-dashed pb-5">
					<input
						className="w-full rounded border border-gray-200 bg-gray-100 p-4 text-sm outline-none"
						type="text"
						name="Chamber Name"
						onChange={e => search(e.target.value)}
						placeholder="Search Chambers"
					/>
				</div>
				<div className="mt-2 min-h-44 space-y-5 rounded text-xs">
					<h1 className="text-primary text-xs font-semibold">Results</h1>
					<div className="grid grid-cols-2 gap-4">
						{data?.map(item => (
							<button
								onClick={() => handleAddChamber(item.id)}
								key={item.id}
								className="flex flex-col items-start gap-2 rounded border p-4">
								<span className="font-semibold">{item.name}</span>
								<span className="line-clamp-3">{item.description}</span>
							</button>
						))}
						{/* {!data.length && 'No Results Found'} */}
					</div>
				</div>
			</div>
		</Modal>
	)
}
