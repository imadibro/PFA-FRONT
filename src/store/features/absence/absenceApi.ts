import type { IAbsenceReasons, IEmployee } from '@/@core/utils/types'
import { api } from '@/store/api'

export const absenceApi = api.injectEndpoints({
  endpoints: builder => ({
    getAbsences: builder.query<any, { page: number; limit: number; search?: string }>({
      query: ({ page, limit, search }) => ({
        url: 'absence',
        params: {
          page,
          limit,
          search
        }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Absence', id: 'LIST' },
        { type: 'Absence', id: `PAGE-${page}` }
      ]
    }),
    getAllAbsences: builder.query<any, { startDate?: string; endDate?: string }>({
      query: ({ startDate, endDate }) => ({
        url: 'absence/Absence-for-planning',
        params: {
          startDate,
          endDate
        }
      }),
      providesTags: (_result, _error) => [{ type: 'Absence', id: 'LIST' }]
    }),
    createAbsence: builder.mutation<
      any,
      {
        employee: IEmployee
        absence: IAbsenceReasons
        autre?: string
        startDate: string
        endDate: string
        notes?: string | null
      }
    >({
      query: newAbsence => ({
        url: 'absence',
        method: 'POST',
        body: newAbsence
      }),
      invalidatesTags: [{ type: 'Absence', id: 'LIST' }]
    }),
    deleteAbsence: builder.mutation<any, { absenceId: string }>({
      query: absence => ({
        url: `absence/${absence.absenceId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Absence', id: 'LIST' }]
    }),
    updateAbsence: builder.mutation<
      any,
      {
        id: string
        employee: IEmployee
        absence: IAbsenceReasons
        autre?: string
        startDate: string
        endDate: string
        notes: string | null | undefined
      }
    >({
      query: absence => ({
        url: `absence/${absence.id}`,
        method: 'PATCH',
        body: absence
      }),
      invalidatesTags: [{ type: 'Absence', id: 'LIST' }]
    })
  })
})

export const {
  useGetAbsencesQuery,
  useCreateAbsenceMutation,
  useDeleteAbsenceMutation,
  useUpdateAbsenceMutation,
  useGetAllAbsencesQuery
} = absenceApi
