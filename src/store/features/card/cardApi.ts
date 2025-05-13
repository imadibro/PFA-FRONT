import type { ICard, ICardRequest } from '@/@core/utils/types'
import api from '@/store/api'

export const cardApi = api.injectEndpoints({
  endpoints: builder => ({
    createCard: builder.mutation<ICard, ICardRequest>({
      query: card => ({
        url: `carte`,
        method: 'POST',
        body: card
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Card', id: `LIST` }]
    }),

    getCard: builder.query<
      { data: ICard[]; total: number; page: number; pages: number },
      { page: number; limit: number; filterByMatricule: string; filterByType: string }
    >({
      query: ({ page, limit, filterByMatricule, filterByType }) => ({
        url: `carte`,
        params: {
          page,
          limit,
          filterByMatricule,
          filterByType
        }
      }),
      providesTags: (_result, _error, { page }) => [
        { type: 'Card', id: `LIST` },
        { type: 'Card', id: `PAGE-${page}` }
      ]
    }),

    updateCard: builder.mutation<ICard, { id: string; card: ICardRequest }>({
      query: ({ id, card }) => ({
        url: `carte/${id}`,
        method: 'PATCH',
        body: card
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Card', id: `LIST` }]
    }),

    deletCard: builder.mutation<number, { id: string }>({
      query: ({ id }) => ({
        url: `carte/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (_result, _error) => [{ type: 'Card', id: `LIST` }]
    })
  })
})

export const { useGetCardQuery, useCreateCardMutation, useUpdateCardMutation, useDeletCardMutation } = cardApi
