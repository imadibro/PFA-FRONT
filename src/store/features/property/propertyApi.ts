import { api } from '@/store/api'
import type { Property } from '@/components/global-horizon/types'

export const propertyApi = api.injectEndpoints({
  endpoints: builder => ({
    // Get all properties
    getProperties: builder.query<Property[], void>({
      query: () => '/properties',
      providesTags: ['Property']
    }),

    // Get property by ID
    getPropertyById: builder.query<Property, string>({
      query: id => `/properties/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Property', id }]
    }),

    // Search properties
    searchProperties: builder.query<
      Property[],
      {
        query?: string
        category?: string
        minRating?: number
        maxPrice?: number
        city?: string
      }
    >({
      query: params => ({
        url: '/properties/search',
        params
      }),
      providesTags: ['Property']
    }),

    // Get trending destinations
    getTrendingDestinations: builder.query<
      Array<{ id: string; name: string; country: string; image: string; staysCount: number }>,
      void
    >({
      query: () => '/properties/trending-destinations'
    })
  })
})

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useSearchPropertiesQuery,
  useGetTrendingDestinationsQuery
} = propertyApi
