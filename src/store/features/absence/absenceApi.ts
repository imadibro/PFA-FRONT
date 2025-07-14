import { api } from '@/store/api'
import type { IAbsenceReasons, IEmployee } from '@/@core/utils/types'

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

export const { useGetAbsencesQuery, useCreateAbsenceMutation, useDeleteAbsenceMutation, useUpdateAbsenceMutation } =
  absenceApi
