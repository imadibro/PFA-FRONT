import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { TextField } from '@mui/material'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useUpdateTaskMutation } from '@/store/features/task/taskApi'

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string

    console.log('label ', label)
    console.log('description ', description)

    if (!taskToEdit?.id) return

    try {
      await updateTask({ id: taskToEdit.id, label, description }).unwrap()
      onClose()
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  return (
    <div className='bg-backgroundPaper p-4'>
      <Typography variant='h4' className='my-4'>
        Update Task
      </Typography>
      <form action='' onSubmit={handleSubmit}>
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
            Give your task a clear and concise name.
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
            Give your task a clear and concise description.
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
          {isLoading ? 'Updating...' : 'Update'}
        </CustomIconButton>
      </form>
    </div>
  )
}

export default UpdateTask
