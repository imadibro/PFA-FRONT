import useSweetAlert from '@/@core/hooks/useSweetAlert'

export const useToastComponante = () => {
  const { showConfirm, showToast, showConfirmWithCheckbox } = useSweetAlert()

  const confirmDelete = async (label: string): Promise<boolean> => {
    return await showConfirm('', `Êtes-vous sûr de vouloir supprimer ${label} ?`, 'Supprimer', 'Annuler')
  }

  const confirmDeleteWithCheckbox = async (
    label: string,
    checkboxLabel: string
  ): Promise<{
    isConfirmed: boolean
    checkboxChecked: boolean
  }> => {
    const result = await showConfirmWithCheckbox(
      `Êtes-vous sûr de vouloir supprimer ${label} ?`,
      checkboxLabel,
      'Supprimer',
      'Annuler'
    )

    return {
      isConfirmed: result.isConfirmed,
      checkboxChecked: result.checkboxChecked
    }
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

  const getApiMessage = (err: any) => {
    // RTK Query: { status, data: { message, error, statusCode } }
    const data = err?.data
    const msg =
      (Array.isArray(data?.message) ? data.message.join(', ') : data?.message) ||
      data?.error || // parfois "Conflict"
      err?.error || // ex: "FETCH_ERROR"
      (typeof err === 'string' ? err : null)

    return msg || 'Échec de suppression'
  }

  const showErrorToast = async (err: any) => {
    const message = getApiMessage(err)
    await showToast(message, 'error')
  }

  return {
    confirmDelete,
    confirmUpdate,
    confirmAdd,
    showDeletToast,
    confirmSave,
    showErrorToast,
    confirmDeleteWithCheckbox
  }
}
