import type { IVehicule, IVehiculeModel, IVehiculeRequest } from '@/@core/utils/types'
import api from '@/store/api'

export const vehiculeApi = api.injectEndpoints({
  endpoints: builder => ({
    createVehicule: builder.mutation<IVehicule, IVehiculeRequest>({
      query: vehicule => ({
        url: `vehicule`,
        method: 'POST',
        body: vehicule
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule', id: `LIST` }]
    }),

    getVehicule: builder.query<
      { data: IVehicule[]; total: number; page: number; pages: number },
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `vehicule`,
        params: {
          page,
          limit,
          search
        }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Vehicule', id: 'LIST' },
        { type: 'Vehicule', id: `PAGE-${page}` }
      ]
    }),

    getVehiculeModel: builder.query<IVehiculeModel[], void>({
      query: () => ({
        url: `vehicule-model`
      }),
      providesTags: (_result, _error) => [{ type: 'vehicule-model', id: 'LIST' }]
    }),

    updateVehicule: builder.mutation<IVehicule, { id: string; vehicule: IVehiculeRequest }>({
      query: ({ id, vehicule }) => ({
        url: `vehicule/${id}`,
        method: 'PATCH',
        body: vehicule
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule', id: `LIST` }]
    }),

    deleteVehicule: builder.mutation<number, { id: string }>({
      query: ({ id }) => ({
        url: `vehicule/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule', id: `LIST` }]
    })
  })
})

export const {
  useGetVehiculeQuery,
  useDeleteVehiculeMutation,
  useUpdateVehiculeMutation,
  useCreateVehiculeMutation,
  useGetVehiculeModelQuery
} = vehiculeApi
