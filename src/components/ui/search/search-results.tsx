import { useRouter } from 'next/navigation';
import { type Dispatch } from 'react'
import type { SearchDataResponse } from './search-bar';


interface Props {
    data: SearchDataResponse[]
    setData?: Dispatch<React.SetStateAction<SearchDataResponse[] | []>>
}

export default function SearchResults({ data, setData }: Props) {
    const navigate = useRouter();

    const handleClick = (id: string) => {
        navigate.push(`/post/${id}`);
        setData?.([]);
    }

    return <div className='absolute top-full left-0 w-full z-50'>
        {!!data.length && <div className='border border-gray-100 p-4 rounded bg-white shadow-xl  space-y-4'>
            <h1 className='font-bold text-sm '>Results</h1>
            <div className='space-y-2'>
                <h1 className='text-xs font-semibold w-fit px-4 py-1 border-l-4 border-primary text-primary'>Echoes</h1>
                <div>

                    {data.map(item => <button
                        key={item.id}
                        onClick={() => handleClick(item.id)}
                        className='text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100  w-full text-left hover:px-4 py-4 rounded transition-all flex items-center justify-center'
                    >
                        <div className='flex-1 space-y-1'>
                            <h2>

                                {item.name}
                            </h2>
                            <p className='text-xs text-gray-500 font-light'>
                                {item.desc ? `${item.desc}` : ''}
                            </p>
                        </div>
                        <p className='flex-1 text-xs text-gray-500 font-light text-right'>
                            By {item.username ? `@${item.username}` : ''}
                        </p>
                    </button>)}
                </div>
            </div>
        </div>}
    </div>

}
