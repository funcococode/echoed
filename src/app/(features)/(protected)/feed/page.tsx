'use client'

import { useCallback, useEffect, useState } from "react";
import PostCard from "@/components/ui/post/post-card";
import { getAllPosts, type PostType } from "@/actions/post";
import Pagination from "@/components/ui/pagination";

export default function Feed() {
  const [data, setData] = useState<PostType[]>([]);
  const [pageInfo, setPageInfo] = useState<{
    total_count: number;
    total_pages: number;
    page: number;
    limit: number
  }>();
  const [refetch, setRefetch] = useState(false);
  const [currentPage, setCurrentPage] = useState(0)
  const [limit, setLimit] = useState(5)

  const fetchData = useCallback(async () => {
    const payload = {
      page: currentPage,
      limit
    }

    const response = await getAllPosts(payload)

    setData(response.data)
    setPageInfo(response.pageInfo)
  }, [currentPage, limit])

  useEffect(() => {
    fetchData().catch(err => console.log(err));
  }, [refetch, currentPage, limit, fetchData])

  return (
    <div className="space-y-10 md:space-y-4">
      <div className="flex items-center justify-between">
        <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} totalRecords={(pageInfo?.total_count ?? 0)} totalPages={pageInfo?.total_pages ?? 0} />
      </div>
      {data?.map((item) => <PostCard post={item} key={item.id} />)}
    </div>
  )
}
