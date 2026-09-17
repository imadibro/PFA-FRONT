import type { Property, MessageThread, Category, UserProfile } from './types'

export const CATEGORIES: Category[] = [
  { label: 'All Stays', value: 'ALL', icon: 'tabler-layout-grid' },
  { label: 'Hotels', value: 'HOTEL', icon: 'tabler-building' },
  { label: 'Restaurants', value: 'RESTAURANT', icon: 'tabler-tools-kitchen-2' },
  { label: 'Guides', value: 'GUIDE', icon: 'tabler-compass' },
  { label: 'Agencies', value: 'AGENCY', icon: 'tabler-users-group' },
  { label: 'Transport', value: 'TRANSPORT', icon: 'tabler-bus' },
  { label: 'Vehicles', value: 'VEHICLE', icon: 'tabler-car' }
]

export const DESTINATIONS = [
  {
    name: 'London',
    country: 'United Kingdom',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    stayCount: 84
  },
  {
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop',
    stayCount: 62
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    stayCount: 91
  },
  {
    name: 'Zermatt',
    country: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1581890289924-5a0fef62f0b2?w=400&h=300&fit=crop',
    stayCount: 45
  },
  {
    name: 'Ubud',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop',
    stayCount: 73
  },
  {
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    stayCount: 120
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop',
    stayCount: 58
  },
  {
    name: 'Marrakech',
    country: 'Morocco',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&h=300&fit=crop',
    stayCount: 67
  }
]

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-001',
    title: 'The Langham London',
    type: 'HOTEL',
    location: 'Marylebone, London',
    city: 'London',
    country: 'United Kingdom',
    pricePerNight: 420,
    originalPricePerNight: 520,
    rating: 9.2,
    ratingText: 'Exceptional',
    reviewsCount: 1847,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'
    ],
    description:
      'A grand European hotel offering timeless luxury in the heart of London with Michelin-starred dining and a world-class spa.',
    amenities: [
      'Free Wi-Fi',
      'Spa & Wellness',
      'Pool',
      'Restaurant',
      'Room Service',
      'Concierge',
      'Fitness Center',
      'Valet Parking'
    ],
    hostName: 'James Thornton',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r1',
        authorName: 'Sophie Laurent',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Paris, France',
        rating: 5,
        date: '2024-11-15',
        stayDuration: '4 nights',
        comment:
          'Absolutely magnificent. The service was impeccable and the room had a stunning view of Portland Place.',
        helpfulCount: 24
      },
      {
        id: 'r2',
        authorName: 'Kenji Yamamoto',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Tokyo, Japan',
        rating: 4.5,
        date: '2024-10-28',
        stayDuration: '6 nights',
        comment: 'Outstanding hospitality. The afternoon tea was a highlight. Will definitely return.',
        helpfulCount: 18
      }
    ]
  },
  {
    id: 'prop-002',
    title: 'Mystique Santorini Resort',
    type: 'HOTEL',
    location: 'Oia, Santorini',
    city: 'Santorini',
    country: 'Greece',
    pricePerNight: 680,
    originalPricePerNight: 850,
    rating: 9.5,
    ratingText: 'Exceptional',
    reviewsCount: 923,
    images: [
      'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&h=600&fit=crop'
    ],
    description:
      'Perched on the cliffs of Oia, this exclusive resort offers breathtaking caldera views, infinity pools, and cave-style suites.',
    amenities: [
      'Infinity Pool',
      'Caldera View',
      'Spa',
      'Fine Dining',
      'Private Terrace',
      'Airport Transfer',
      'Butler Service'
    ],
    hostName: 'Elena Papadopoulos',
    hostAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r3',
        authorName: 'Marco Rossi',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Milan, Italy',
        rating: 5,
        date: '2024-09-20',
        stayDuration: '5 nights',
        comment: 'The most romantic place I have ever stayed. The sunset from our suite was unforgettable.',
        helpfulCount: 31
      }
    ]
  },
  {
    id: 'prop-003',
    title: 'Aman Tokyo',
    type: 'HOTEL',
    location: 'Otemachi, Tokyo',
    city: 'Tokyo',
    country: 'Japan',
    pricePerNight: 950,
    originalPricePerNight: 1100,
    rating: 9.7,
    ratingText: 'Exceptional',
    reviewsCount: 612,
    images: [
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&h=600&fit=crop'
    ],
    description:
      'Urban sanctuary blending traditional Japanese aesthetics with modern luxury. Panoramic city views and serene spa experiences.',
    amenities: [
      'Japanese Spa',
      'Rooftop Garden',
      'Fine Dining',
      'Yoga Studio',
      'Library',
      'Business Center',
      'Limousine Service'
    ],
    hostName: 'Takeshi Nakamura',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r4',
        authorName: 'Anna Schmidt',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Berlin, Germany',
        rating: 5,
        date: '2024-12-01',
        stayDuration: '3 nights',
        comment: 'Pure perfection. The attention to detail in every aspect of the stay was remarkable.',
        helpfulCount: 42
      }
    ]
  },
  {
    id: 'prop-004',
    title: 'Le Comptoir du Panthéon',
    type: 'RESTAURANT',
    location: 'Latin Quarter, Paris',
    city: 'Paris',
    country: 'France',
    pricePerNight: 85,
    originalPricePerNight: 110,
    rating: 8.9,
    ratingText: 'Excellent',
    reviewsCount: 2340,
    images: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop'
    ],
    description:
      'An iconic Parisian bistro offering classic French cuisine with a modern twist, nestled beside the Panthéon.',
    amenities: ['Terrace Dining', 'Wine Cellar', 'Private Room', 'Tasting Menu', 'Vegetarian Options', 'Live Music'],
    hostName: 'Pierre Dubois',
    hostAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r5',
        authorName: 'Emily Watson',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'London, UK',
        rating: 4.5,
        date: '2024-11-05',
        stayDuration: 'Dinner',
        comment: 'Wonderful ambiance and the duck confit was absolutely divine. A must-visit in Paris.',
        helpfulCount: 15
      }
    ]
  },
  {
    id: 'prop-005',
    title: 'Kyoto Heritage Walking Tour',
    type: 'GUIDE',
    location: 'Higashiyama, Kyoto',
    city: 'Kyoto',
    country: 'Japan',
    pricePerNight: 120,
    originalPricePerNight: 150,
    rating: 9.1,
    ratingText: 'Exceptional',
    reviewsCount: 567,
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop'
    ],
    description:
      'Immersive guided tour through ancient temples, bamboo groves, and traditional tea houses with a certified cultural expert.',
    amenities: ['Expert Guide', 'Tea Ceremony', 'Temple Access', 'Photo Opportunities', 'Small Groups', 'Multilingual'],
    hostName: 'Yuki Tanaka',
    hostAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r6',
        authorName: 'Carlos Mendez',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Madrid, Spain',
        rating: 5,
        date: '2024-10-12',
        stayDuration: 'Full Day',
        comment: 'Yuki is an incredible guide. Her knowledge of Kyoto history made the tour unforgettable.',
        helpfulCount: 29
      }
    ]
  },
  {
    id: 'prop-006',
    title: 'Atlas Voyages Morocco',
    type: 'AGENCY',
    location: 'Medina, Marrakech',
    city: 'Marrakech',
    country: 'Morocco',
    pricePerNight: 200,
    originalPricePerNight: 260,
    rating: 8.7,
    ratingText: 'Excellent',
    reviewsCount: 445,
    images: [
      'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548018560-c7196a4aac81?w=800&h=600&fit=crop'
    ],
    description:
      'Full-service travel agency specializing in curated Moroccan adventures — from desert safaris to coastal retreats.',
    amenities: [
      'Custom Itineraries',
      '24/7 Support',
      'Airport Pickup',
      'Local Guides',
      'Luxury Camps',
      'Cultural Experiences'
    ],
    hostName: 'Hassan El Mansouri',
    hostAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r7',
        authorName: 'Lisa Thompson',
        authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'New York, USA',
        rating: 4.5,
        date: '2024-09-30',
        stayDuration: '7 nights',
        comment: 'Hassan arranged an incredible trip for our family. The desert camp under the stars was magical.',
        helpfulCount: 22
      }
    ]
  },
  {
    id: 'prop-007',
    title: 'Swiss Alpine Express',
    type: 'TRANSPORT',
    location: 'Zermatt Station',
    city: 'Zermatt',
    country: 'Switzerland',
    pricePerNight: 310,
    originalPricePerNight: 380,
    rating: 9.0,
    ratingText: 'Excellent',
    reviewsCount: 892,
    images: [
      'https://images.unsplash.com/photo-1581890289924-5a0fef62f0b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop'
    ],
    description:
      'Luxury panoramic train journey through the Swiss Alps with first-class carriages, gourmet dining, and Matterhorn views.',
    amenities: ['First Class', 'Panoramic Windows', 'Gourmet Dining', 'Observation Car', 'Wi-Fi', 'Luggage Service'],
    hostName: 'Hans Mueller',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r8',
        authorName: 'Olivia Chen',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Singapore',
        rating: 5,
        date: '2024-12-10',
        stayDuration: 'Day Trip',
        comment:
          'A once-in-a-lifetime experience. The views of the Matterhorn from the observation car were breathtaking.',
        helpfulCount: 35
      }
    ]
  },
  {
    id: 'prop-008',
    title: 'Bali Luxury Villa Retreat',
    type: 'VEHICLE',
    location: 'Tegallalang, Ubud',
    city: 'Ubud',
    country: 'Indonesia',
    pricePerNight: 185,
    originalPricePerNight: 240,
    rating: 8.8,
    ratingText: 'Excellent',
    reviewsCount: 734,
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop'
    ],
    description:
      'Private villa with chauffeur-driven luxury vehicle package through Bali rice terraces, temples, and hidden waterfalls.',
    amenities: [
      'Private Driver',
      'Luxury SUV',
      'Flexible Itinerary',
      'Hotel Pickup',
      'Water & Snacks',
      'Photography Stops'
    ],
    hostName: 'Made Suryana',
    hostAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r9',
        authorName: 'David Park',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Seoul, Korea',
        rating: 4.5,
        date: '2024-11-22',
        stayDuration: '2 days',
        comment: 'Made was an amazing driver and guide. He knew all the best spots away from the tourist crowds.',
        helpfulCount: 19
      }
    ]
  },
  {
    id: 'prop-009',
    title: 'The Ritz London',
    type: 'HOTEL',
    location: 'Piccadilly, London',
    city: 'London',
    country: 'United Kingdom',
    pricePerNight: 580,
    originalPricePerNight: 720,
    rating: 9.4,
    ratingText: 'Exceptional',
    reviewsCount: 2105,
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop'
    ],
    description:
      'Iconic luxury hotel with Louis XVI decor, legendary afternoon tea, and unparalleled service in the heart of London.',
    amenities: [
      'Afternoon Tea',
      'Spa',
      'Fine Dining',
      'Concierge',
      'Fitness Center',
      'Room Service',
      'Valet Parking',
      'Bar'
    ],
    hostName: 'Charlotte Windsor',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r10',
        authorName: 'Mohammed Al-Rashid',
        authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Dubai, UAE',
        rating: 5,
        date: '2024-12-15',
        stayDuration: '5 nights',
        comment: 'Nothing compares to The Ritz. Pure elegance and world-class service from check-in to check-out.',
        helpfulCount: 38
      }
    ]
  },
  {
    id: 'prop-010',
    title: 'Nobu Restaurant Santorini',
    type: 'RESTAURANT',
    location: 'Imerovigli, Santorini',
    city: 'Santorini',
    country: 'Greece',
    pricePerNight: 95,
    originalPricePerNight: 120,
    rating: 9.0,
    ratingText: 'Excellent',
    reviewsCount: 1456,
    images: [
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop'
    ],
    description:
      'Japanese-Peruvian fusion dining with panoramic caldera sunset views. An unforgettable culinary experience.',
    amenities: [
      'Sunset Terrace',
      'Cocktail Bar',
      'Omakase Menu',
      'Wine Pairing',
      'Private Dining',
      'Reservations Required'
    ],
    hostName: 'Nikos Andreadis',
    hostAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r11',
        authorName: 'Isabelle Fontaine',
        authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Lyon, France',
        rating: 5,
        date: '2024-08-18',
        stayDuration: 'Dinner',
        comment: 'The black cod miso was extraordinary. Dining as the sun set over the caldera was pure magic.',
        helpfulCount: 27
      }
    ]
  },
  {
    id: 'prop-011',
    title: 'London Heritage Private Tour',
    type: 'GUIDE',
    location: 'Westminster, London',
    city: 'London',
    country: 'United Kingdom',
    pricePerNight: 75,
    originalPricePerNight: 95,
    rating: 8.6,
    ratingText: 'Excellent',
    reviewsCount: 389,
    images: [
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1529180184525-78f99adb8e98?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=800&h=600&fit=crop'
    ],
    description:
      'Private walking tour covering Buckingham Palace, Westminster Abbey, Big Ben, and hidden historical gems with an expert historian.',
    amenities: [
      'Private Guide',
      'Skip-the-Line',
      'Insider Access',
      'Flexible Schedule',
      'Photography Tips',
      'Refreshments Included'
    ],
    hostName: 'Richard Blackwell',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r12',
        authorName: 'Sarah Kim',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Seoul, Korea',
        rating: 4.5,
        date: '2024-11-08',
        stayDuration: 'Half Day',
        comment:
          'Richard brought London history alive. His passion and knowledge made this the best tour we have ever taken.',
        helpfulCount: 16
      }
    ]
  },
  {
    id: 'prop-012',
    title: 'Sahara Desert Expedition',
    type: 'AGENCY',
    location: 'Merzouga, Morocco',
    city: 'Marrakech',
    country: 'Morocco',
    pricePerNight: 340,
    originalPricePerNight: 420,
    rating: 9.3,
    ratingText: 'Exceptional',
    reviewsCount: 278,
    images: [
      'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1548018560-c7196a4aac81?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&h=600&fit=crop'
    ],
    description:
      'Multi-day luxury desert expedition with camel trekking, star-gazing camps, and traditional Berber cultural immersion.',
    amenities: [
      'Luxury Camp',
      'Camel Trek',
      'Star Gazing',
      'Berber Dinner',
      '4x4 Transfer',
      'Photography Guide',
      'All Inclusive'
    ],
    hostName: 'Youssef Benali',
    hostAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face',
    guestReviews: [
      {
        id: 'r13',
        authorName: 'Alexandra Müller',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face',
        authorLocation: 'Vienna, Austria',
        rating: 5,
        date: '2024-10-05',
        stayDuration: '3 nights',
        comment:
          'An absolutely life-changing experience. Sleeping under the Sahara stars in a luxury camp was surreal.',
        helpfulCount: 44
      }
    ]
  }
]

