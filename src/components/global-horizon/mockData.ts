import type { Booking, Category, Destination, MessageThread, Property } from './types'

export const MOCK_CATEGORIES: Category[] = [
  { label: 'Hotels', value: 'HOTEL', icon: 'tabler-building' },
  { label: 'Dining', value: 'DINING', icon: 'tabler-tools-kitchen-2' },
  { label: 'Guides', value: 'GUIDE', icon: 'tabler-map-pin' },
  { label: 'Agencies', value: 'AGENCY', icon: 'tabler-briefcase' },
  { label: 'Villas', value: 'VILLA', icon: 'tabler-home' },
  { label: 'Resorts', value: 'RESORT', icon: 'tabler-beach' }
]

export const DESTINATIONS: Destination[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAb8pIUe0gZJqveUVgAlhxISmF2CbIfd46Zrvnwz8UhHvyiNDpX7iZGhkCyuqAVl0TsVFP_TC2f3S0nZp7QhdQ438cPuPn7YShTmdrYEtOzUMk24U--iVlDasBFH1vo3xAC7hKGonv4g3Otyzg7-AjYA7QSKnf_byZNFbDrWJsgKHkWwQR77pk_hUlBWzYn49vSXuQGb9Xex0t6Okb5zBqGI2hftz5L0y04zUaJBVMX8r-Sych01hey',
    propertiesCount: 84,
    stayCount: 84,
    description: 'Electric neon lights, historic shrines, and world-class culinary adventures.'
  },
  {
    id: 'zermatt',
    name: 'Zermatt',
    country: 'Switzerland',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBSYI4fK6Ek-0SgCC2iT4U2dvAiYNfh1IGYsjrHjfKtw2up-c-8zPNApCAFc8X8tq-BwkmgHfxk14Nvsj4InHA2nB9C4oSORew-SLmcNBATz2bdoENBq4iPje93iMgzgmJaBz_nJj_yE7tVPh2GhPOMKRH_Qix1L1DqM1R1RZjXS83j0n4-enHEXe2mTQLh-ZIVvlnz4yzZ06oT5y0mNS-kTzTASYTbq8LGypQGzZTXee_UiRdF3CBL',
    propertiesCount: 36,
    stayCount: 36,
    description: 'Majestic Matterhorn views, ski-in alpine chalets, and crisp mountain mornings.'
  },
  {
    id: 'ubud',
    name: 'Ubud',
    country: 'Indonesia',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdIvgjJsoE25dziiRC8XzoJS1VwDhIvPfdZV6VDgvPGXBTWRdBTmbAY9YnbV3I_hDBHqrb9ekmyp3ZWt_spWviXpi3ktbWuQAGdx6XZrc6YUJY1OrZZbJnXaRq3Dmj7eqkSHvVUqGrzHw2UsnLqbqtBJ-89iM8aOhXFl48EU8u-8sajOWKd1QYFNsUrJqmeffwezp5f5Y6gE3QGPuINdBscbrjT3aoAAZ-uia0SyCw30U0Rqfv_eNh',
    propertiesCount: 62,
    stayCount: 62,
    description: 'Lush tropical rain forest, tiered infinity pools, and tranquil wellness sanctuaries.'
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    propertiesCount: 110,
    stayCount: 110,
    description: 'Historic architecture, royal parks, Michelin-starred gastronomy, and iconic culture.'
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    propertiesCount: 48,
    stayCount: 48,
    description: 'White-washed cliffside architecture, endless Aegean horizon, and golden sunset vistas.'
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    propertiesCount: 95,
    stayCount: 95,
    description: 'Timeless romance, haute couture shopping, and boulevard cafes along the Seine.'
  }
]

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Meridian Grand Resort',
    type: 'HOTEL',
    location: 'Central District, London',
    city: 'London',
    country: 'United Kingdom',
    pricePerNight: 195,
    originalPricePerNight: 240,
    currency: '£',
    rating: 8.9,
    ratingText: 'Excellent',
    reviewsCount: 428,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9S-gZ5VDi3cpFr4pQ_rQ9DxGVwT-rEj4WQDecHER3nmUoZNXqz2GXRKE7xF8sll4uT5lygbM153mVuU6_f_R1JO6I-nTWc60UMdFhKO-OSE1_GQGU75V_gD-jC5PpYFeSO4wMKkfMVHmz88k0_kTTzGDRa3zPQ5kdD6yD65w2oHlzxC0zlP5_6BoRcb39VYi53myOWJcptolkK3fNS8DoaQWiyEYYwGg070buxq6Umsx9xbMzPRKa',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    description:
      'Experience refined Scandinavian design nestled in the heart of London. Features floor-to-ceiling panoramic park views, bespoke oak furnishings, a state-of-the-art hydrotherapy spa, and an award-winning organic breakfast lounge.',
    amenities: [
      'Free High-Speed Wi-Fi',
      'Hydrotherapy Spa',
      '24/7 Room Service',
      'Fitness Center',
      'Cocktail Lounge',
      'Valet Parking'
    ],
    hostName: 'Claridge Management Group',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    featured: true,
    trending: true
  },
  {
    id: 'prop-2',
    title: 'Oia Cliffs Architecture Villa',
    type: 'AGENCY',
    location: 'Oia, Santorini',
    city: 'Santorini',
    country: 'Greece',
    pricePerNight: 420,
    currency: '£',
    rating: 9.4,
    ratingText: 'Superb',
    reviewsCount: 312,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9EO16pfCEl2I5qyZF8dmuIgmvRwEKynHz2NAh4ogpMzaReAt47oQ3ORYuyyhU13n8617sfpwKfF2PjYfUypJcMkH_uJuYcxyvvbG2RP6u7sMsJoplcMaGBa2Cu09jC1dgeEwrtMPvuUFvZLgT9ISnw2GO0SqlqjZtD2L1dBH039P0nP-6gn_3czc4peZknxLOd7Os5_6tyLh3nnP6FtdWaDdMvRZele0E_rIm667zxrTLez2h8TvI',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'
    ],
    description:
      'Perched dramatically on the volcanic cliffs of Oia, this modern architectural villa offers an private infinity edge pool overlooking the Aegean Caldera. Hand-crafted cave suites with organic linens and dedicated concierge service.',
    amenities: [
      'Private Infinity Pool',
      'Caldera Views',
      'Daily Gourmet Breakfast',
      'Airport Transfer',
      'Wine Tasting Cellar',
      'Housekeeping'
    ],
    hostName: 'Aegean Luxury Collection',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    featured: true,
    trending: true
  },
  {
    id: 'prop-3',
    title: 'Aman Kyoto Forest Sanctuary',
    type: 'RESORT',
    location: 'Takagamine, Kyoto',
    city: 'Kyoto',
    country: 'Japan',
    pricePerNight: 680,
    originalPricePerNight: 750,
    currency: '£',
    rating: 9.7,
    ratingText: 'Exceptional',
    reviewsCount: 189,
    images: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
    ],
    description:
      'Set within a secret garden near Kyoto Golden Pavilion. Surrounded by ancient moss covered stone pathways, natural hot spring onsens, and cedar forest groves.',
    amenities: [
      'Natural Hot Onsen',
      'Traditional Tea Ceremony',
      'Kaiseki Dining',
      'Private Forest Trails',
      'Zen Meditation Pavilion'
    ],
    hostName: 'Aman Hospitality',
    featured: true
  },
  {
    id: 'prop-4',
    title: 'Matterhorn Alpine Chalet & Spa',
    type: 'VILLA',
    location: 'Winkelmatten, Zermatt',
    city: 'Zermatt',
    country: 'Switzerland',
    pricePerNight: 310,
    originalPricePerNight: 380,
    currency: '£',
    rating: 9.2,
    ratingText: 'Superb',
    reviewsCount: 264,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBSYI4fK6Ek-0SgCC2iT4U2dvAiYNfh1IGYsjrHjfKtw2up-c-8zPNApCAFc8X8tq-BwkmgHfxk14Nvsj4InHA2nB9C4oSORew-SLmcNBATz2bdoENBq4iPje93iMgzgmJaBz_nJj_yE7tVPh2GhPOMKRH_Qix1L1DqM1R1RZjXS83j0n4-enHEXe2mTQLh-ZIVvlnz4yzZ06oT5y0mNS-kTzTASYTbq8LGypQGzZTXee_UiRdF3CBL',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    description:
      'Ski-in/ski-out luxury timber chalet offering unimpeded vistas of the Matterhorn peak. Features a outdoor heated Jacuzzi, log burning fireplace, and private ski locker room.',
    amenities: ['Matterhorn Views', 'Heated Outdoor Jacuzzi', 'Fireplace', 'Ski Room & Boot Warmers', 'Sauna'],
    hostName: 'Swiss Mountain Retreats',
    featured: false,
    trending: true
  },
  {
    id: 'prop-5',
    title: 'Tokyo Skytree Modern Penthouse',
    type: 'HOTEL',
    location: 'Minato District, Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    pricePerNight: 285,
    currency: '£',
    rating: 9.1,
    ratingText: 'Superb',
    reviewsCount: 540,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAb8pIUe0gZJqveUVgAlhxISmF2CbIfd46Zrvnwz8UhHvyiNDpX7iZGhkCyuqAVl0TsVFP_TC2f3S0nZp7QhdQ438cPuPn7YShTmdrYEtOzUMk24U--iVlDasBFH1vo3xAC7hKGonv4g3Otyzg7-AjYA7QSKnf_byZNFbDrWJsgKHkWwQR77pk_hUlBWzYn49vSXuQGb9Xex0t6Okb5zBqGI2hftz5L0y04zUaJBVMX8r-Sych01hey',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
    ],
    description:
      'Ultra-modern high rise penthouse in Tokyo city centre with floor-to-ceiling city line lights, smart home controls, and high speed express elevator.',
    amenities: ['Skyline Bar', 'Smart Automated Suite', '24/7 Gym', 'Subway Access', 'Concierge Service'],
    hostName: 'Tokyo Highline Hotels',
    trending: true
  },
  {
    id: 'prop-6',
    title: 'Ubud Maya River Valley Estate',
    type: 'RESORT',
    location: 'Sayayan Ridge, Ubud',
    city: 'Ubud',
    country: 'Indonesia',
    pricePerNight: 210,
    originalPricePerNight: 260,
    currency: '£',
    rating: 9.5,
    ratingText: 'Exceptional',
    reviewsCount: 390,
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDdIvgjJsoE25dziiRC8XzoJS1VwDhIvPfdZV6VDgvPGXBTWRdBTmbAY9YnbV3I_hDBHqrb9ekmyp3ZWt_spWviXpi3ktbWuQAGdx6XZrc6YUJY1OrZZbJnXaRq3Dmj7eqkSHvVUqGrzHw2UsnLqbqtBJ-89iM8aOhXFl48EU8u-8sajOWKd1QYFNsUrJqmeffwezp5f5Y6gE3QGPuINdBscbrjT3aoAAZ-uia0SyCw30U0Rqfv_eNh',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
    ],
    description:
      'Suspended above the Ayung river gorge in Bali. Floating breakfast in private bamboo plunge pools, daily yoga sessions, and traditional Ayurvedic spa treatments.',
    amenities: [
      'Infinity Jungle Pool',
      'Yoga Shala',
      'Organic Vegan Restaurant',
      'Floating Breakfast',
      'River Sound Spa'
    ],
    hostName: 'Maya Bali Hospitality',
    trending: true
  },
  {
    id: 'prop-7',
    title: 'Le Grand Colbert Gastronome & Suite',
    type: 'DINING',
    location: '2nd Arrondissement, Paris',
    city: 'Paris',
    country: 'France',
    pricePerNight: 160,
    currency: '£',
    rating: 9.0,
    ratingText: 'Excellent',
    reviewsCount: 205,
    images: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    ],
    description:
      'Iconic Parisian bistro dining experience combined with boutique historic rooms above the restaurant. Includes 3-course chef menu reservation during your stay.',
    amenities: ['Michelin Chef Tasting', 'Sommelier Wine Cellar', 'Classic Parisian Decor', 'Eiffel Tower Views'],
    hostName: 'Chef Henri & Co'
  },
  {
    id: 'prop-8',
    title: 'Private Tokyo Heritage & Street Food Expedition',
    type: 'GUIDE',
    location: 'Shibuya & Asakusa, Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    pricePerNight: 120,
    currency: '£',
    rating: 9.8,
    ratingText: 'Exceptional',
    reviewsCount: 178,
    images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'],
    description:
      'All-inclusive 6-hour private guided walk through Tokyo hidden alleys, Tsukiji food stalls, secret sake distilleries, and ancient shrine gardens with a licensed historian guide.',
    amenities: ['Private Local Guide', 'Food & Sake Tastings Included', 'Custom Itinerary', 'Hotel Pickup'],
    hostName: 'Kenji Takahashi (Master Guide)'
  }
]

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-2026-9812',
    propertyId: 'prop-1',
    propertyTitle: 'The Meridian Grand Resort',
    propertyImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9S-gZ5VDi3cpFr4pQ_rQ9DxGVwT-rEj4WQDecHER3nmUoZNXqz2GXRKE7xF8sll4uT5lygbM153mVuU6_f_R1JO6I-nTWc60UMdFhKO-OSE1_GQGU75V_gD-jC5PpYFeSO4wMKkfMVHmz88k0_kTTzGDRa3zPQ5kdD6yD65w2oHlzxC0zlP5_6BoRcb39VYi53myOWJcptolkK3fNS8DoaQWiyEYYwGg070buxq6Umsx9xbMzPRKa',
    location: 'Central District, London',
    type: 'HOTEL',
    checkIn: 'Jun 12, 2026',
    checkOut: 'Jun 18, 2026',
    nights: 6,
    guests: 2,
    totalAmount: 1170,
    currency: 'GBP',
    status: 'CONFIRMED',
    bookingCode: 'GH-LDN-8842',
    bookedAt: 'May 04, 2026'
  },
  {
    id: 'BK-2026-5510',
    propertyId: 'prop-2',
    propertyTitle: 'Oia Cliffs Architecture Villa',
    propertyImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9EO16pfCEl2I5qyZF8dmuIgmvRwEKynHz2NAh4ogpMzaReAt47oQ3ORYuyyhU13n8617sfpwKfF2PjYfUypJcMkH_uJuYcxyvvbG2RP6u7sMsJoplcMaGBa2Cu09jC1dgeEwrtMPvuUFvZLgT9ISnw2GO0SqlqjZtD2L1dBH039P0nP-6gn_3czc4peZknxLOd7Os5_6tyLh3nnP6FtdWaDdMvRZele0E_rIm667zxrTLez2h8TvI',
    location: 'Oia, Santorini',
    type: 'AGENCY',
    checkIn: 'Aug 10, 2026',
    checkOut: 'Aug 14, 2026',
    nights: 4,
    guests: 2,
    totalAmount: 1680,
    currency: 'GBP',
    status: 'UPCOMING',
    bookingCode: 'GH-SAN-9901',
    bookedAt: 'Jun 15, 2026'
  }
]

