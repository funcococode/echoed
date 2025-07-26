import { CredentialsSignin, type NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { comparePassword } from './utils/password'
import { db } from './server/db'

export default {
	providers: [
		Credentials({
			credentials: {
				username: {},
				password: {},
			},
			authorize: async credentials => {
				let user = null
				user = await db.user.findFirst({
					where: {
						username: credentials.username as string,
					},
				})

				if (!user) {
					throw new CredentialsSignin()
				}

				const passwordMatch = comparePassword(credentials.password as string, user?.password)

				if (passwordMatch) {
					return user
				} else {
					throw new CredentialsSignin()
				}
			},
		}),
	],
	callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.uid = user
			}

			return token
		},
		session: async ({ session, token }) => {
			if (token.uid) {
				session.user = token.uid
			}
			return session
		},
	},
} satisfies NextAuthConfig
