import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { Alert, Box, Button, IconButton, TextField } from '@mui/material'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useUpdateTaskMutation, useCreateTaskMutation } from '@/store/features/task/taskApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { ITask } from '@/@core/utils/types'

const TaskForm = ({
  mode,
  taskToEdit,
  onClose,
  isEditMode
}: {
  mode: SystemMode
  taskToEdit?: ITask | null
  onClose: () => void
  isEditMode: boolean
}) => {
  const [updateTask, { isLoading: isUpdating, isError: updateError, error: updateErr }] = useUpdateTaskMutation()
  const [createTask, { isLoading: isCreating, isError: createError, error: createErr }] = useCreateTaskMutation()
  const { showAlert, showToast } = useSweetAlert()

  const isUpdatingTask = isEditMode && taskToEdit?.id
  const isLoading = isEditMode ? isUpdating : isCreating
  const isError = isEditMode ? updateError : createError
  const error = isEditMode ? updateErr : createErr

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string

    try {
      if (isUpdatingTask) {
        await updateTask({ id: taskToEdit.id, label, description }).unwrap()
        showToast('Tâche mise à jour avec succès!', 'success')
      } else {
        await createTask({ label, description }).unwrap()
        showToast('Tâche créée avec succès!', 'success')
      }
      onClose()
    } catch (err) {
      showAlert(
        'Erreur',
        `Une erreur est survenue lors de la ${isUpdatingTask ? 'mise à jour' : 'création'} de la tâche`,
        'error'
      )
    }
  }

  return (
    <div className='bg-backgroundPaper p-4' style={{ minWidth: 450 }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
        <i className='tabler-x' />
      </IconButton>
      <Typography variant='h4' className='my-4  mt-10'>
        {isUpdatingTask ? 'Mettre à jour la tâche' : 'Créer une tâche'}
      </Typography>
      <form onSubmit={handleSubmit}>
        {isError && (
          <Alert severity='error'>
            {(error as any)?.data?.message || `Échec de la ${isUpdatingTask ? 'mise à jour' : 'création'} de la tâche`}
          </Alert>
        )}
        <div className='mb-4'>
          <TextField
            size='small'
            name='label'
            label='Libellé'
            placeholder='Libellé'
            defaultValue={isUpdatingTask ? taskToEdit?.label : ''}
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
            defaultValue={isUpdatingTask ? taskToEdit?.description : ''}
            rows={4}
            fullWidth
            multiline
          />
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
          <Button variant='outlined' size='small' onClick={onClose} className='h-10 mt-4 w-full'>
            Annuler
          </Button>
          <Button
            type='submit'
            color='primary'
            variant='contained'
            size='small'
            className='h-10 mt-4 w-full'
            disabled={isLoading}
          >
            {isLoading ? (isUpdatingTask ? 'Mise à jour...' : 'Création...') : isUpdatingTask ? 'Modifier' : 'Créer'}
          </Button>
        </Box>
      </form>
    </div>
  )
}

export default TaskForm
