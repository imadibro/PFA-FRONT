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
    label: 'Operation',
    href: '/operation',
    icon: 'tabler-list-check'
  },
  {
    label: 'Site',
    href: '/site',
    icon: 'tabler-building'
  }
]

export default horizontalMenuData
