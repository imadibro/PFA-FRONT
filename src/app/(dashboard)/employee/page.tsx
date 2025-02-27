// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Tabs from '@views/employee/Tabs'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

export const metadata: Metadata = {
  title: 'Liste des Employés',
  description: 'Employés Page'
}

const EmployeePage = () => {
  // Vars
  const mode = getServerMode()

  return <Tabs mode={mode} />
}

export default EmployeePage
