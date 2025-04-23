import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    prepareHeaders: async headers => {
      const session = await getSession()
      if (session?.tokens?.token) {
        headers.set('Authorization', `Bearer ${session.tokens.token}`)
      }

      return headers
    }
  }),

  tagTypes: [
    'Task',
    'TasksWithNoOperation',
    'Requirement',
    'Site',
    'Operation',
    'OperationTasks',
    'OperationTypes',
    'OperationTrans',
    'OperationZones',
    'Employee',
    'Role',
    'AbsenceReason',
    'Absence',
    'Project',
    'ClientOrder',
    'Client'
  ],
  endpoints: _builder => ({})
})

export default api
