import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'

export const roleApi = api.injectEndpoints({
  endpoints: builder => ({
    getRoles: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `employee-role`,
      providesTags: [{ type: 'Role', id: 'LIST' }]
    }),
    updateRole: builder.mutation<any, { id: string; role: string }>({
      query: role => ({
        url: `employee-role/${role.id}`,
        method: 'PATCH',
        body: role
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }]
    })
  })
})

export const { useGetRolesQuery, useUpdateRoleMutation } = roleApi
