import type { IEquipe, IEquipeRequest } from '@/@core/utils/types'
import api from '@/store/api'

export const equipeApi = api.injectEndpoints({
  endpoints: builder => ({
    createEquipe: builder.mutation<IEquipe, IEquipeRequest>({
      query: equipe => ({
        url: `equipe`,
        method: 'POST',
        body: equipe
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Equipe', id: `LIST` }]
    }),

    getEquipe: builder.query<
      { data: IEquipe[]; total: number; page: number; pages: number },
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `equipe`,
        params: { page, limit, search }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Equipe', id: 'LIST' },
        { type: 'Vehicule', id: `PAGE-${page}` }
      ]
    }),

    getEquipes: builder.query<IEquipe[], void>({
      query: () => ({
        url: `equipe/all`
      }),
      // transformResponse: (response: any) => {
      //   console.log('response ===>', response)
      //   return response.data
      // },
      providesTags: [{ type: 'Equipe', id: 'ALL-LIST' }]
    }),

    updateEquipe: builder.mutation<IEquipe, { id: string; equipe: IEquipeRequest }>({
      query: ({ id, equipe }) => ({
        url: `equipe/${id}`,
        method: 'PATCH',
        body: equipe
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Equipe', id: `LIST` }]
    }),

    deleteEquipe: builder.mutation<number, { id: string }>({
      query: ({ id }) => ({
        url: `equipe/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Equipe', id: `LIST` }]
    })
  })
})

export const {
  useCreateEquipeMutation,
  useDeleteEquipeMutation,
  useGetEquipeQuery,
  useUpdateEquipeMutation,
  useGetEquipesQuery
} = equipeApi
