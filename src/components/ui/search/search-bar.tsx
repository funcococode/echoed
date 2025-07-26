'use client'
import { TbSearch } from "react-icons/tb";
import Input from "../../form/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getSearchResults } from "@/actions/search";
import SearchResults from "./search-results";

export interface SearchDataResponse {
    id: string;
    name: string;
    desc?: string;
    username?: string;
}

export default function SearchBar() {
    const [data, setData] = useState<SearchDataResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const { control, watch } = useForm({
        defaultValues: {
            search: ''
        }
    });

    const input = watch('search');

    const fetchData = async (query: string) => {
        if (query) {
            const payload = {
                query,
            }
            const response = await getSearchResults(payload);
            if (response.success && response.data) {
                setData(response?.data);
            }
        } else {
            setData([])
        }
    }

    useEffect(() => {
        fetchData(input).catch(err => console.log(err)).finally(() => setLoading(false))
    }, [input])

    return (
        <>
            <Input withIcon icon={<TbSearch />} control={control} name="search" showLabel={false} placeholder="Search for topics" />
            {data.length > 0 && <SearchResults data={data} setData={setData} />}
        </>
    )
}
