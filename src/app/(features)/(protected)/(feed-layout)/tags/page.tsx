import PageHeading from "@/components/ui/page-heading";
import { db } from "@/server/db"
import { TbTag } from "react-icons/tb";

export default async function Tags() {
  const fetchData = async () => {
    const response = await db.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    })
    return response;
  }

  const data = await fetchData();
  console.log(data)

  return (
    <div>
      <div className="space-y-4">
        <PageHeading text='Tags' count={data?.length} icon={<TbTag />} />
        <div className="flex flex-wrap gap-2">
          {data?.map(item => <li key={item.id} className="list-none border text-xs py-1 px-2 rounded-md">
            <div className="flex items-center justify-between gap-2 divide-x">
              <span className="text-gray-400">{item._count.posts}</span>
              <h1 className="font-semibold pl-2">
                {item.name}
              </h1>
            </div>
            <p>{item.description}</p>
          </li>)}
        </div>
      </div>
    </div>
  )
}
