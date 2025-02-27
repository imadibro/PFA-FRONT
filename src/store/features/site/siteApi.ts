import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'
import { ISite } from '@/@core/utils/types'

export const siteApi = api.injectEndpoints({
  endpoints: builder => ({
    getSite: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => 'site',
      providesTags: [{ type: 'Site', id: 'LIST' }]
    }),
    getSiteById: builder.query<ISite, string>({
      query: siteId => `site/${siteId}`,
      providesTags: (result, error, siteId) => [{ type: 'Site', id: siteId }]
    }),
    createSite: builder.mutation<
      any,
      { label: string; siteNbr: string; description: string; requirementsIds: string[] }
    >({
      query: newSite => ({
        url: 'site',
        method: 'POST',
        body: newSite
      }),
      invalidatesTags: [{ type: 'Site', id: 'LIST' }]
    }),

    deleteSite: builder.mutation<any, { siteId: string }>({
      query: site => ({
        url: `site/${site.siteId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Site', id: 'LIST' }]
    }),
    updateSite: builder.mutation<
      any,
      {
        id: string
        label: string
        siteNbr: string
        description: string
        requirementsToAdd: string[]
        requirementsToRemove: string[]
      }
    >({
      query: site => ({
        url: `site/${site.id}`,
        method: 'PATCH',
        body: site
      }),
      invalidatesTags: (result, error, site) => [
        { type: 'Site', id: 'LIST' },
        { type: 'Site', id: site.id }
      ]
    })
  })
})

export const {
  useGetSiteQuery,
  useGetSiteByIdQuery,
  useCreateSiteMutation,
  useDeleteSiteMutation,
  useUpdateSiteMutation
} = siteApi
