import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'

export const siteApi = api.injectEndpoints({
  endpoints: builder => ({
    getSite: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => 'site'
    }),
    createSite: builder.mutation<any, { label: string; description: string }>({
      query: newSite => ({
        url: 'site',
        method: 'POST',
        body: newSite
      }),
      invalidatesTags: [{ type: 'Site', id: 'LIST' }]
    })
  })
})

export const { useGetSiteQuery } = siteApi