export const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: 'msg-1',
    hostName: 'The Meridian Concierge',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    propertyTitle: 'The Meridian Grand Resort',
    lastMessage: 'Good day! Your airport transfer is confirmed for 2:30 PM on June 12th.',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'user',
        senderName: 'You',
        senderAvatar: '',
        text: 'Hello! Could we request an early check-in around 1:00 PM if available?',
        timestamp: '10:15 AM',
        isUser: true
      },
      {
        id: 'm2',
        senderId: 'host-1',
        senderName: 'The Meridian Concierge',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'Hello! We have noted your request for 1:00 PM. We will prioritize your executive suite preparation.',
        timestamp: '10:30 AM',
        isUser: false
      },
      {
        id: 'm3',
        senderId: 'host-1',
        senderName: 'The Meridian Concierge',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: 'Good day! Your airport transfer is confirmed for 2:30 PM on June 12th.',
        timestamp: '10:42 AM',
        isUser: false
      }
    ]
  },
  {
    id: 'msg-2',
    hostName: 'Aegean Villa Manager',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    propertyTitle: 'Oia Cliffs Architecture Villa',
    lastMessage: 'Welcome to Santorini! Let us know if you need private catamaran reservations.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'm4',
        senderId: 'host-2',
        senderName: 'Aegean Villa Manager',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: 'Welcome to Santorini! Let us know if you need private catamaran reservations.',
        timestamp: 'Yesterday',
        isUser: false
      }
    ]
  }
]

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Morgan',
  email: 'alex.morgan@globalhorizon.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  membershipTier: 'Gold Explorer',
  points: 12450,
  currency: 'GBP',
  pushNotifications: true
}
