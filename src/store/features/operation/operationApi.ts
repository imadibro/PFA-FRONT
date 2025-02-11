import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'

export const operationApi = api.injectEndpoints({
  endpoints: builder => ({
    getOperations: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `operation`
    })
  })
})

export const { useGetOperationsQuery } = operationApi
