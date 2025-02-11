import { SerializedError } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/' }),
  tagTypes: ['Task', 'Requirement', 'Site'],
  endpoints: () => ({})
})

export default api
