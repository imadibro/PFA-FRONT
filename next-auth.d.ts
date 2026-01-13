// import 'next-auth'

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       _id: string
//       firstName: string
//       lastName: string
//       email: string
//       username: string
//       status: string
//     }
//     tokens: {
//       token: string
//     }
//     expires: string
//   }
// }

// import { JWT } from 'next-auth/jwt'

// declare module 'next-auth/jwt' {
//   interface JWT {
//     user: {
//       _id: string
//       firstName: string
//       lastName: string
//       email: string
//       username: string
//       status: string
//     }
//     tokens: {
//       token: string
//     }
//     expires: string
//   }
// }

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
