import { db } from "@/server/db";
import moment from "moment";
import { redirect } from "next/navigation";

export default async function UserProfile({params}: {params: Promise<{id: string}>}) {
    const id = (await params)?.id;
    if(!id) return redirect('/')

    const data = await db.user.findFirst({
      where: {
        id: id
      },
      include: {
        _count: {
          select: {
            Posts: true,
            tag: true
          }
        },
        Posts: true
      }
    })

    return (
      <section className="space-y-5">
        <div className="h-44 rounded shadow-md shadow-gray-500/10 p-5">
          <h1 className="text-2xl font-bold capitalize text-gray-700">{data?.firstname} {data?.lastname}</h1>
          <p>Username: {data?.username}</p>
          <p>Posts: {data?._count?.Posts}</p>
          <p>Joined on: {moment(data?.createdAt).format('MMM DD, YYYY')}</p>
          <p>Tags Followed: {data?._count?.tag}</p>
        </div>

        <h1 className="text-xl font-bold ">Posts</h1> 
        {data?.Posts?.map(item => <div key={item.id} className="rounded shadow-md shadow-gray-500/10 p-5">
          <h1>{item.title}</h1>
        </div>)}

      </section>
    )
}
