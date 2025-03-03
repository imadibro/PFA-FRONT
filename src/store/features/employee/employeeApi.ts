import type { IRole } from '@/@core/utils/types'
import { api } from '@/store/api'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const employeeApi = api.injectEndpoints({
  endpoints: builder => ({
    getEmployees: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `employee`,
      providesTags: [{ type: 'Employee', id: 'LIST' }]
    }),
    createEmployee: builder.mutation<
      any,
      { username: string; email: string; firstName: string; lastName: string; password: string; role: IRole }
    >({
      query: newEmployee => ({
        url: 'employee',
        method: 'POST',
        body: newEmployee
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }]
    }),
    deleteEmployee: builder.mutation<any, { employeeId: string }>({
      query: employee => ({
        url: `employee/${employee.employeeId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }]
    }),
    updateEmployee: builder.mutation<
      any,
      {
        id: string
        username: string
        email: string
        firstName: string
        lastName: string
        password: string
        role: IRole
      }
    >({
      query: employee => ({
        url: `employee/${employee.id}`,
        method: 'PATCH',
        body: employee
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }]
    }),
    updateEmployeePassword: builder.mutation<
      any,
      {
        id: string
        currentPassword: string
        newPassword: string
      }
    >({
      query: employee => ({
        url: `employee/password/change`,
        method: 'PATCH',
        body: employee
      }),
      invalidatesTags: [{ type: 'Employee', id: 'LIST' }]
    })
  })
})

export const {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeePasswordMutation
} = employeeApi
