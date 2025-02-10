// Next Imports
import type { Metadata } from 'next'

// Component Imports
import CreateOperation from '@/views/operation/Create'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Create an Operation',
  description: 'Operation Page'
}

const CreateOperationPage = () => {
  // Vars
  const mode = getServerMode()

  return <CreateOperation mode={mode} />
}

export default CreateOperationPage
