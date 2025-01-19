import { auth } from "@/auth";
import { db } from "@/server/db";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json() as {positive: boolean, postId: string}
  const session = await auth();
  let response = null;
  if(session?.user?.id){
    const found = await db.vote.findFirst({
        where: {
            userId: session?.user?.id,
            postId: data?.postId
        }
    })
    if(found?.id && found.positive === data.positive){
        response = await db.vote.delete({
            where: {
                id: found.id
            },
        })
    }else if(found?.id && found.positive !== data.positive){
        response = await db.vote.update({
            where: {
                id: found.id
            },
            data: {
                positive: data.positive
            }
        })
    }else{
        response = await db.vote.create({
            data: {
                positive: data.positive,
                postId: data.postId,
                userId: session?.user?.id
            },
        })
    }

    return NextResponse.json({message: 'success', success: true, status: 200, data: response});

  }
  return NextResponse.json({message: 'Something went wrong', success: false, status: 400, data: null});
}
