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
    label: 'Carte',
    href: '/card',
    icon: 'tabler-credit-card-filled'
  },
  {
    label: 'Global Horizon',
    href: '/global-horizon',
    icon: 'tabler-world'
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
  }
]

export default horizontalMenuData
