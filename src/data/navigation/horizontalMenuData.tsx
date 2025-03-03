// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Planification',
    href: '/planification',
    icon: 'tabler-smart-home'
  },
  {
    label: 'Vehicules',
    href: '/vehicules',
    icon: 'tabler-car'
  },
  {
    label: 'Carte',
    href: '/card',
    icon: 'tabler-credit-card-filled'
  },
  {
    label: 'Opérations',
    href: '/operation',
    icon: 'tabler-list-check'
  },
  {
    label: 'Sites',
    href: '/site',
    icon: 'tabler-building'
  },
  {
    label: 'Employés',
    href: '/employee',
    icon: 'tabler-users'
  }
]

export default horizontalMenuData
