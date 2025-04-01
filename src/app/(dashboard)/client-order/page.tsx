// Next Imports
import type { Metadata } from 'next'

// Component Imports

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'
import Tabs from '@/views/clientOrder/Tabs'

export const metadata: Metadata = {
  title: 'Site',
  description: 'Site Page'
}

const ClientOrderPage = () => {
  // Vars
  const mode = getServerMode()

  return <Tabs mode={mode} />
}

export default ClientOrderPage
