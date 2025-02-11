// Next Imports
import type { Metadata } from 'next'

// Component Imports
import CreateSite from '@/views/site/Create'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Create an Site',
  description: 'Site Page'
}

const CreateSitePage = () => {
  // Vars
  const mode = getServerMode()

  return <CreateSite mode={mode} />
}

export default CreateSitePage
