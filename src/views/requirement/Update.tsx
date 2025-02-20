import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useUpdateRequirementMutation } from '@/store/features/requirement/requirementApi'
import { Alert, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import useSweetAlert from '@/@core/hooks/useSweetAlert'

const UpdateRequirement = ({
  mode,
  requirementToEdit,
  onClose
}: {
  mode: SystemMode
  requirementToEdit: IRequirement | null
  onClose: () => void
}) => {
  const [updateRequirement, { isLoading, isError, error, isSuccess }] = useUpdateRequirementMutation()
  const { showAlert, showToast } = useSweetAlert()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    if (!requirementToEdit?.id) return

    try {
      await updateRequirement({
        id: requirementToEdit.id,
        label,
        description,
        priority: priority
      }).unwrap()
      showToast('Exigence mise à jour avec succès !', 'success')
      onClose()
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to update requirement', 'error')
    }
  }

  return (
    <div className='bg-backgroundPaper p-4'>
      <Typography variant='h4' className='my-4'>
        Mise à jour Exigence
      </Typography>
      <form action='' onSubmit={handleSubmit}>
        {isError && <Alert severity='error'>{(error as any)?.data?.message || 'Failed to update requirement'}</Alert>}
        <div className='mb-4'>
          <TextField
            size='small'
            name='label'
            label='label'
            placeholder='label'
            defaultValue={requirementToEdit?.label}
            required
            fullWidth
          />
          <Typography variant='body2' color='textSecondary'>
            Donnez à votre exigence une étiquette claire et concise.
          </Typography>
        </div>
        <div className='mb-4'>
          <TextField
            size='small'
            name='description'
            label='description'
            placeholder='description'
            defaultValue={requirementToEdit?.description}
            required
            rows={4}
            fullWidth
            multiline
          />
          <Typography variant='body2' color='textSecondary'>
            Donnez à votre exigence une description claire et concise.
          </Typography>
        </div>
        <div className='mb-4'>
          <FormControl fullWidth size='small'>
            <InputLabel id='priority-label'>Priorité</InputLabel>
            <Select
              labelId='priority-label'
              id='demo-simple-select'
              name='priority'
              label='PRIORITY'
              defaultValue={requirementToEdit?.priority || 'Faible'}
            >
              <MenuItem value={'Faible'}>Faible</MenuItem>
              <MenuItem value={'Moyen'}>Moyen</MenuItem>
              <MenuItem value={'Élevé'}>Élevé</MenuItem>
            </Select>
          </FormControl>
          <Typography variant='body2' color='textSecondary'>
            Choisissez une priorité pour votre exigence
          </Typography>
        </div>
        <CustomIconButton
          type='submit'
          color='primary'
          variant='tonal'
          size='small'
          className='h-10 mt-4'
          disabled={isLoading}
        >
          <span className='tabler-edit w-5 h-5 mr-2' />
          {isLoading ? 'Mise à jour...' : 'Modifier'}
        </CustomIconButton>
      </form>
    </div>
  )
}

export default UpdateRequirement
