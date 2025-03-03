import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {
          label: "nom d'utilisateur",
          type: 'text',
          placeholder: 'example@gmail.com'
        },
        password: {
          label: 'Mot de passe',
          type: 'password'
        },
        rememberMe: { label: 'Mémoriser mes informations', type: 'boolean' }
      },
      async authorize(credentials: any, req: any): Promise<any | null> {
        if (!credentials.username || !credentials.password) throw new Error('Tous les champs sont obligatoires.')

        const { username, password, rememberMe } = credentials

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => null)
            const errorMessage = errorData?.message || 'Échec de la connexion. Vérifiez vos identifiants.'
            throw new Error(errorMessage)
          }

          // todo : implment remember functionality
          const maxAge = rememberMe === 'true' ? 30 * 24 * 60 * 60 : 24 * 60 * 60

          const data = await response.json()
          const token = data.accessToken

          delete data.accessToken
          delete data.expiresIn

          return {
            user: data.user,
            expires: data.expires,
            maxAge,
            tokens: {
              token
            }
          }
        } catch (error: any) {
          throw new Error(error.message || 'Service indisponible. Veuillez réessayer plus tard.')
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<any | null> {
      if (user) return { ...token, ...user }
      return token
    },
    session({ token, session }) {
      session.user = token.user
      session.tokens = token.tokens
      session.expires = token.expires
      return Promise.resolve(session)
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  events: {
    async signOut() {
      // nextCookies().delete('token')
    }
  },
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET || 'something'
}
