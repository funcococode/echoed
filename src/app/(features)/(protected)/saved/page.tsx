
'use client'
import { type EchoesByType_TypeDef, getEchoesByType } from "@/actions/post";
import PageHeading from "@/components/ui/page-heading";
import useNavigationStore from "@/stores/navigation-store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SmallPostCard from "../_components/post-card-small";
import { TbBookmark } from "react-icons/tb";


export default function SavedEchoes() {
  const session = useSession();
  const { currentPath } = useNavigationStore()
  const [data, setData] = useState<EchoesByType_TypeDef>([]);

  const fetchData = async () => {
    const response = await getEchoesByType('saved');
    setData(response)
  }

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchData().catch(err => console.log(err));
    }
  }, [])

  return (
    <div className="space-y-4">
      <PageHeading>
        <section className='h-32 flex items-center justify-between px-4 gap-1 '>
          <div className='w-1/4 text-5xl flex justify-start gap-4 items-center text-secondary'>
            {currentPath.icon}
            <span className="font-extralight">{data.length || ''}</span>
          </div>
        </section>
      </PageHeading>
      <div className="grid md:grid-cols-2 gap-4">
        {data?.map(item => <SmallPostCard key={item.id} item={item} />)}
        {!data?.length && <div className="text-center text-gray-500 py-20 text-sm flex items-center gap-2 justify-center flex-col col-span-2">
          <TbBookmark className="text-5xl" />
          <p>Saved echoes will appear here.</p>
        </div>}
      </div>
    </div>
  )

}
