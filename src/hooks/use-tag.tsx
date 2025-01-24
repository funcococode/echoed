'use client'

import { getPostTags, type TagType } from "@/actions/tag";
import { useCallback, useEffect, useState } from "react";

export default function useTags({ postId }: { postId?: string }) {
    const [data, setData] = useState<TagType[] | undefined>([])
    const [isLoading, setIsLoading] = useState(true);
    const [refetchData, setRefetchData] = useState(false);

    const fetchData = useCallback(async () => {
        if (postId) {
            const payload = {
                postId
            }
            const response = await getPostTags(payload);
            setData(response)
        }
    }, [postId])

    const refetch = useCallback(() => {
        setRefetchData(prev => !prev)
    }, [])

    useEffect(() => {
        fetchData().catch(err => console.log(err)).finally(() => setIsLoading(false));
    }, [fetchData, refetchData])

    return { data, isLoading, refetch }
}
