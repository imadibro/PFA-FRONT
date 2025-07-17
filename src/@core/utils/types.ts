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

// export interface IOperation {
//   id: string
//   label: string
//   duration: number
//   durationMode: string
//   description: string
//   tasks?: ITask[]
//   createdAt?: string
//   updatedAt?: string
// }

export interface IOperationType extends ICommonProps {
  label: string
}

export interface IOperationZone extends ICommonProps {
  label: string
}

export interface IOperationTrans extends ICommonProps {
  label: string
}

export interface IOperationTask extends ICommonProps {
  operationType: IOperationType
  operationZone: IOperationZone
  operationTrans: IOperationTrans
  tasks: ITask[]
  operationTasksIds: string[]
}

export interface IOperationTaskRequest {
  operationType: string
  operationZone: string
  operationTrans: string
  operationTasksIds: string[]
}

export interface ISite {
  id: string
  label: string
  siteNbr: string
  description: string
  siteOwner: string
  siteType: string
  siteOwnerId: string
  siteTypeId: string
  requirements?: IRequirement[]
  createdAt?: string
  updatedAt?: string
}

export interface ISiteOwner {
  id: string
  name: string
  createdAt?: string
  updatedAt?: string
}

export interface ISiteType {
  id: string
  name: string
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
  name?: string
  isMember?: boolean
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
  cost: number
}
export interface IVehiculeTypeRequest {
  id?: string
  vehicule_type: string
  cost: number
}

export interface IVehicule extends ICommonProps {
  registrationId: string
  vehiculeOwner: IVehiculeOwnerRequest
  vehiculeType: IVehiculeTypeRequest
  vehiculeModel: IVehiculeModel
}

export interface IVehiculeRequest {
  id?: string
  registrationId: string
  vehiculeOwner: string
  vehiculeType: string
  vehiculeModel: string
}

export interface IClients {
  id: string
  projectCode: string
  refProject: string
  activityLabel: string
  clientAgencyLabel: string
  piloteFullName: string
}

export interface IActivity {
  id: string
  label: string
}

export interface IZoneActivity extends IActivity {}

export interface IClientAgency {
  id: string
  label: string
}

export interface IQuotation {
  id: string
  label: string
}
export interface IInvoice {
  id: string
  label: string
}
export interface ISupplierQuotation {
  id: string
  label: string
}

export interface IClient {
  id: string
  clientReference: string
  clientName: string
  clientAlias: string
  phone: string
  createdAt?: string
}

export interface IClientOrder {
  id: string
  orderReference: string
  label: string
  createdAt?: string
}
export interface IProject {
  id: string
  projectCode: string
  refProject: string
  activity: IActivity | null
  activityId: string
  zoneActivity: IZoneActivity | null
  zoneActivityId: string
  clientAgency: IClientAgency
  clientAgencyId: string
  pilote: any
  piloteId: string
  quotations?: IQuotation[] | null
  invoices?: IInvoice[] | null
  supplierQuotations?: ISupplierQuotation[] | null
  orders?: IClientOrder[] | null
  createdAt?: string
  updatedAt?: string
}

export interface IVehiculeBrand {
  id: string
  name: string
}

export interface IVehiculeModel {
  id: string
  name: string
}

export type IOrderStatus = 'Brouillon' | 'En attente' | 'Confirmé' | 'En cours' | 'Terminé' | 'Annulé'

export interface ITeamMember {
  id: string
  name: string
  role: string
}

export interface IOperation extends ICommonProps {
  // team: ITeamMember[]
  site: ISite
  operationTasks: IOperationTask
  project: IProject
  equipe: IEquipe
  comment?: string
}

export interface IOperationRequest {
  id?: string
  site: string
  operationTasks: string
  project: string
  equipe?: string | null
  comment?: string
}
export interface IEquipe extends ICommonProps {
  id: string
  name: string
  members: { id: string; name: string; role: string }[]
  fuelCard: ICardRequest | null
  highwayCard: ICardRequest | null
  vehicule: IVehiculeRequest | null
}

export interface IEquipeRequest {
  id?: string
  name: string
  members: { id: string; name: string; role: string }[]
  fuelCard: string | null
  highwayCard: string | null
  vehicule: string | null
  selectedEmployee?: string
  selectedRole?: string
}
