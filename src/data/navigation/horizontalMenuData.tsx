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
    icon: 'tabler-list-check',
    children: [
      {
        label: 'Operation List',
        href: '/operation',
        icon: 'tabler-list'
      },
      {
        label: 'Create Operation',
        href: '/operation/create',
        icon: 'tabler-plus'
      }
    ]
  },
  {
    label: 'Site',
    href: '/site',
    icon: 'tabler-building',
    children: [
      {
        label: 'Site List',
        href: '/site',
        icon: 'tabler-list'
      },
      {
        label: 'Create site',
        href: '/site/create',
        icon: 'tabler-plus'
      }
    ]
  }
]

export default horizontalMenuData
