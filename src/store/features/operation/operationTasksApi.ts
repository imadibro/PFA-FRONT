import type { IOperationTask, IOperationTrans, IOperationType, IOperationZone } from '@/@core/utils/types'
import { api } from '@/store/api'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const operationApi = api.injectEndpoints({
  endpoints: builder => ({
    getOperationsTasks: builder.query<IOperationTask[], FetchBaseQueryError | SerializedError | void>({
      query: () => 'operation-tasks',
      providesTags: [{ type: 'OperationTasks', id: 'LIST' }]
    }),
    getOperationsTypes: builder.query<IOperationType[], FetchBaseQueryError | SerializedError | void>({
      query: () => 'operation-type',
      providesTags: [{ type: 'OperationTypes', id: 'LIST' }]
    }),
    getOperationsTrans: builder.query<IOperationTrans[], FetchBaseQueryError | SerializedError | void>({
      query: () => 'operation-trans',
      providesTags: [{ type: 'OperationTasks', id: 'LIST' }]
    }),
    getOperationsZones: builder.query<IOperationZone[], FetchBaseQueryError | SerializedError | void>({
      query: () => 'operation-zone',
      providesTags: [{ type: 'OperationTasks', id: 'LIST' }]
    }),
    getOperationTasksById: builder.query<IOperationTask, string>({
      query: operationId => `operation-tasks/${operationId}`,
      providesTags: (result, error, operationId) => [{ type: 'OperationTasks', id: operationId }]
    }),
    createOperationTasks: builder.mutation<
      IOperationTask,
      { operationTypeId: string; operationZoneId: string; operationTransId: string; operationTasksIds: string[] }
    >({
      query: newOperation => ({
        url: 'operation-tasks',
        method: 'POST',
        body: newOperation
      }),
      invalidatesTags: [{ type: 'OperationTasks', id: 'LIST' }]
    }),
    deleteOperationTasks: builder.mutation<IOperationTask, { operationId: string }>({
      query: operation => ({
        url: `operation-tasks/${operation.operationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'TasksWithNoOperation', id: 'LIST' },
        { type: 'OperationTasks', id: 'LIST' }
      ]
    }),
    updateOperationTasks: builder.mutation<
      IOperationTask,
      {
        id: string
        operationTypeId: string
        operationZoneId: string
        operationTransId: string
        operationTasksIds: string[]
      }
    >({
      query: operation => ({
        url: `operation-tasks/${operation.id}`,
        method: 'PATCH',
        body: operation
      }),
      invalidatesTags: (result, error, operation) => [
        { type: 'OperationTasks', id: 'LIST' },
        { type: 'OperationTasks', id: operation.id }
      ]
    })
  })
})

export const {
  useGetOperationsTasksQuery,
  useGetOperationsTypesQuery,
  useGetOperationsTransQuery,
  useGetOperationsZonesQuery,
  useGetOperationTasksByIdQuery,
  useCreateOperationTasksMutation,
  useDeleteOperationTasksMutation,
  useUpdateOperationTasksMutation
} = operationApi
