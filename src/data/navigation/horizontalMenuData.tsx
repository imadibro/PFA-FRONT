// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Home',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'About',
    href: '/about',
    icon: 'tabler-info-circle'
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
