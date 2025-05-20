// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: 'Planning',
    href: '/planning',
    icon: 'tabler-calendar-month'
  },
  {
    label: 'Opérations',
    href: '/operation',
    icon: 'tabler-checklist'
  },
  {
    label: 'Opération Type',
    href: '/operationType',
    icon: 'tabler-list-check'
  },
  {
    label: 'Sites',
    href: '/site',
    icon: 'tabler-building'
  },
  {
    label: 'Equipe',
    href: '/equipe',
    icon: 'tabler-users-group'
  },
  {
    label: 'Employés',
    href: '/employee',
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

export default verticalMenuData
