import type { ISite, ISiteOwner, ISiteType } from '@/@core/utils/types'
import { api } from '@/store/api'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const siteApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSitesForDropDawn: builder.query<ISite[], void>({
      query: () => `site/all`,
      providesTags: [{ type: 'Site', id: 'LIST' }]
    }),
    getSite: builder.query<
      { data: ISite[]; total: number; page: number; pages: number },
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: 'site',
        params: {
          page,
          limit,
          search
        }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Site', id: 'LIST' },
        { type: 'Site', id: `PAGE-${page}` }
      ]
    }),
    getSiteById: builder.query<ISite, string>({
      query: siteId => `site/${siteId}`,
      providesTags: (result, error, siteId) => [{ type: 'Site', id: siteId }]
    }),
    getSiteOwners: builder.query<ISiteOwner[], FetchBaseQueryError | SerializedError | void>({
      query: () => 'site/owners',
      providesTags: [{ type: 'Site', id: 'owners' }]
    }),
    getSiteTypes: builder.query<ISiteType[], FetchBaseQueryError | SerializedError | void>({
      query: () => 'site/types',
      providesTags: [{ type: 'Site', id: 'types' }]
    }),

    createSite: builder.mutation<
      any,
      {
        label: string
        siteNbr: string
        description: string
        siteOwnerId: string | undefined
        siteTypeId: string | undefined
        requirementsIds: string[]
      }
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
        siteOwnerId: string | undefined
        siteTypeId: string | undefined
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
  useGetAllSitesForDropDawnQuery,
  useGetSiteByIdQuery,
  useGetSiteOwnersQuery,
  useGetSiteTypesQuery,
  useCreateSiteMutation,
  useDeleteSiteMutation,
  useUpdateSiteMutation
} = siteApi
