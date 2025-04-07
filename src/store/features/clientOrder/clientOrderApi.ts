import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'
import { api } from '@/store/api'
import type { IClient, IOperation, IProject, ISite } from '@/@core/utils/types'

export const clientOrderApi = api.injectEndpoints({
  endpoints: builder => ({
    getClientOrders: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `client-order`,
      providesTags: [{ type: 'ClientOrder', id: 'LIST' }]
    }),
    createClientOrder: builder.mutation<any, FetchBaseQueryError | SerializedError | void>({
      query: (body: any) => ({
        url: `client-order`,
        method: 'POST',
        body
      }),
      invalidatesTags: [{ type: 'ClientOrder', id: 'LIST' }]
    }),
    updateClientOrder: builder.mutation<
      any,
      {
        id: string
        orderReference: string
        orderDate: string
        status: string
        notes: string
        totalAmount: number
        client: IClient
        site: ISite
        project: IProject
        operation: IOperation
      }
    >({
      query: body => ({
        url: `client-order/${body.id}`,
        method: 'PATCH',
        body
      }),
      invalidatesTags: [{ type: 'ClientOrder', id: 'LIST' }]
    }),
    deleteClientOrder: builder.mutation<any, { clientOrderId: string }>({
      query: clientOrder => ({
        url: `client-order/${clientOrder.clientOrderId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'ClientOrder', id: 'LIST' }]
    })
  })
})

export const {
  useGetClientOrdersQuery,
  useCreateClientOrderMutation,
  useUpdateClientOrderMutation,
  useDeleteClientOrderMutation
} = clientOrderApi
