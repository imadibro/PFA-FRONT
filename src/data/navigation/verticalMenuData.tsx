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
    label: 'Operation',
    href: '/operation',
    icon: 'tabler-repeat',
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
  }
]

export default verticalMenuData
