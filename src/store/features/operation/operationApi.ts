import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'

export const operationApi = api.injectEndpoints({
  endpoints: builder => ({
    getOperations: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => 'operation',
      providesTags: [{ type: 'Operation', id: 'LIST' }]
    }),
    createOperation: builder.mutation<any, { label: string; description: string }>({
      query: newOperation => ({
        url: 'operation',
        method: 'POST',
        body: newOperation
      }),
      invalidatesTags: [{ type: 'Operation', id: 'LIST' }]
    }),
    mapTasksToOperation: builder.mutation<any, { operationId: string; tasksIds: string[] }>({
      query: payload => ({
        url: `operation/${payload.operationId}/tasks`,
        method: 'PATCH',
        body: payload
      }),
      invalidatesTags: [
        { type: 'Operation', id: 'LIST' },
        { type: 'TasksWithNoOperation', id: 'LIST' }
      ]
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
    })
  })
})

export const {
  useGetOperationsQuery,
  useCreateOperationMutation,
  useMapTasksToOperationMutation,
  useDeleteOperationMutation
} = operationApi
