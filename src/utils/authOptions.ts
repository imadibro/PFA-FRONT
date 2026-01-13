import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: {
//           label: "nom d'utilisateur",
//           type: 'text',
//           placeholder: 'example@gmail.com'
//         },
//         password: {
//           label: 'Mot de passe',
//           type: 'password'
//         },
//         rememberMe: { label: 'Mémoriser mes informations', type: 'boolean' }
//       },
//       async authorize(credentials: any): Promise<any | null> {
//         if (!credentials.username || !credentials.password) throw new Error('Tous les champs sont obligatoires.')

//         const { username, password, rememberMe } = credentials

//         try {
//           const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employee/auth/login`, {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ username, password }),
//             credentials: 'include'
//           })

//           console.log('response come from back in next app', response.headers.get('Set-Cookie'))

//           if (!response.ok) {
//             const errorData = await response.json().catch(() => null)
//             const errorMessage = errorData?.message || 'Échec de la connexion. Vérifiez vos identifiants.'
//             throw new Error(errorMessage)
//           }

//           const data = await response.json()

//           return {
//             accessToken: data.accessToken
//           }
//         } catch (error: any) {
//           throw new Error(error.message || 'Service indisponible. Veuillez réessayer plus tard.')
//         }
//       }
//     })
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user?.accessToken) {
//         token.accessToken = user.accessToken
//       }
//       return token
//     },

//     session({ session, token }) {
//       session.accessToken = token.accessToken
//       return session
//     }
//   },
//   pages: {
//     signIn: '/login',
//     error: '/login'
//   },
//   events: {
//     async signOut() {
//       // nextCookies().delete('token')
//     }
//   },
//   secret: process.env.NEXT_PUBLIC_AUTH_SECRET || 'something'
// }

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
