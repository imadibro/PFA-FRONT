'use client'

import Box from '@mui/material/Box'

import BookingCheckoutModal from '@/components/global-horizon/BookingCheckoutModal'
import BookingToastNotification from '@/components/global-horizon/BookingToastNotification'
import BottomNav from '@/components/global-horizon/BottomNav'
import CategoryChips from '@/components/global-horizon/CategoryChips'
import FilterDrawer from '@/components/global-horizon/FilterDrawer'
import { GlobalHorizonProvider, useGlobalHorizon } from '@/components/global-horizon/GlobalHorizonContext'
import Navbar from '@/components/global-horizon/Navbar'
import PromoBanner from '@/components/global-horizon/PromoBanner'
import PropertyCard from '@/components/global-horizon/PropertyCard'
import PropertyDetailModal from '@/components/global-horizon/PropertyDetailModal'
import SearchBar from '@/components/global-horizon/SearchBar'
import TrendingDestinations from '@/components/global-horizon/TrendingDestinations'
import type { Currency } from '@/components/global-horizon/types'
import BookingsView from './BookingsView'
import MessagesView from './MessagesView'
import ProfileView from './ProfileView'

const GlobalHorizonContent = () => {
  const {
    activeTab,
    setActiveTab,
    filteredProperties,
    selectedProperty,
    setSelectedProperty,
    checkoutModalOpen,
    setCheckoutModalOpen,
    filters,
    setFilters,
    promoActive,
    userProfile,
    setUserProfile,
    setCurrency,
    totalUnread
  } = useGlobalHorizon()

  const handleSelectCurrency = (c: Currency) => {
    setCurrency(c)
    setUserProfile({ ...userProfile, currency: c })
  }

  const handleResetFilters = () => {
    setFilters({ maxPrice: 1200, minRating: null, categories: [], destination: '' })
  }

  const handleContactHost = (_propertyTitle: string) => {
    setActiveTab('messages')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f9fc', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        userProfile={userProfile}
        onOpenProfile={() => setActiveTab('profile')}
        onSelectCurrency={handleSelectCurrency}
      />

      {/* Main Content */}
      <Box
        component='main'
        sx={{
          pt: { xs: 8, sm: 10 },
          pb: { xs: 10, md: 4 },
          px: { xs: 2, sm: 4 },
          maxWidth: 1280,
          mx: 'auto',
          width: '100%',
          flex: 1
        }}
      >
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Search Bar */}
            <SearchBar />

            {/* Categories */}
            <CategoryChips />

            {/* Promo Banner */}
            {!promoActive && <PromoBanner />}

            {/* Trending Destinations */}
            <TrendingDestinations />

            {/* Properties Grid */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Box component='h3' sx={{ fontWeight: 800, fontSize: 18, color: '#191c1e', m: 0, mb: 0.5 }}>
                    {filters.destination ? `Stays in "${filters.destination}"` : 'Recommended for You'}
                  </Box>
                  <Box component='p' sx={{ fontSize: 12, color: '#747782', m: 0 }}>
                    {filteredProperties.length} hand-picked luxury options
                  </Box>
                </Box>
                {(filters.destination || filters.categories.length > 0) && (
                  <Box
                    component='button'
                    onClick={handleResetFilters}
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#002155',
                      bgcolor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Clear Filters
                  </Box>
                )}
              </Box>

              {filteredProperties.length === 0 ? (
                <Box sx={{ bgcolor: '#fff', p: 6, borderRadius: 3, border: '1px solid #e0e3e6', textAlign: 'center' }}>
                  <i className='tabler-travel-explore' style={{ fontSize: 48, color: '#747782' }} />
                  <Box component='h4' sx={{ fontWeight: 700, fontSize: 16, color: '#002155', mt: 2, mb: 1 }}>
                    No properties match your filter
                  </Box>
                  <Box component='p' sx={{ fontSize: 12, color: '#747782', mb: 3 }}>
                    Try adjusting your dates, budget slider, or destination keyword.
                  </Box>
                  <Box
                    component='button'
                    onClick={handleResetFilters}
                    sx={{
                      bgcolor: '#002155',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 700,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Reset Search
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    gap: 3
                  }}
                >
                  {filteredProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </Box>
              )}
            </Box>

            {/* Quote */}
            <Box
              sx={{
                py: 6,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                opacity: 0.6
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: '#e6e8eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <i className='tabler-travel-explore' style={{ fontSize: 32, color: '#002155' }} />
              </Box>
              <Box
                component='p'
                sx={{ fontSize: 14, fontWeight: 500, color: '#434651', fontStyle: 'italic', maxWidth: 500, m: 0 }}
              >
                "The world is a book and those who do not travel read only one page."
              </Box>
            </Box>
          </Box>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <BookingsView onContactHost={handleContactHost} onExploreMore={() => setActiveTab('home')} />
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && <MessagesView />}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <ProfileView
            onViewProperty={id => {
              const prop = filteredProperties.find(p => p.id === id)
              if (prop) {
                setSelectedProperty(prop)
                setActiveTab('home')
              }
            }}
            onRemoveFromWishlist={toggleWishlist}
          />
        )}
      </Box>

      {/* Property Detail Modal */}
      <PropertyDetailModal />

      {/* Checkout Modal */}
      {checkoutModalOpen && selectedProperty && <BookingCheckoutModal onClose={() => setCheckoutModalOpen(false)} />}

      {/* Filter Drawer */}
      <FilterDrawer />

      {/* Booking Toast */}
      <BookingToastNotification />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        unreadMessagesCount={totalUnread}
        upcomingBookingsCount={0}
      />
    </Box>
  )
}

const GlobalHorizonPage = () => {
  return (
    <GlobalHorizonProvider>
      <GlobalHorizonContent />
    </GlobalHorizonProvider>
  )
}

export default GlobalHorizonPage
