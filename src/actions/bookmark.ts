'use server'

import { auth } from "@/auth"
import { db } from "@/server/db";

export async function addBookmark(postId: string){
    const session = await auth();

    if(postId && session?.user?.id) {
        const found = await db.savedPost.findFirst({
            where: {
                postId,
                userId: session.user.id
            },
            select: {
                id: true
            }
        });
        if(!found?.id){
            const response = await db.savedPost.create({
                data: {
                    postId,
                    userId: session?.user?.id
                }
            });
            return response.id;
        }else{
            await db.savedPost.delete({
                where: {
                    id: found.id                    
                }
            })

            return null;
        }
    }
}

export async function getIsBookmarked(postId: string){
    const session = await auth();

    if(postId && session?.user?.id){
        const response = await db.savedPost.findFirst({
            where: {
                postId,
                userId: session.user?.id
            },
            select: {
                id: true
            }
        });

        if(response?.id){
            return true
        }
    }

    return false
}