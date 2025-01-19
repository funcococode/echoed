'use server'

import { auth } from "@/auth"
import { db } from "@/server/db";

export async function addVote(postId: string, positive: boolean){

    const session = await auth();
    let response = null;
    if(postId && session?.user?.id){
        const found = await db.vote.findFirst({
            where: {
                userId: session?.user?.id,
                postId: postId
            }
        })
        if(found?.id && found.positive === positive){
            response = await db.vote.delete({
                where: {
                    id: found.id
                },
            })
        }else if(found?.id && found.positive !== positive){
            response = await db.vote.update({
                where: {
                    id: found.id
                },
                data: {
                    positive: positive
                },
            })
        }else{
            response = await db.vote.create({
                data: {
                    positive: positive,
                    postId: postId,
                    userId: session?.user?.id
                },
            })
        }

        return response;
    }
}

export async function getIsVoted(postId: string){
    const session = await auth();

    if(postId && session?.user?.id){
        const response = await db.vote.findFirst({
            where: {
                postId,
                userId: session.user?.id
            },
            select: {
                id: true,
                positive: true
            }
        });

        if(response?.id){
            return response
        }
    }

    return null
};