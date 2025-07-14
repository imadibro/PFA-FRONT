import { api } from '@/store/api'
import type { IClient } from '@/@core/utils/types'

export const clientApi = api.injectEndpoints({
  endpoints: builder => ({
    getClients: builder.query<IClient[], void>({
      query: () => `client`,
      providesTags: [{ type: 'Client', id: 'LIST' }]
    })
  })
})

export const { useGetClientsQuery } = clientApi
