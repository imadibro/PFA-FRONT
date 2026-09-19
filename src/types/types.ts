export type PropertyType = 'HOTEL' | 'AGENCY' | 'RESORT' | 'VILLA' | 'GUIDE' | 'DINING'

export type RatingText = 'Exceptional' | 'Superb' | 'Excellent' | 'Very Good' | 'Good'

export interface GuestReview {
  id: string
  authorName: string
  authorAvatar?: string
  authorLocation?: string
  rating: number // 1 to 5 scale
  date: string
  comment: string
  stayDuration?: string
  helpfulCount?: number
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
  currency: string
  rating: number
  ratingText: RatingText
  reviewsCount: number
  images: string[]
  description: string
  amenities: string[]
  hostName: string
  hostAvatar?: string
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
  description: string
}

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
  guests: string
  totalAmount: number
  currency: string
  status: 'CONFIRMED' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'
  bookingCode: string
  bookedAt: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'host' | 'concierge'
  text: string
  timestamp: string
}

export interface MessageThread {
  id: string
  contactName: string
  contactRole: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  propertyTitle?: string
  messages: ChatMessage[]
}

export interface Category {
  id: string
  name: string
  icon: string // Material symbol icon name
  filterType: PropertyType | 'ALL'
  count: number
}

export interface FilterState {
  searchQuery: string
  checkIn: string
  checkOut: string
  guestsAdults: number
  guestsRooms: number
  category: PropertyType | 'ALL'
  destinationFilter?: string
  minRating: number
  maxPrice: number
  propertyType: PropertyType | 'ALL'
}

export interface UserProfile {
  name: string
  email: string
  avatar: string
  currency: string
  currencySymbol: string
  membershipTier: 'Gold Explorer' | 'Platinum Traveler' | 'Diamond Member'
  savedPropertyIds: string[]
  notificationsEnabled: boolean
}
