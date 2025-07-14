// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Tabs from '@views/vehicule/Tabs'

export const metadata: Metadata = {
  title: 'Vehicules',
  description: 'Page des vehicules'
}

const SitePage = () => {
  return <Tabs />
}

export default SitePage
