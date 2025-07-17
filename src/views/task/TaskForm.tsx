import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { ITask } from '@/@core/utils/types'
import { useToastComponante } from '@/components/common/DeletedComponante'
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/store/features/task/taskApi'
import type { SystemMode } from '@core/types'
import { Alert, Box, Button, Grid, IconButton, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'

const TaskForm = ({
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
  const { confirmUpdate } = useToastComponante()

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
        await confirmUpdate('Tâche')
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          {isUpdatingTask ? 'Modifier la tâche' : 'Créer la tâche'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'grey.600' }}>
          <i className='tabler-x' />
        </IconButton>
      </Box>
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
        <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type='submit'
            variant='contained'
            fullWidth
            sx={{ fontWeight: 600, bgcolor: '#7C5CFA', '&:hover': { bgcolor: '#6c4edb' } }}
            disabled={isLoading}
          >
            {isLoading ? (isUpdatingTask ? 'Mise à jour...' : 'Création...') : isUpdatingTask ? 'Modifier' : 'Créer'}
          </Button>

          <Button
            fullWidth
            disabled={isLoading}
            onClick={onClose}
            style={{ marginLeft: 3 }}
            variant='outlined'
            color='error'
          >
            Annuler
          </Button>
        </Grid>
      </form>
    </div>
  )
}

export default TaskForm
