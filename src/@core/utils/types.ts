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
  id?:string
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