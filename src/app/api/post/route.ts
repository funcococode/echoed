
import { auth } from "@/auth";
import { db } from "@/server/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {type  NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const session = await auth();
    const data = await request.json() as {title: string, description: string};
    try{
        const response = await db.post.create({
            data: {
                ...data,
                userId: session?.user?.id ?? '',
            }, 
            select: {
                id: true
            }
        })
        if(response?.id){
            return NextResponse.json({message: 'Post created successfully', success: true, data: {id: response.id}})
        }
    } catch (e : unknown) {
        if(e instanceof PrismaClientKnownRequestError){
            return NextResponse.json({message: "Something went wrong", success: false, data: null})
        }
    }

    return NextResponse.json({message: 'Error creating account at the moment, please try again later.', success: false, data: null})
}