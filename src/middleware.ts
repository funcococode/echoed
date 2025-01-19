import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { type NextRequest, NextResponse } from "next/server"
 
export const { auth } = NextAuth(authConfig)

const publicRoutes = ['/auth/login', '/auth/register', '/']

export async function middleware(request: NextRequest) {
    const path = request?.nextUrl?.pathname 
    const isProtectedRoute = !publicRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    const session = await auth();
    if(isProtectedRoute && !session?.user){
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if(isPublicRoute && session?.user?.id){
        return NextResponse.redirect(new URL('/feed', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}