import { db } from "@/server/db"
import { TbTag } from "react-icons/tb";

export default async function MyTopics() {
  const fetchData = async () => {
    const response = await db.tag.findMany({
      include: {
        _count: {
          select: {
            post: true
          } 
        }
      }
    })
    return response;
  }

  const data = await fetchData();

  return (
    <div>
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold h-44 flex items-center justify-between px-4 bg-indigo-400/10 rounded-md text-indigo-300">
          <span className="flex items-center gap-2">
            <TbTag />
            Tags
          </span>
          <span className="">
            {data?.length || ''}
          </span>
        </h1>
        {data?.map(item => <li key={item.id} className="block">
          <div>
            <h1>
              {item.name}
            </h1>
            <span>{item._count.post}</span>
          </div>
          <p>{item.description}</p>
        </li>)}
      </div>
    </div>
  )
}
