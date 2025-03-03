import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useUpdateRequirementMutation, useCreateRequirementMutation } from '@/store/features/requirement/requirementApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { IRequirement } from '@/@core/utils/types'

const RequirementForm = ({
  mode,
  requirementToEdit,
  onClose,
  isEditMode
}: {
  mode: SystemMode
  requirementToEdit?: IRequirement | null
  onClose: () => void
  isEditMode: boolean
}) => {
  const [updateRequirement, { isLoading: isUpdating, isError: updateError, error: updateErr }] =
    useUpdateRequirementMutation()
  const [createRequirement, { isLoading: isCreating, isError: createError, error: createErr }] =
    useCreateRequirementMutation()
  const { showAlert, showToast } = useSweetAlert()

  const isUpdatingRequirement = isEditMode && requirementToEdit?.id
  const isLoading = isUpdatingRequirement ? isUpdating : isCreating
  const isError = isUpdatingRequirement ? updateError : createError
  const error = isUpdatingRequirement ? updateErr : createErr

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    try {
      if (isUpdatingRequirement) {
        await updateRequirement({ id: requirementToEdit.id, label, description, priority }).unwrap()
        showToast('Exigence mise à jour avec succès!', 'success')
      } else {
        await createRequirement({ label, description, priority }).unwrap()
        showToast('Exigence créée avec succès!', 'success')
      }
      onClose()
    } catch (err) {
      showAlert(
        'Erreur',
        `Une erreur est survenue lors de la ${isUpdatingRequirement ? 'mise à jour' : 'création'} de l'Prérequi`,
        'error'
      )
    }
  }

  return (
    <div className='bg-backgroundPaper p-4' style={{ minWidth: 450 }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
        <i className='tabler-x' />
      </IconButton>
      <Typography variant='h4' className='my-4 mt-10'>
        {isUpdatingRequirement ? 'Mettre à jour Prérequi' : 'Créer une Prérequi'}
      </Typography>
      <form onSubmit={handleSubmit}>
        {isError && (
          <Alert severity='error'>
            {(error as any)?.data?.message ||
              `Échec de la ${isUpdatingRequirement ? 'mise à jour' : 'création'} de Prérequi`}
          </Alert>
        )}
        <div className='mb-4'>
          <TextField
            size='small'
            name='label'
            label='Libellé'
            placeholder='Libellé'
            defaultValue={isUpdatingRequirement ? requirementToEdit?.label : ''}
            required
            fullWidth
          />
        </div>
        <div className='mb-4'>
          <TextField
            size='small'
            name='description'
            label='Description'
            placeholder='Description'
            defaultValue={isUpdatingRequirement ? requirementToEdit?.description : ''}
            rows={4}
            fullWidth
            multiline
          />
        </div>
        <div className='mb-4'>
          <FormControl fullWidth size='small'>
            <InputLabel id='priority-label'>Priorité</InputLabel>
            <Select
              labelId='priority-label'
              id='priority-select'
              name='priority'
              defaultValue={isUpdatingRequirement ? requirementToEdit?.priority : 'Faible'}
            >
              <MenuItem value={'Faible'}>Faible</MenuItem>
              <MenuItem value={'Moyen'}>Moyen</MenuItem>
              <MenuItem value={'Élevé'}>Élevé</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
          <Button disabled={isLoading} variant='outlined' size='small' onClick={onClose} className='h-10 mt-4 w-full'>
            Annuler
          </Button>
          <CustomIconButton
            type='submit'
            color='primary'
            variant='contained'
            size='small'
            className='h-10 mt-4 w-full'
            disabled={isLoading}
          >
            {isLoading
              ? isUpdatingRequirement
                ? 'Mise à jour...'
                : 'Création...'
              : isUpdatingRequirement
                ? 'Modifier'
                : 'Créer'}
          </CustomIconButton>
        </Box>
      </form>
    </div>
  )
}

export default RequirementForm
