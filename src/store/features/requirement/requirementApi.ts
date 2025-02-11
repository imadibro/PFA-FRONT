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
    })
  })
})

export const { useGetRequirementQuery, useCreateRequirementMutation } = requirementApi
