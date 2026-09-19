'use client'

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

import { DEFAULT_USER_PROFILE, INITIAL_MESSAGES, MOCK_PROPERTIES } from './mockData'
import type {
  ActiveTab,
  Booking,
  BookingStatus,
  ChatMessage,
  Currency,
  FilterState,
  MessageThread,
  Property,
  UserProfile
} from './types'
import { CURRENCY_RATES } from './types'

interface ToastData {
  visible: boolean
  propertyTitle: string
  propertyImage: string
  bookingCode: string
  checkIn: string
  checkOut: string
  totalAmount: number
  currency: Currency
}

interface GlobalHorizonContextType {
  // Navigation
  activeTab: ActiveTab
  setActiveTab: (tab: ActiveTab) => void

  // Currency
  currency: Currency
  setCurrency: (c: Currency) => void
  convertPrice: (gbpPrice: number) => number

  // Properties & Search
  properties: Property[]
  filteredProperties: Property[]
  searchDestination: string
  setSearchDestination: (d: string) => void
  selectedCategory: string
  setSelectedCategory: (c: string) => void
  dateRange: { start: string; end: string }
  setDateRange: (r: { start: string; end: string }) => void
  guests: { adults: number; rooms: number }
  setGuests: (g: { adults: number; rooms: number }) => void

  // Filters
  filters: FilterState
  setFilters: (f: FilterState) => void
  filterDrawerOpen: boolean
  setFilterDrawerOpen: (o: boolean) => void

  // Promo
  promoActive: boolean
  claimPromo: () => void

  // Wishlist
  wishlist: string[]
  toggleWishlist: (propertyId: string) => void

  // Property Detail
  selectedProperty: Property | null
  setSelectedProperty: (p: Property | null) => void
  detailModalOpen: boolean
  setDetailModalOpen: (o: boolean) => void

  // Booking
  bookings: Booking[]
  checkoutModalOpen: boolean
  setCheckoutModalOpen: (o: boolean) => void
  checkoutNights: number
  setCheckoutNights: (n: number) => void
  submitBooking: (guestInfo: { name: string; email: string; phone: string; paymentMethod: string }) => void
  cancelBooking: (bookingId: string) => void

  // Toast
  toastData: ToastData
  dismissToast: () => void

  // Messages
  threads: MessageThread[]
  activeThreadId: string | null
  setActiveThreadId: (id: string | null) => void
  sendMessage: (threadId: string, text: string) => void
  totalUnread: number

  // Profile
  userProfile: UserProfile
  setUserProfile: (p: UserProfile) => void

  // Reviews
  addReview: (propertyId: string, rating: number, comment: string) => void
}

const GlobalHorizonContext = createContext<GlobalHorizonContextType | null>(null)

export const useGlobalHorizon = () => {
  const ctx = useContext(GlobalHorizonContext)

  if (!ctx) throw new Error('useGlobalHorizon must be used within GlobalHorizonProvider')

  return ctx
}

