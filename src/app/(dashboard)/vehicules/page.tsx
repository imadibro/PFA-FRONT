// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Tabs from '@views/vehicule/Tabs'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Vehicules',
  description: 'Page des vehicules'
}

const SitePage = () => {
  // Vars
  const mode = getServerMode()

  return <Tabs mode={mode} />
}

export default SitePage