// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Hotels',
    href: '/hotels',
    icon: 'tabler-hotel'
  },
  {
    label: 'Restaurants',
    href: '/restaurants',
    icon: 'tabler-building'
  },
  {
    label: 'Guides',
    href: '/guides',
    icon: 'tabler-list-check'
  },
  {
    label: 'Agences',
    href: '/agences',
    icon: 'tabler-users-group'
  },
  {
    label: 'Transport',
    href: '/transport',
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
