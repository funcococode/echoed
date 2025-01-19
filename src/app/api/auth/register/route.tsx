import type { RegisterFields } from "@/app/(features)/(public)/auth/register/page";
import { db } from "@/server/db";
import { saltAndHashPassword } from "@/utils/password";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json() as RegisterFields;
    const pwHash = saltAndHashPassword(data.password);
    try{
        if(pwHash){
            const response = await db.user.create({
                data: {
                    ...data,
                    password: pwHash
                }, 
                select: {
                    id: true
                }
            })
            if(response?.id){
                return NextResponse.json({message: 'Your account has been created successfully', success: true, data: {id: response.id}})
            }
        }
    } catch (e : unknown) {
        if(e instanceof PrismaClientKnownRequestError){
            const code = e.code;
            if(code === 'P2002'){
                return NextResponse.json({message: "Unable to create account, username already exists.", success: false, data: null})
            }
        }
    }

    return NextResponse.json({message: 'Error creating account at the moment, please try again later.', success: false, data: null})

}