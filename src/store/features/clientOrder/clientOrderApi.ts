import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { SerializedError } from '@reduxjs/toolkit'
import { api } from '@/store/api'

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
    updateClientOrder: builder.mutation<any, FetchBaseQueryError | SerializedError | void>({
      query: body => ({
        url: `client-order`,
        method: 'PUT',
        body
      }),
      invalidatesTags: [{ type: 'ClientOrder', id: 'LIST' }]
    }),
    deleteClientOrder: builder.mutation<any, FetchBaseQueryError | SerializedError | void>({
      query: id => ({
        url: `client-order/${id}`,
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
