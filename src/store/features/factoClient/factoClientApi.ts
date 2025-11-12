import type { IFactoClient } from '@/@core/utils/types'
import api from '@/store/api'

export const factoClientApi = api.injectEndpoints({
  endpoints: builder => ({
    getFactoClients: builder.query<
      {
        data: IFactoClient[]
        total: number
        page: number
        pages: number
      },
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `client/facto-client`,
        params: { page, limit, search }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'FactoClient', id: 'LIST' },
        { type: 'FactoClient', id: `PAGE-${page}` }
      ]
    }),

    updateFactoClientColor: builder.mutation<any, { id: string; colorCode: string }>({
      query: ({ id, colorCode }) => ({
        url: `client/color/${id}`,
        method: 'PATCH',
        body: { colorCode }
      }),
      invalidatesTags: (_result, _error) => [{ type: 'FactoClient', id: `LIST` }]
    })
  })
})

export const { useGetFactoClientsQuery, useUpdateFactoClientColorMutation } = factoClientApi
