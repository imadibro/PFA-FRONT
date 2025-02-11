import CustomIconButton from '@/@core/components/mui/IconButton'
import { useCreateTaskMutation } from '@/store/features/task/taskApi'
import type { SystemMode } from '@core/types'
import { TextField } from '@mui/material'
import Typography from '@mui/material/Typography'

const CreateTask = ({ mode }: { mode: SystemMode }) => {
  const [createTask, { isLoading, isError, error, isSuccess }] = useCreateTaskMutation()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    try {
      await createTask({ label, description }).unwrap()
      alert('Task created successfully!')
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }
  return (
    <div className='bg-backgroundPaper p-2'>
      {isError && <p className='text-red-500'>Error: {(error as any)?.data?.message || 'Failed to create task'}</p>}
      {isSuccess && <p style={{ color: 'green' }}>Task created successfully!</p>}
      <Typography variant='h4' className='my-2'>
        Create Task
      </Typography>
      <form action='' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <TextField size='small' name='label' label='label' placeholder='label' required fullWidth />
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
          <span className='tabler-send w-5 h-5 mr-2' />
          {isLoading ? 'Submit...' : 'Submit'}
        </CustomIconButton>
      </form>
    </div>
  )
}

export default CreateTask
