// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
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
    label: 'Operation',
    href: '/operation',
    icon: 'tabler-repeat'
  },
  {
    label: 'Site',
    href: '/site',
    icon: 'tabler-building'
  }
]

export default verticalMenuData
