import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession, signIn, signOut } from 'next-auth/react'

/* =======================
   CACHE EN MÉMOIRE
======================= */
let cachedAccessToken: string | null = null
let cachedExp: number | null = null
let refreshPromise: Promise<void> | null = null
let loadSessionPromise: Promise<void> | null = null
let isSessionLoaded = false

/* =======================
   LOAD SESSION UNE FOIS
======================= */
const loadSessionIfNeeded = async () => {
  // ⛔ déjà chargée
  if (isSessionLoaded) return

  // ⛔ chargement déjà en cours
  if (loadSessionPromise) return loadSessionPromise

  loadSessionPromise = (async () => {
    const session = await getSession()
    if (!session?.accessToken) {
      await signOut({ callbackUrl: '/login' })
      isSessionLoaded = false
      loadSessionPromise = null
      return
    }

    cachedAccessToken = session.accessToken
    const payload = JSON.parse(atob(session.accessToken.split('.')[1]))
    cachedExp = payload.exp * 1000
    isSessionLoaded = true
  })()

  return loadSessionPromise
}

/* =======================
   INVALIDATE CACHE (au login)
======================= */
export const invalidateSessionCache = () => {
  cachedAccessToken = null
  cachedExp = null
  isSessionLoaded = false
  refreshPromise = null
  loadSessionPromise = null
}

/* =======================
   ENSURE TOKEN VALIDE
======================= */
const ensureValidToken = async () => {
  await loadSessionIfNeeded()

  if (!cachedAccessToken || !cachedExp) return

  // ✅ token encore valide (30s de marge)
  if (cachedExp > Date.now()) return

  // ⛔ refresh déjà en cours
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })

      //  refresh expiré → logout
      if (!res.ok) {
        cachedAccessToken = null
        cachedExp = null
        isSessionLoaded = false
        await signOut({ callbackUrl: '/login' })
        throw new Error('Refresh token expired')
      }

      const { accessToken } = await res.json()

      //  update cache
      cachedAccessToken = accessToken
      cachedExp = JSON.parse(atob(accessToken.split('.')[1])).exp * 1000

      //  update NextAuth
      await signIn('credentials', {
        accessToken,
        redirect: false
      })
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/* =======================
   BASE QUERY
======================= */
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  prepareHeaders: async headers => {
    await ensureValidToken()

    if (cachedAccessToken) {
      headers.set('Authorization', `Bearer ${cachedAccessToken}`)
    }

    return headers
  }
})

/* =======================
   BASE QUERY WITH REAUTH
======================= */
export const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status === 401) {
    // ⛔ évite les requêtes multiples en 401
    if (refreshPromise) {
      await refreshPromise
      // 🔁 RETRY ORIGINAL REQUEST
      result = await baseQuery(args, api, extraOptions)
    } else {
      // 🔁 REFRESH (browser)
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!refreshRes.ok) {
        await signOut({ callbackUrl: '/login' })
        return result
      }

      const { accessToken } = await refreshRes.json()

      // 🔥 UPDATE NEXTAUTH SESSION
      await signIn('credentials', {
        accessToken,
        redirect: false
      })

      // 🔑 UPDATE CACHE
      cachedAccessToken = accessToken
      cachedExp = JSON.parse(atob(accessToken.split('.')[1])).exp * 1000

      // 🔁 RETRY ORIGINAL REQUEST
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

/* =======================
   RTK QUERY API
======================= */
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Client', 'Property', 'Booking', 'Message', 'User'],
  endpoints: () => ({})
})

export default api
