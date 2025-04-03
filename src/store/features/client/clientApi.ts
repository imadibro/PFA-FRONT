import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'
import { api } from '@/store/api'

export const clientApi = api.injectEndpoints({
  endpoints: builder => ({
    getClient: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `client`,
      providesTags: [{ type: 'Client', id: 'LIST' }]
    })
  })
})

export const { useGetClientQuery } = clientApi
