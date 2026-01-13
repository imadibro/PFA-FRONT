import { api } from '@/store/api'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const projectApi = api.injectEndpoints({
  endpoints: builder => ({
    getProjects: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `project/all`,
      providesTags: [{ type: 'Project', id: 'LIST' }]
    }),
    getAllProjectForClients: builder.query<any, { page: number; limit: number; search: string }>({
      query: ({ page, limit, search }) => `project/clients/projects?page=${page}&limit=${limit}&search=${search}`,
      providesTags: [{ type: 'Project', id: 'LIST' }]
    })
  })
})

export const { useGetProjectsQuery, useGetAllProjectForClientsQuery } = projectApi
