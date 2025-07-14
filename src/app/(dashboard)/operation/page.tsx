// Next Imports
import type { Metadata } from 'next'

// Component Imports

// Server Action Imports
// import { getServerMode } from '@core/utils/serverHelpers'
import OperationContainer from '@/views/operation/Operation.Container'

export const metadata: Metadata = {
  title: 'Liste des opérations',
  description: 'Operation Page'
}

const OperationPage = () => {
  // Vars
  // const mode = getServerMode()

  // return <OperationList mode={mode} />
  return <OperationContainer />
}

export default OperationPage
