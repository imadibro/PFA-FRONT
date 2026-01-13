import type { IVehiculeType, IVehiculeTypeRequest } from '@/@core/utils/types'
import { api } from '@/store/api'

export const VehiculeTypeApi = api.injectEndpoints({
  endpoints: builder => ({
    createVehiculeType: builder.mutation<IVehiculeType, IVehiculeTypeRequest>({
      query: vehicule => ({
        url: `VehiculeType`,
        method: 'POST',
        body: vehicule
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule-type', id: `LIST` }]
    }),

    getVehiculeType: builder.query<
      { data: IVehiculeType[]; total: number; page: number; pages: number },
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `VehiculeType`,
        params: {
          page,
          limit,
          search
        }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Vehicule-type', id: 'LIST' },
        { type: 'Vehicule-type', id: `PAGE-${page}` }
      ]
    }),

    getAllVehiculeType: builder.query<IVehiculeType[], void>({
      query: () => ({
        url: `VehiculeType/all`
      }),
      transformResponse: (response: { data: IVehiculeType[] }) => response.data,
      providesTags: (_result, _error) => [{ type: 'Vehicule-type', id: 'LIST' }]
    }),
    updateVehiculeType: builder.mutation<IVehiculeType, { id: string; vehicule: IVehiculeTypeRequest }>({
      query: ({ id, vehicule }) => ({
        url: `VehiculeType/${id}`,
        method: 'PATCH',
        body: vehicule
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule-type', id: `LIST` }]
    }),

    deleteVehiculeType: builder.mutation<number, { id: string }>({
      query: ({ id }) => ({
        url: `VehiculeType/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Vehicule-type', id: `LIST` }]
    })
  })
})

export const {
  useCreateVehiculeTypeMutation,
  useGetVehiculeTypeQuery,
  useGetAllVehiculeTypeQuery,
  useUpdateVehiculeTypeMutation,
  useDeleteVehiculeTypeMutation
} = VehiculeTypeApi
