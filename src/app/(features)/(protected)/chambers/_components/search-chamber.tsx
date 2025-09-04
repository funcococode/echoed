import { type ChamberType, listChambers } from '@/actions/chambers'
import { Modal } from '@/components/ui/modal'
import { useRef, useState } from 'react'

interface Props {
	onSelect: (option: string) => void
	onClose: () => void
}

export default function SearchChamber({ onSelect, onClose }: Props) {
	const [data, setData] = useState<ChamberType>([])
	const inputRef = useRef<HTMLInputElement>(null);

	const search = async (query: string) => {
		if (query.length) {
			const response = await listChambers({
				query
			})
			setData(response)
		} else {
			setData([])
		}
	}

	const handleAddChamber = async (id: string) => {
		onSelect?.(id)
		if (inputRef.current) {
			inputRef.current.value = ''
			setData([])
		}
	}

	return (
		<Modal open title="Search for a chamber" onClose={onClose}>
			<div className="min-w-96 space-y-5 transition-all">
				<div className="border-secondary border-b border-dashed pb-5">
					<input
						ref={inputRef}
						className="w-full rounded border border-gray-200 bg-gray-100 p-4 text-sm outline-none"
						type="text"
						name="Chamber Name"
						onChange={e => search(e.target.value)}
						placeholder="Search Chambers"
					/>
				</div>
				<div className="mt-2 min-h-44 space-y-5 rounded text-xs">
					<h1 className="text-primary  font-semibold">Results</h1>
					<div className="grid grid-cols-2 gap-4 max-h-64 overflow-y-scroll scrollbar-hide">
						{data?.map(item => (
							<button
								onClick={() => handleAddChamber(item.id)}
								key={item.id}
								className="flex flex-col  gap-2 rounded border border-secondary p-4 w-52 cursor-pointer hover:border-black">
								<span className="font-bold text-left">{item.name}</span>
								<span className="line-clamp-3 text-left font-light">{item.description}</span>
							</button>
						))}
						{/* {!data.length && 'No Results Found'} */}
					</div>
				</div>
			</div>
		</Modal>
	)
}
