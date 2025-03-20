export interface ICommonProps {
  id: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy?: string
}

export interface IVehiculeOwner extends ICommonProps {
  name: string
}

export interface IVehiculeOwnerRequest {
  id?: string
  name: string
}
export interface ICard extends ICommonProps {
  matricule: string
  expireDate: string
  type: string
}
export interface ICardRequest {
  id?: string
  matricule: string
  expireDate: string
  type: string
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
  duration: number
  durationMode: string
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

export type IAbsenceReasons = 'Malade' | 'Congé' | 'Autre'

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

export interface IVehiculeType extends ICommonProps {
  vehicule_type: string
}
export interface IVehiculeTypeRequest {
  id?: string
  vehicule_type: string
}

export interface IVehicule extends ICommonProps {
  registrationId: string
  cost: number
  owner: IVehiculeOwnerRequest
  type: IVehiculeTypeRequest
}

export interface IVehiculeRequest {
  id?: string
  registrationId: string
  cost: number
  owner: string
  type: string
}
