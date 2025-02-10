// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Operation from '@views/operation/List'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Operation',
  description: 'Operation Page'
}

const OperationPage = () => {
  // Vars
  const mode = getServerMode()

  return <Operation mode={mode} />
}

export default OperationPage
