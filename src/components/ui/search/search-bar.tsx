'use client'

import { useEffect, useState } from "react";
import { getSearchResults } from "@/actions/search";
import { FiSearch } from "react-icons/fi";
import dynamic from "next/dynamic";
import { type GroupedSearchData } from "@/actions/types/search";
import SearchResults from "./results";
import { useSearchStore } from "@/stores/search";
const SearchResultsPortal = dynamic(() => import('./search-result-portal'), {
    ssr: false,
})

export interface SearchDataResponse {
    id: string;
    name: string;
    desc?: string;
    username?: string;
    type?: 'user' | 'tag' | 'echo';
    avatar?: string;
}

export default function SearchBar() {
    const [data, setData] = useState<GroupedSearchData | null>(null);
    const [loading, setLoading] = useState(false);
    // const [searchValue, setSearchValue] = useState('');
    const { query, setQuery } = useSearchStore();


    const fetchData = async (query: string) => {
        setLoading(true);
        if (query.trim()) {
            try {
                const response = await getSearchResults({ query });
                if (response.success && response.data) {
                    setData(response.data);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            setData(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            fetchData(query).catch(err => console.log(err));
        }, 300);
        return () => clearTimeout(delay);
    }, [query]);

    return (
        <div className="relative w-full">
            <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <SearchResultsPortal>
                <SearchResults
                    data={data}
                    setData={setData}
                />
            </SearchResultsPortal>
        </div>
    );
}
