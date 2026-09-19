// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
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
    label: 'Global Horizon',
    href: '/global-horizon',
    icon: 'tabler-world'
  }
]

export default verticalMenuData
