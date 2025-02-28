export interface ICommonProps {
  id: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy?: string
}

export interface ICard extends ICommonProps {
  matricule: string
  expireDate: string
  balance: number
}
export interface ICardRequest {
  id?: string
  matricule?: string
  expireDate?: string
  balance?: number
}

export interface ITableItems<T> {
  totalItems: number
  items: T
}

export interface IActionColumnsProps<T> {
  row?: T
  toggleEditMode: (t: T) => void
  deleteObject: (id: string) => void
}

export interface ICellType<T> {
  row: T
}
export interface ITask {
  id: string
  label: string
  description: string
  createdAt?: string
  updatedAt?: string
}

export interface IRequirement {
  id: string
  label: string
  description: string
  priority: string
  createdAt?: string
  updatedAt?: string
}

export interface IOperation {
  id: string
  label: string
  description: string
  tasks?: ITask[]
  createdAt?: string
  updatedAt?: string
}

export interface ISite {
  id: string
  label: string
  siteNbr: string
  description: string
  requirements?: IRequirement[]
  createdAt?: string
  updatedAt?: string
}

export interface IEmployee {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  role: IRole
  createdAt?: string
  updatedAt?: string
}

export interface IRole {
  id: string
  role: string
  employees?: IEmployee[]
  createdAt?: string
  updatedAt?: string
}

export type IAbsenceReasons = 'Malade' | 'Congie' | 'Autre'

export interface IAbsence {
  id: string
  employee: IEmployee
  absence: IAbsenceReasons
  autre?: string
  startDate: string
  endDate: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

interface IEmployee {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  password: string
  role: IRole
}

interface IRole {
  id: string
  role: string
  employees?: IEmployee[]
}

interface IAbsenceReasons {
  id: string
  label: string
  description: string
}

interface IAbsence {
  id: string
  employee: IEmployee
  absence: IAbsenceReasons
  startDate: string
  endDate: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}
