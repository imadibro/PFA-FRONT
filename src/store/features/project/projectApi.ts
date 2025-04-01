import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'
import { api } from '@/store/api'

export const projectApi = api.injectEndpoints({
  endpoints: builder => ({
    getProjects: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `project/all`,
      providesTags: [{ type: 'Project', id: 'LIST' }]
    })
  })
})

export const { useGetProjectsQuery } = projectApi
