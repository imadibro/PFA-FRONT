import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'
import { api } from '@/store/api'
import type { IRequirement } from '@/@core/utils/types'

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
    deleteRequirement: builder.mutation<any, { requirementId: string }>({
      query: requirement => ({
        url: `requirement/${requirement.requirementId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'Requirement', id: 'LIST' },
        { type: 'Site', id: 'LIST' }
      ]
    }),
    updateRequirement: builder.mutation<any, { id: string; label: string; description: string; priority: string }>({
      query: requirement => ({
        url: `requirement/${requirement.id}`,
        method: 'PATCH',
        body: requirement
      }),
      invalidatesTags: [{ type: 'Requirement', id: 'LIST' }]
    }),
    getRequirementsByLabels: builder.query<IRequirement[], string[]>({
      query: labels => ({
        url: 'requirement/search/by-labels',
        params: {
          labels: labels.join(',')
        }
      })
    })
  })
})

export const {
  useGetRequirementQuery,
  useCreateRequirementMutation,
  useDeleteRequirementMutation,
  useUpdateRequirementMutation,
  useLazyGetRequirementsByLabelsQuery
} = requirementApi
