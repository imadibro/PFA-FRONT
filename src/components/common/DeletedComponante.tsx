import useSweetAlert from '@/@core/hooks/useSweetAlert'

export const useToastComponante = () => {
  const { showConfirm, showToast } = useSweetAlert()

  const confirmDelete = async (label: string): Promise<boolean> => {
    return await showConfirm('', `Êtes-vous sûr de vouloir supprimer ${label} ?`, 'Supprimer', 'Annuler')
  }

  const confirmUpdate = async (label: string): Promise<boolean> => {
    await showToast(`${label} a été mis à jour avec succès !`, 'success')
    return true
  }

  const confirmAdd = async (label: string): Promise<boolean> => {
    await showToast(`${label} créé avec succès!`, 'success')
    return true
  }
  const confirmSave = async (label: string): Promise<boolean> => {
    await showToast(`${label} sauvgader avec succès!`, 'success')
    return true
  }

  const showDeletToast = async (label: string): Promise<boolean> => {
    await showToast(`${label} Supprimé avec succès !`, 'success')
    return true
  }

  return { confirmDelete, confirmUpdate, confirmAdd, showDeletToast, confirmSave }
}
