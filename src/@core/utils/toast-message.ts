export const enum TOAST_ACTIONS {
  ADD,
  EDIT,
  DELETE,
  INFO,
  ERROR,
  PAYMENT
}

export const enum TOAST_COMPONENTS {
  CARD = 'Carte',
  VEHICUL = 'Vehicule',
  VEHICUL_OWNER = 'Propriétaire du véhicule',
  VEHICUL_TYPE = 'Type du véhicule',
  EQUIPE = 'Equipe',
  OPERATION = 'Opérations',
  EMPLOYEE = 'Employé',
  TASK = 'Tâche'
}

export const toastMessageSuccess = (component: string, action: TOAST_ACTIONS) => {
  switch (action) {
    case TOAST_ACTIONS.ADD:
      return `${component} Ajoutee Avec success`
    case TOAST_ACTIONS.EDIT:
      return `${component} Modifiee Avec success`
    case TOAST_ACTIONS.DELETE:
      return `${component} Supprimee Avec success`
    case TOAST_ACTIONS.ERROR:
      return `Echec ! Action n'a pas pu être effectuée sur ${component}`
    case TOAST_ACTIONS.PAYMENT:
      return `Date de reglement modifiee Avec success`
    default:
      return ''
  }
}

export const toastMessageError = (component: string, code: number) => {
  switch (code) {
    case 403:
      return "Vous n'êtes pas autorisé à effectuer cette action"
    case 204:
      return `${component} error`
    default:
      return ''
  }
}

export const DEPOT_CONSTRAINT_ERROR = 'Suppression échec : Depot ne peut pas être supprimé'
export const DRIVER_CONSTRAINT_ERROR = 'Suppression échec : Driver  ne peut pas être supprimé'
export const BADGE_CONSTRAINT_ERROR = 'Suppression échec : Badge  ne peut pas être supprimé'
export const CAR_CONSTRAINT_ERROR = 'Suppression échec : Vehicul ne peut pas être supprimé'
export const EMPLOYEE_CONSTRAINT_ERROR = 'Suppression échec : employé ne peut pas être supprimé'
export const CARD_CONSTRAINT_ERROR = 'Suppression échec : carte ne peut pas être supprimé'
export const ABSENCE_CONSTRAINT_ERROR = 'Suppression échec : absence ne peut pas être supprimé'
export const EQUIPE_CONSTRAINT_ERROR = 'Suppression échec : equipe ne peut pas être supprimé'
export const Task_CONSTRAINT_ERROR = 'Suppression échec : tâche ne peut pas être supprimé'

export const GENERAL_ERROR = 'Une erreur est survenue veuillez réessayer ultérieurement'