export const MOCK_THREADS: MessageThread[] = [
  {
    id: 'thread-001',
    hostName: 'James Thornton',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    propertyTitle: 'The Langham London',
    lastMessage: 'Your room has been upgraded to a suite!',
    lastMessageTime: '2 min ago',
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'host-001',
        senderName: 'James Thornton',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        text: 'Welcome to The Langham! We are delighted to have you as our guest.',
        timestamp: '10:30 AM',
        isUser: false
      },
      {
        id: 'm2',
        senderId: 'user',
        senderName: 'You',
        senderAvatar: '',
        text: 'Thank you! I am very excited about my stay.',
        timestamp: '10:32 AM',
        isUser: true
      },
      {
        id: 'm3',
        senderId: 'host-001',
        senderName: 'James Thornton',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
        text: 'Your room has been upgraded to a suite!',
        timestamp: '10:35 AM',
        isUser: false
      }
    ]
  },
  {
    id: 'thread-002',
    hostName: 'Elena Papadopoulos',
    hostAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    propertyTitle: 'Mystique Santorini Resort',
    lastMessage: 'The sunset dinner is confirmed for 7 PM.',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm4',
        senderId: 'host-002',
        senderName: 'Elena Papadopoulos',
        senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        text: 'Kalimera! We look forward to welcoming you to Santorini.',
        timestamp: '9:00 AM',
        isUser: false
      },
      {
        id: 'm5',
        senderId: 'user',
        senderName: 'You',
        senderAvatar: '',
        text: 'Can I book a sunset dinner?',
        timestamp: '9:15 AM',
        isUser: true
      },
      {
        id: 'm6',
        senderId: 'host-002',
        senderName: 'Elena Papadopoulos',
        senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
        text: 'The sunset dinner is confirmed for 7 PM.',
        timestamp: '9:20 AM',
        isUser: false
      }
    ]
  },
  {
    id: 'thread-003',
    hostName: 'Concierge Bot',
    hostAvatar: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=100&h=100&fit=crop&crop=face',
    propertyTitle: 'Global Horizon Support',
    lastMessage: 'How can I help you today?',
    lastMessageTime: '5 min ago',
    unreadCount: 1,
    messages: [
      {
        id: 'm7',
        senderId: 'bot',
        senderName: 'Concierge Bot',
        senderAvatar: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=50&h=50&fit=crop&crop=face',
        text: 'Hello! Welcome to Global Horizon concierge service. How can I help you today?',
        timestamp: '11:00 AM',
        isUser: false
      }
    ]
  }
]

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alexander Sterling',
  email: 'alexander@globalhorizon.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  membershipTier: 'Gold Explorer',
  points: 1240,
  currency: 'GBP',
  pushNotifications: true
}

export const QUICK_FAQ_CHIPS = [
  'Request late check-in',
  'Is breakfast included?',
  'Airport Shuttle Info',
  'Wi-Fi Password'
]

export const BOT_RESPONSES: Record<string, string> = {
  'Request late check-in':
    'Of course! Late check-in is available until 11 PM at no extra charge. Please let us know your estimated arrival time and we will arrange everything for you.',
  'Is breakfast included?':
    'Yes! A complimentary gourmet breakfast buffet is served daily from 7:00 AM to 10:30 AM in the main dining hall. Room service breakfast is also available at a small surcharge.',
  'Airport Shuttle Info':
    'We offer a complimentary airport shuttle service. Pickups are scheduled every 30 minutes from 6 AM to midnight. Please share your flight details and we will have a driver waiting for you.',
  'Wi-Fi Password':
    'The Wi-Fi network is "GH-Premium" and the password is "Horizon2024". You will also find this information on the welcome card in your room. Enjoy high-speed connectivity throughout the property!'
}
