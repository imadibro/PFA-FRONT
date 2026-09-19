export type PropertyType =
  | 'HOTEL'
  | 'AGENCY'
  | 'RESORT'
  | 'VILLA'
  | 'GUIDE'
  | 'DINING'
  | 'RESTAURANT'
  | 'TRANSPORT'
  | 'VEHICLE'

export type Currency = 'GBP' | 'USD' | 'EUR'

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  GBP: '£',
  USD: '$',
  EUR: '€'
}

export const CURRENCY_RATES: Record<Currency, number> = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17
}

export interface GuestReview {
  id: string
  authorName: string
  authorAvatar: string
  authorLocation: string
  rating: number
  date: string
  stayDuration: string
  comment: string
  helpfulCount: number
}

export interface Property {
  id: string
  title: string
  type: PropertyType
  location: string
  city: string
  country: string
  pricePerNight: number
  originalPricePerNight?: number
  currency?: string
  rating: number
  ratingText: string
  reviewsCount: number
  images: string[]
  description: string
  amenities: string[]
  hostName: string
  hostAvatar: string
  badge?: string
  featured?: boolean
  trending?: boolean
  coordinates?: { lat: number; lng: number }
  guestReviews?: GuestReview[]
}

export interface Destination {
  id: string
  name: string
  country: string
  imageUrl: string
  propertiesCount: number
  stayCount: number
  description: string
}

export type BookingStatus = 'CONFIRMED' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'

export interface Booking {
  id: string
  propertyId: string
  propertyTitle: string
  propertyImage: string
  location: string
  type: PropertyType
  checkIn: string
  checkOut: string
  nights: number
  guests: number
  totalAmount: number
  currency: Currency
  status: BookingStatus
  bookingCode: string
  bookedAt: string
}

export interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  text: string
  timestamp: string
  isUser: boolean
}

export interface Message {
  id: string
  sender: 'user' | 'host'
  text: string
  timestamp: string
}

export interface MessageThread {
  id: string
  hostName: string
  hostAvatar: string
  propertyTitle: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: ChatMessage[]
}

export interface FilterState {
  maxPrice: number
  minRating: number | null
  categories: PropertyType[]
  destination: string
}

export type Category = {
  label: string
  value: PropertyType | 'ALL'
  icon: string
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  membershipTier: string
  points: number
  currency: Currency
  pushNotifications: boolean
}

export type ActiveTab = 'home' | 'bookings' | 'messages' | 'profile'
