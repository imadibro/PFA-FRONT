import { api } from '@/store/api'
import type { MessageThread, Message } from '@/components/global-horizon/types'

export const messageApi = api.injectEndpoints({
  endpoints: builder => ({
    // Get all message threads
    getMessageThreads: builder.query<MessageThread[], void>({
      query: () => '/messages/threads',
      providesTags: ['Message']
    }),

    // Get thread by ID
    getThreadById: builder.query<MessageThread, string>({
      query: id => `/messages/threads/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Message', id }]
    }),

    // Send message
    sendMessage: builder.mutation<
      Message,
      {
        threadId: string
        text: string
      }
    >({
      query: ({ threadId, text }) => ({
        url: `/messages/threads/${threadId}/messages`,
        method: 'POST',
        body: { text }
      }),
      invalidatesTags: ['Message']
    }),

    // Create new thread (contact host)
    createThread: builder.mutation<
      MessageThread,
      {
        propertyId: string
        propertyTitle: string
        initialMessage?: string
      }
    >({
      query: body => ({
        url: '/messages/threads',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Message']
    }),

    // Mark thread as read
    markThreadAsRead: builder.mutation<{ success: boolean }, string>({
      query: id => ({
        url: `/messages/threads/${id}/read`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Message']
    })
  })
})

export const {
  useGetMessageThreadsQuery,
  useGetThreadByIdQuery,
  useSendMessageMutation,
  useCreateThreadMutation,
  useMarkThreadAsReadMutation
} = messageApi
