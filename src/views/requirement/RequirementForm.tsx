import Typography from '@mui/material/Typography'
import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import type { SystemMode } from '@core/types'
import { useUpdateRequirementMutation, useCreateRequirementMutation } from '@/store/features/requirement/requirementApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { IRequirement } from '@/@core/utils/types'
import { useToastComponante } from '@/components/common/DeletedComponante'

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
  const { showAlert } = useSweetAlert()
  const { confirmAdd, confirmUpdate } = useToastComponante()

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
        confirmUpdate('Exigence')
      } else {
        await createRequirement({ label, description, priority }).unwrap()
        confirmAdd('Exigence')
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {isEditMode ? 'Modifier Contrainte' : 'Ajouter Contrainte'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'grey.600' }}>
          <i className='tabler-x' />
        </IconButton>
      </Box>
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
            <InputLabel id='priority-label' shrink>
              Priorité
            </InputLabel>
            <Select
              label='Priorité'
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
        <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type='submit'
            variant='contained'
            fullWidth
            sx={{ fontWeight: 600, bgcolor: '#7C5CFA', '&:hover': { bgcolor: '#6c4edb' } }}
            disabled={isLoading}
          >
            {isLoading
              ? isUpdatingRequirement
                ? 'Mise à jour...'
                : 'Création...'
              : isUpdatingRequirement
                ? 'Modifier'
                : 'Ajouter'}
          </Button>

          <Button fullWidth onClick={onClose} style={{ marginLeft: 3 }} variant='outlined' color='error'>
            Annuler
          </Button>
        </Grid>
      </form>
    </div>
  )
}

export default RequirementForm
