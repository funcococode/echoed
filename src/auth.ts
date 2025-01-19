import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./server/db"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter :PrismaAdapter(db),
  session: {strategy: 'jwt'},
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  ...authConfig
})