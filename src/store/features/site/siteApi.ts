import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'

export const siteApi = api.injectEndpoints({
  endpoints: builder => ({
    getSite: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => 'site',
      providesTags: [{ type: 'Site', id: 'LIST' }]
    }),
    createSite: builder.mutation<any, { label: string; siteNbr: string; description: string }>({
      query: newSite => ({
        url: 'site',
        method: 'POST',
        body: newSite
      }),
      invalidatesTags: [{ type: 'Site', id: 'LIST' }]
    }),
    mapRequirementsToSite: builder.mutation<any, { siteId: string; requirementsIds: string[] }>({
      query: payload => ({
        url: `site/${payload.siteId}/requirements`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: [
        { type: 'Site', id: 'LIST' },
        { type: 'RequirementsWithNoSite', id: 'LIST' }
      ]
    })
  })
})

export const { useGetSiteQuery, useCreateSiteMutation, useMapRequirementsToSiteMutation } = siteApi
