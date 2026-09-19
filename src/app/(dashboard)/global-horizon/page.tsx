import type { Metadata } from 'next'
import GlobalHorizonPage from '@/views/global-horizon/GlobalHorizonPage'

export const metadata: Metadata = {
  title: 'Global Horizon - Luxury Travel Booking',
  description: 'Discover and book luxury hotels, restaurants, guides, and more'
}

const Page = () => {
  return <GlobalHorizonPage />
}

export default Page
