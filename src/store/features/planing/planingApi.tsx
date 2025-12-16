import type { IPlanning, IPlanningRequest } from '@/@core/utils/types'
import { api } from '@/store/api'

export const planningApi = api.injectEndpoints({
  endpoints: builder => ({
    createPlaning: builder.mutation<IPlanning[], { plannings: IPlanningRequest[] }>({
      query: planing => ({
        url: `planning`,
        method: 'POST',
        body: planing
      })
      // invalidatesTags: (_result, _error) => [{ type: 'Planing', id: `LIST` }]
    }),

    getPlaning: builder.query<IPlanning[], { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: `planning`,
        method: 'GET',
        params: { startDate, endDate }
      }),
      providesTags: [{ type: 'Planing', id: 'LIST' }]
      // async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
      //   try {
      //     await queryFulfilled
      //     // ➜ refetch de getAllOperations (si abonné)
      //     dispatch(api.util.invalidateTags([{ type: 'Operation', id: 'ALL-LIST' }]))
      //   } catch {}
      // }
    }),

    updatePlaning: builder.mutation<IPlanning, IPlanningRequest>({
      query: ({ id, ...patch }) => ({
        url: `planning/${id}`,
        method: 'PATCH',
        body: patch
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Planing', id: `LIST` }]
    }),
    deletePlaning: builder.mutation<boolean, { id: string }>({
      query: ({ id }) => ({
        url: `planning/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Planing', id: `LIST` }]
    }),
    exportPlanningExcel: builder.query<Blob, { startDate?: string; endDate?: string }>({
      query: ({ startDate, endDate }) => {
        const params = new URLSearchParams()
        if (startDate) params.set('startDate', startDate)
        if (endDate) params.set('endDate', endDate)

        return {
          url: `/planning/export${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
          responseHandler: response => response.blob()
        }
      }
    }),
    updateSiteStatus: builder.mutation<IPlanning, { planningId: string; siteId: string; isSiteDone: boolean }>({
      query: ({ planningId, siteId, isSiteDone }) => ({
        url: `planning/${planningId}/siteId/${siteId}`,
        method: 'PATCH',
        body: { isSiteDone }
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Planing', id: 'LIST' }]
    })
  })
})

export const {
  useCreatePlaningMutation,
  useGetPlaningQuery,
  useUpdatePlaningMutation,
  useDeletePlaningMutation,
  useLazyGetPlaningQuery,
  useLazyExportPlanningExcelQuery,
  useUpdateSiteStatusMutation
} = planningApi
