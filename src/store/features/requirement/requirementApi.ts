import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'

export const requirementApi = api.injectEndpoints({
  endpoints: builder => ({
    getRequirement: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `requirement`,
      providesTags: [{ type: 'Requirement', id: 'LIST' }]
    }),
    createRequirement: builder.mutation<any, { label: string; description: string; priority: string }>({
      query: newRequirement => ({
        url: 'requirement',
        method: 'POST',
        body: newRequirement
      }),
      invalidatesTags: [{ type: 'Requirement', id: 'LIST' }]
    }),
    getNotAssignedRequirements: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `requirement/withNoSite`,
      providesTags: [{ type: 'RequirementsWithNoSite', id: 'LIST' }]
    }),
    deleteRequirement: builder.mutation<any, { requirementId: string }>({
      query: requirement => ({
        url: `requirement/${requirement.requirementId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'RequirementsWithNoSite', id: 'LIST' },
        { type: 'Requirement', id: 'LIST' },
        { type: 'Site', id: 'LIST' }
      ]
    })
  })
})

export const {
  useGetRequirementQuery,
  useCreateRequirementMutation,
  useGetNotAssignedRequirementsQuery,
  useDeleteRequirementMutation
} = requirementApi
