import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    error?: string | undefined
  }

  interface User {
    id: string
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    accessTokenExpires?: number
  }
}
