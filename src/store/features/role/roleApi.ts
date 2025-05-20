import type { IRole } from '@/@core/utils/types'
import { api } from '@/store/api'

export const roleApi = api.injectEndpoints({
  endpoints: builder => ({
    getRoles: builder.query<IRole[], void>({
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
