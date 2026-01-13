import type { IEmployee } from '@/@core/utils/types'
import { api } from '@/store/api'

export const employeeApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllEmployees: builder.query<IEmployee[], void>({
      query: () => `employee/allEmployees`,
      providesTags: [{ type: 'Employee', id: 'LIST' }]
    }),

    getEmployees: builder.query<
      { data: IEmployee[]; total: number; page: number; pages: number },
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: 'employee',
        params: {
          page,
          limit,
          search
        }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Employee', id: 'LIST' },
        { type: 'Employee', id: `PAGE-${page}` }
      ]
    }),
    getCurrentEmployee: builder.query<IEmployee, void>({
      query: () => `employee/currentEmployee`
    }),
    logOutEmployee: builder.mutation<void, void>({
      query: () => ({
        url: 'employee/auth/logout',
        method: 'POST',
        credentials: 'include'
      })
    }),

    createEmployee: builder.mutation<
      any,
      { username: string; email: string; firstName: string; lastName: string; password: string; role: string }
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
        role: string
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
    }),
    getEmployeesByUsernames: builder.query<IEmployee[], string[]>({
      query: usernames => ({
        url: 'employee/search/by-usernames',
        params: {
          usernames: usernames.join(',')
        }
      })
    })
  })
})

export const {
  useGetAllEmployeesQuery,
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeePasswordMutation,
  useGetEmployeesByUsernamesQuery,
  useLazyGetEmployeesByUsernamesQuery,
  useGetCurrentEmployeeQuery,
  useLogOutEmployeeMutation
} = employeeApi
