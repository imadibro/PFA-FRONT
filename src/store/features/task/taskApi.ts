import { api } from '@/store/api'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { SerializedError } from '@reduxjs/toolkit'

export const taskApi = api.injectEndpoints({
  endpoints: builder => ({
    getTasks: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `task`,
      providesTags: [{ type: 'Task', id: 'LIST' }]
    }),
    createTask: builder.mutation<any, { label: string; description: string }>({
      query: newTask => ({
        url: 'task',
        method: 'POST',
        body: newTask
      }),
      invalidatesTags: [
        { type: 'Task', id: 'LIST' },
        { type: 'TasksWithNoOperation', id: 'LIST' }
      ]
    }),
    getNotAssignedTasks: builder.query<any, FetchBaseQueryError | SerializedError | void>({
      query: () => `task/withNoOperation`,
      providesTags: [{ type: 'TasksWithNoOperation', id: 'LIST' }]
    }),
    deleteTask: builder.mutation<any, { taskId: string }>({
      query: task => ({
        url: `task/${task.taskId}`,
        method: 'DELETE'
      }),
      invalidatesTags: [
        { type: 'TasksWithNoOperation', id: 'LIST' },
        { type: 'Task', id: 'LIST' },
        { type: 'Operation', id: 'LIST' }
      ]
    }),
    updateTask: builder.mutation<any, { id: string; label: string; description: string }>({
      query: task => ({
        url: `task/${task.id}`,
        method: 'PATCH',
        body: task
      }),
      invalidatesTags: [
        { type: 'Task', id: 'LIST' },
        { type: 'TasksWithNoOperation', id: 'LIST' }
      ]
    })
  })
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useGetNotAssignedTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation
} = taskApi
