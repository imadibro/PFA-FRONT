import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
  tagTypes: ['Task', 'TasksWithNoOperation', 'Requirement', 'Site', 'RequirementsWithNoSite', 'Operation'],
  endpoints: () => ({})
})

export default api
