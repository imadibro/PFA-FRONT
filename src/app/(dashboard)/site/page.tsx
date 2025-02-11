// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Tabs from '@views/site/Tabs'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Site',
  description: 'Site Page'
}

const SitePage = () => {
  // Vars
  const mode = getServerMode()

  return <Tabs mode={mode} />
}

export default SitePage
