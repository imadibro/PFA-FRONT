import CustomIconButton from '@/@core/components/mui/IconButton'
import { useCreateTaskMutation } from '@/store/features/task/taskApi'
import type { SystemMode } from '@core/types'
import { Alert, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import useSweetAlert from '@/@core/hooks/useSweetAlert'

const CreateTask = ({ mode, onClose }: { mode: SystemMode; onClose: () => void }) => {
  const [createTask, { isLoading, isError, error, isSuccess }] = useCreateTaskMutation()
  const { showAlert, showToast } = useSweetAlert()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    try {
      await createTask({ label, description }).unwrap()
      showToast('Tâche créée avec succès!', 'success')
      onClose()
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to create a new task', 'error')
    }
  }
  return (
    <div className='bg-backgroundPaper p-2'>
      <Typography variant='h4' className='my-2'>
        Créer une tâche
      </Typography>
      <form action='' onSubmit={handleSubmit}>
        {isError && <Alert severity='error'>{(error as any)?.data?.message || 'Failed to create task'}</Alert>}
        <div className='mb-4'>
          <TextField size='small' name='label' label='label' placeholder='label' required fullWidth />
          <Typography variant='body2' color='textSecondary'>
            Donnez à votre tâche un nom clair et concis.
          </Typography>
        </div>
        <div className='mb-4'>
          <TextField
            size='small'
            name='description'
            label='description'
            placeholder='description'
            required
            rows={4}
            fullWidth
            multiline
          />
          <Typography variant='body2' color='textSecondary'>
            Donnez à votre tâche une description claire et concise.
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

export default CreateTask
