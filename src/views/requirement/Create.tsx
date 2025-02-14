import CustomIconButton from '@/@core/components/mui/IconButton'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { useCreateRequirementMutation } from '@/store/features/requirement/requirementApi'
import type { SystemMode } from '@core/types'
import { Alert, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'

const CreateRequirement = ({ mode, onClose }: { mode: SystemMode; onClose: () => void }) => {
  const [CreateRequirement, { isLoading, isError, error, isSuccess }] = useCreateRequirementMutation()
  const { showAlert, showToast } = useSweetAlert()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string
    try {
      await CreateRequirement({ label, description, priority }).unwrap()
      showToast('Exigence créée avec succès!!', 'success')
      onClose()
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to create a new requirement', 'error')
    }
  }
  return (
    <div className='bg-backgroundPaper p-2'>
      {isError && <Alert severity='error'>{(error as any)?.data?.message || 'Failed to create requirement'}</Alert>}
      <Typography variant='h4' className='my-2'>
        Créer une exigence
      </Typography>
      <form action='' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <TextField size='small' name='label' label='label' placeholder='label' fullWidth />
          <Typography variant='body2' color='textSecondary'>
            Donnez à votre exigence un nom clair et concis.
          </Typography>
        </div>
        <div className='mb-4'>
          <TextField
            size='small'
            name='description'
            label='description'
            placeholder='description'
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
            <InputLabel id='demo-simple-select-label'>Priorité</InputLabel>
            <Select labelId='demo-simple-select-label' id='demo-simple-select' name='priority' label='PRIORITY'>
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
          <span className='tabler-send w-5 h-5 mr-2' />
          {isLoading ? 'Soumettre...' : 'Soumettre'}
        </CustomIconButton>
      </form>
    </div>
  )
}

export default CreateRequirement
