import { api } from '@/store/api'
import type { UserProfile } from '@/components/global-horizon/types'

export const userApi = api.injectEndpoints({
  endpoints: builder => ({
    // Get user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => '/user/profile',
      providesTags: ['User']
    }),

    // Update user profile
    updateUserProfile: builder.mutation<
      UserProfile,
      Partial<{
        firstName: string
        lastName: string
        email: string
        phone: string
        profileImage: string
      }>
    >({
      query: body => ({
        url: '/user/profile',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['User']
    }),

    // Get saved properties (wishlist)
    getSavedProperties: builder.query<string[], void>({
      query: () => '/user/wishlist',
      providesTags: ['User']
    }),

    // Add to wishlist
    addToWishlist: builder.mutation<{ success: boolean }, string>({
      query: propertyId => ({
        url: '/user/wishlist',
        method: 'POST',
        body: { propertyId }
      }),
      invalidatesTags: ['User']
    }),

    // Remove from wishlist
    removeFromWishlist: builder.mutation<{ success: boolean }, string>({
      query: propertyId => ({
        url: `/user/wishlist/${propertyId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),

    // Update currency preference
    updateCurrency: builder.mutation<
      { success: boolean },
      {
        currency: string
        currencySymbol: string
      }
    >({
      query: body => ({
        url: '/user/preferences/currency',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['User']
    }),

    // Toggle notifications
    toggleNotifications: builder.mutation<{ success: boolean; enabled: boolean }, void>({
      query: () => ({
        url: '/user/preferences/notifications',
        method: 'PATCH'
      }),
      invalidatesTags: ['User']
    })
  })
})

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetSavedPropertiesQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useUpdateCurrencyMutation,
  useToggleNotificationsMutation
} = userApi
