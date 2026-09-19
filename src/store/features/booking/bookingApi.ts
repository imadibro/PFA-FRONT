import { api } from '@/store/api'
import type { Booking } from '@/components/global-horizon/types'

export const bookingApi = api.injectEndpoints({
  endpoints: builder => ({
    // Get user bookings
    getBookings: builder.query<Booking[], void>({
      query: () => '/bookings',
      providesTags: ['Booking']
    }),

    // Get booking by ID
    getBookingById: builder.query<Booking, string>({
      query: id => `/bookings/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Booking', id }]
    }),

    // Create new booking
    createBooking: builder.mutation<
      Booking,
      {
        propertyId: string
        checkIn: string
        checkOut: string
        guests: number
        totalAmount: number
        guestInfo: {
          name: string
          email: string
          phone: string
        }
        paymentMethod: string
      }
    >({
      query: body => ({
        url: '/bookings',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Booking']
    }),

    // Cancel booking
    cancelBooking: builder.mutation<{ success: boolean }, string>({
      query: id => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH'
      }),
      invalidatesTags: ['Booking']
    }),

    // Get booking statistics
    getBookingStats: builder.query<
      {
        totalInvested: number
        totalNights: number
        activeTrips: number
      },
      void
    >({
      query: () => '/bookings/stats'
    })
  })
})

export const {
  useGetBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useGetBookingStatsQuery
} = bookingApi
