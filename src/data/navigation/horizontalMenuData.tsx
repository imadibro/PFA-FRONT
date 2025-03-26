// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Planification',
    href: '/planification',
    icon: 'tabler-calendar-month'
  },
  {
    label: 'Sites',
    href: '/site',
    icon: 'tabler-building'
  },
  {
    label: 'Opérations',
    href: '/operation',
    icon: 'tabler-list-check'
  },
  {
    label: 'Employés',
    href: '/employee',
    icon: 'tabler-users'
  },
  {
    label: 'Clients',
    href: '/client',
    icon: 'tabler-users'
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
  }
]

export default horizontalMenuData
