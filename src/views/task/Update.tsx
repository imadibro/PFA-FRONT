import Typography from '@mui/material/Typography'
import { Alert, TextField } from '@mui/material'

import type { SystemMode } from '@core/types'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useUpdateTaskMutation } from '@/store/features/task/taskApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'

import type { ITask } from '@/@core/utils/types'

const UpdateTask = ({
  mode,
  taskToEdit,
  onClose
}: {
  mode: SystemMode
  taskToEdit: ITask | null
  onClose: () => void
}) => {
  const [updateTask, { isLoading, isError, error, isSuccess }] = useUpdateTaskMutation()
  const { showAlert, showToast } = useSweetAlert()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string

    if (!taskToEdit?.id) return

    try {
      await updateTask({ id: taskToEdit.id, label, description }).unwrap()
      showToast('Tâche mise à jour avec succès!', 'success')
      onClose()
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to Updated the task', 'error')
    }
  }

  return (
    <div className='bg-backgroundPaper p-4'>
      <Typography variant='h4' className='my-4'>
        Mettre à jour la tâche
      </Typography>
      <form action='' onSubmit={handleSubmit}>
        {isError && <Alert severity='error'>{(error as any)?.data?.message || 'Failed to update task'}</Alert>}
        <div className='mb-4'>
          <TextField
            size='small'
            name='label'
            label='label'
            placeholder='label'
            defaultValue={taskToEdit?.label}
            required
            fullWidth
          />
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
            defaultValue={taskToEdit?.description}
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
          <span className='tabler-edit w-5 h-5 mr-2' />
          {isLoading ? 'Mise à jour...' : 'Modifier'}
        </CustomIconButton>
      </form>
    </div>
  )
}

export default UpdateTask
