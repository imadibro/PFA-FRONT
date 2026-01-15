import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        accessToken: { type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) return null

        return {
          id: 'credentials-user', // required by NextAuth
          accessToken: credentials.accessToken
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken
      }
      return token
    },

    session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    }
  },

  pages: {
    signIn: '/login'
  },

  secret: process.env.NEXT_PUBLIC_AUTH_SECRET
}
