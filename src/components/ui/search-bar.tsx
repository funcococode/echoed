import { TbSearch } from "react-icons/tb";
import Input from "../form/input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export default function SearchBar() {
    const [data, setData] = useState([]);

    const { control, watch } = useForm({
        defaultValues: {
            search: ''
        }
    });

    const input = watch('search');

    useEffect(() => {
        console.log(input)
    }, [input])

    return (
        <Input withIcon icon={<TbSearch />} control={control} name="search" showLabel={false} placeholder="Search for topics" />
    )
}