export const GlobalHorizonProvider = ({ children }: { children: ReactNode }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')

  // Currency
  const [currency, setCurrency] = useState<Currency>('GBP')

  const convertPrice = useCallback(
    (gbpPrice: number) => {
      return Math.round(gbpPrice * CURRENCY_RATES[currency])
    },
    [currency]
  )

  // Properties
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES)
  const [searchDestination, setSearchDestination] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [dateRange, setDateRange] = useState({ start: 'Jun 12', end: 'Jun 18' })
  const [guests, setGuests] = useState({ adults: 2, rooms: 1 })

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    maxPrice: 1200,
    minRating: null,
    categories: [],
    destination: ''
  })
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Promo
  const [promoActive, setPromoActive] = useState(false)

  const claimPromo = useCallback(() => {
    setPromoActive(true)
  }, [])

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([])

  const toggleWishlist = useCallback((propertyId: string) => {
    setWishlist(prev => (prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]))
  }, [])

  // Property Detail
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)

  // Booking
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'bk-001',
      propertyId: 'prop-001',
      propertyTitle: 'The Langham London',
      propertyImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      location: 'Marylebone, London',
      type: 'HOTEL',
      checkIn: 'Jun 12, 2025',
      checkOut: 'Jun 16, 2025',
      nights: 4,
      guests: 2,
      totalAmount: 1848,
      currency: 'GBP',
      status: 'UPCOMING',
      bookingCode: 'GH-LDN-4421',
      bookedAt: '2024-12-01'
    },
    {
      id: 'bk-002',
      propertyId: 'prop-002',
      propertyTitle: 'Mystique Santorini Resort',
      propertyImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
      location: 'Oia, Santorini',
      type: 'HOTEL',
      checkIn: 'Sep 1, 2024',
      checkOut: 'Sep 5, 2024',
      nights: 4,
      guests: 2,
      totalAmount: 2992,
      currency: 'GBP',
      status: 'COMPLETED',
      bookingCode: 'GH-SAN-7823',
      bookedAt: '2024-07-15'
    }
  ])

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false)
  const [checkoutNights, setCheckoutNights] = useState(4)

  // Toast
  const [toastData, setToastData] = useState<ToastData>({
    visible: false,
    propertyTitle: '',
    propertyImage: '',
    bookingCode: '',
    checkIn: '',
    checkOut: '',
    totalAmount: 0,
    currency: 'GBP'
  })

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dismissToast = useCallback(() => {
    setToastData(prev => ({ ...prev, visible: false }))
  }, [])

  const submitBooking = useCallback(
    (_guestInfo: { name: string; email: string; phone: string; paymentMethod: string }) => {
      if (!selectedProperty) return

      const cityCode = selectedProperty.city.substring(0, 3).toUpperCase()
      const code = `GH-${cityCode}-${Math.floor(1000 + Math.random() * 9000)}`
      const rate = promoActive ? Math.round(selectedProperty.pricePerNight * 0.85) : selectedProperty.pricePerNight
      const subtotal = convertPrice(rate) * checkoutNights
      const serviceFee = Math.round(subtotal * 0.1)
      const total = subtotal + serviceFee

      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        propertyId: selectedProperty.id,
        propertyTitle: selectedProperty.title,
        propertyImage: selectedProperty.images[0],
        location: selectedProperty.location,
        type: selectedProperty.type,
        checkIn: dateRange.start + ', 2025',
        checkOut: dateRange.end + ', 2025',
        nights: checkoutNights,
        guests: guests.adults,
        totalAmount: total,
        currency,
        status: 'CONFIRMED',
        bookingCode: code,
        bookedAt: new Date().toISOString()
      }

      setBookings(prev => [newBooking, ...prev])
      setCheckoutModalOpen(false)
      setDetailModalOpen(false)
      setSelectedProperty(null)

      // Show toast
      setToastData({
        visible: true,
        propertyTitle: selectedProperty.title,
        propertyImage: selectedProperty.images[0],
        bookingCode: code,
        checkIn: dateRange.start + ', 2025',
        checkOut: dateRange.end + ', 2025',
        totalAmount: total,
        currency
      })

      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
      toastTimerRef.current = setTimeout(() => {
        setToastData(prev => ({ ...prev, visible: false }))
      }, 8000)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedProperty, promoActive, checkoutNights, convertPrice, dateRange, guests, currency]
  )

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status: 'CANCELLED' as BookingStatus } : b)))
  }, [])

  // Messages
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_MESSAGES)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)

  const totalUnread = threads.reduce((acc, t) => acc + t.unreadCount, 0)

  const sendMessage = useCallback((threadId: string, text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      senderName: 'You',
      senderAvatar: '',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    }

    setThreads(prev =>
      prev.map(t => {
        if (t.id !== threadId) return t

        return {
          ...t,
          lastMessage: text,
          lastMessageTime: 'Just now',
          messages: [...t.messages, userMsg]
        }
      })
    )

    // Auto-reply after 1 second
    setTimeout(() => {
      const replies = [
        'Thank you for your message! Let me check on that for you right away.',
        'Of course! I would be happy to help with your request. Give me just a moment.',
        'Great question! Let me look into that and get back to you shortly.',
        'Absolutely! I will arrange that for you. Is there anything else you need?',
        'I appreciate you reaching out. Your request has been noted and we will take care of it.'
      ]

      const botReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: 'bot',
        senderName: '',
        senderAvatar: '',
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: false
      }

      setThreads(prev =>
        prev.map(t => {
          if (t.id !== threadId) return t

          // Use the thread's host info for the bot reply
          botReply.senderName = t.hostName
          botReply.senderAvatar = t.hostAvatar

          return {
            ...t,
            lastMessage: botReply.text,
            lastMessageTime: 'Just now',
            messages: [...t.messages, botReply]
          }
        })
      )
    }, 1000)
  }, [])

  // Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE)

  // Reviews
  const addReview = useCallback((propertyId: string, rating: number, comment: string) => {
    setProperties(prev =>
      prev.map(p => {
        if (p.id !== propertyId) return p

        const newReview = {
          id: `rev-${Date.now()}`,
          authorName: 'You',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
          authorLocation: 'Your Location',
          rating,
          date: new Date().toISOString().split('T')[0],
          stayDuration: '4 nights',
          comment,
          helpfulCount: 0
        }

        return { ...p, guestReviews: [newReview, ...(p.guestReviews ?? [])] }
      })
    )
  }, [])

  // Filtered properties
  const filteredProperties = properties.filter(p => {
    // Category filter
    if (selectedCategory !== 'ALL' && p.type !== selectedCategory) return false

    // Search destination
    if (searchDestination) {
      const q = searchDestination.toLowerCase()
      const matchesDestination =
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q)

      if (!matchesDestination) return false
    }

    // Price filter
    const price = promoActive ? Math.round(p.pricePerNight * 0.85) : p.pricePerNight

    if (convertPrice(price) > convertPrice(filters.maxPrice)) return false

    // Rating filter
    if (filters.minRating && p.rating < filters.minRating) return false

    // Category filters from drawer
    if (filters.categories.length > 0 && !filters.categories.includes(p.type)) return false

    return true
  })

  const contextValue: GlobalHorizonContextType = {
    activeTab,
    setActiveTab,
    currency,
    setCurrency,
    convertPrice,
    properties,
    filteredProperties,
    searchDestination,
    setSearchDestination,
    selectedCategory,
    setSelectedCategory,
    dateRange,
    setDateRange,
    guests,
    setGuests,
    filters,
    setFilters,
    filterDrawerOpen,
    setFilterDrawerOpen,
    promoActive,
    claimPromo,
    wishlist,
    toggleWishlist,
    selectedProperty,
    setSelectedProperty,
    detailModalOpen,
    setDetailModalOpen,
    bookings,
    checkoutModalOpen,
    setCheckoutModalOpen,
    checkoutNights,
    setCheckoutNights,
    submitBooking,
    cancelBooking,
    toastData,
    dismissToast,
    threads,
    activeThreadId,
    setActiveThreadId,
    sendMessage,
    totalUnread,
    userProfile,
    setUserProfile,
    addReview
  }

  return <GlobalHorizonContext.Provider value={contextValue}>{children}</GlobalHorizonContext.Provider>
}
