import type { IOperation, IOperationRequest } from '@/@core/utils/types'
import { api } from '@/store/api'

export const operationApi = api.injectEndpoints({
  endpoints: builder => ({
    createOperation: builder.mutation<IOperation, IOperationRequest>({
      query: newOperation => ({
        url: 'operation',
        method: 'POST',
        body: newOperation
      }),
      invalidatesTags: (_result, _error) => [
        { type: 'Operation', id: 'LIST' },
        { type: 'Operation', id: 'ALL-LIST' }
      ]
    }),

    getAllOperations: builder.query<IOperation[], void>({
      query: () => ({
        url: 'operation/all'
      }),
      providesTags: [{ type: 'Operation', id: 'ALL-LIST' }]
    }),

    getOperations: builder.query<
      { data: IOperation[]; total: number; page: number; pages: number },
      { page: number; limit: number; search: string }
    >({
      query: ({ page, limit, search }) => ({
        url: `operation`,
        params: { page, limit, search }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Operation', id: 'LIST' },
        { type: 'Operation', id: `PAGE-${page}` }
      ]
    }),

    getOperationById: builder.query<IOperation, string>({
      query: operationId => `operation/${operationId}`,
      providesTags: (result, error, operationId) => [{ type: 'Operation', id: operationId }]
    }),

    deleteOperation: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `operation/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        // { type: 'TasksWithNoOperation', id: 'LIST' },
        { type: 'Operation', id: 'LIST' }
      ]
    }),
    updateOperation: builder.mutation<IOperation, { id: string; operation: IOperationRequest }>({
      query: ({ id, operation }) => ({
        url: `operation/${id}`,
        method: 'PATCH',
        body: operation
      }),
      invalidatesTags: (_result, _error) => [
        { type: 'Operation', id: 'LIST' }
        // { type: 'Operation', id: operation.id }
      ]
    })
  })
})

export const {
  useGetOperationsQuery,
  useGetAllOperationsQuery,
  useGetOperationByIdQuery,
  useCreateOperationMutation,
  useDeleteOperationMutation,
  useUpdateOperationMutation
} = operationApi
