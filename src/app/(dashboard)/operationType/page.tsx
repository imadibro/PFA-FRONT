// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Tabs from '@views/operationTasks/Tabs'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: "Liste des types d'opérations",
  description: 'Operation Page'
}

const OperationPage = () => {
  // Vars
  const mode = getServerMode()

  return <Tabs mode={mode} />
}

export default OperationPage
