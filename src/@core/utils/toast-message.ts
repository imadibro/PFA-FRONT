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
 VEHICUL  = 'Vehicule',
 VEHICUL_OWNER = 'Propriétaire du véhicule',
 VEHICUL_TYPE = 'Type du véhicule',
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


export const GENERAL_ERROR = 'Une erreur est survenue veuillez réessayer ultérieurement'
