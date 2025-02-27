import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'

import { api } from '@/store/api'
import { IOperation } from '@/@core/utils/types'

export const operationApi = api.injectEndpoints({
  endpoints: builder => ({
    getOperations: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => 'operation',
      providesTags: [{ type: 'Operation', id: 'LIST' }]
    }),
    getOperationById: builder.query<IOperation, string>({
      query: operationId => `operation/${operationId}`,
      providesTags: (result, error, operationId) => [{ type: 'Operation', id: operationId }]
    }),
    createOperation: builder.mutation<any, { label: string; description: string; tasksIds: string[] }>({
      query: newOperation => ({
        url: 'operation',
        method: 'POST',
        body: newOperation
      }),
      invalidatesTags: [{ type: 'Operation', id: 'LIST' }]
    }),
    deleteOperation: builder.mutation<any, { operationId: string }>({
      query: operation => ({
        url: `operation/${operation.operationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'TasksWithNoOperation', id: 'LIST' },
        { type: 'Operation', id: 'LIST' }
      ]
    }),
    updateOperation: builder.mutation<
      any,
      { id: string; label: string; description: string; tasksToAdd: string[]; tasksToRemove: string[] }
    >({
      query: operation => ({
        url: `operation/${operation.id}`,
        method: 'PATCH',
        body: operation
      }),
      invalidatesTags: (result, error, operation) => [
        { type: 'Operation', id: 'LIST' },
        { type: 'Operation', id: operation.id }
      ]
    })
  })
})

export const {
  useGetOperationsQuery,
  useGetOperationByIdQuery,
  useCreateOperationMutation,
  useDeleteOperationMutation,
  useUpdateOperationMutation
} = operationApi
