import type { IVehiculeOwner, IVehiculeOwnerRequest } from '@/@core/utils/types'
import { api } from '@/store/api'

export const vehiculeOwnerApi = api.injectEndpoints({
  endpoints: builder => ({
    createVehiculeOwner: builder.mutation<IVehiculeOwner, IVehiculeOwnerRequest>({
      query: vehicule => ({
        url: `vehiculeOwner`,
        method: 'POST',
        body: vehicule
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule-owner', id: `LIST` }]
    }),

    getVehiculeOwner: builder.query<
      { data: IVehiculeOwner[]; total: number; page: number; pages: number },
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `vehiculeOwner`,
        params: {
          page,
          limit,
          search
        }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Vehicule-owner', id: 'LIST' },
        { type: 'Vehicule-owner', id: `PAGE-${page}` }
      ]
    }),

    getAllVehiculeOwner: builder.query<IVehiculeOwner[], void>({
      query: () => ({ url: 'vehiculeOwner/all' }),
      transformResponse: (response: { data: IVehiculeOwner[] }) => response.data,
      providesTags: [{ type: 'Vehicule-owner', id: 'LIST' }]
    }),
    updateVehiculeOwner: builder.mutation<IVehiculeOwner, { id: string; vehicule: IVehiculeOwnerRequest }>({
      query: ({ id, vehicule }) => ({
        url: `vehiculeOwner/${id}`,
        method: 'PATCH',
        body: vehicule
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule-owner', id: `LIST` }]
    }),

    deleteVehiculeOwner: builder.mutation<number, { id: string }>({
      query: ({ id }) => ({
        url: `vehiculeOwner/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule-owner', id: `LIST` }]
    })
  })
})

export const {
  useCreateVehiculeOwnerMutation,
  useGetVehiculeOwnerQuery,
  useGetAllVehiculeOwnerQuery,
  useUpdateVehiculeOwnerMutation,
  useDeleteVehiculeOwnerMutation
} = vehiculeOwnerApi
