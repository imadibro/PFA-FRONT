import CustomIconButton from '@/@core/components/mui/IconButton'
import type { SystemMode } from '@core/types'
import { TextField } from '@mui/material'
import Typography from '@mui/material/Typography'

const CreateRequirement = ({ mode }: { mode: SystemMode }) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('Requirement submitted')
  }
  return (
    <div className='bg-backgroundPaper p-2'>
      <Typography variant='h4' className='my-2'>
        Create Requirement
      </Typography>
      <form action='' onSubmit={handleSubmit}>
        <div>
          <TextField size='small' label='label' placeholder='label' fullWidth />
          <Typography variant='body2' color='textSecondary'>
            Give your Requirement a clear and concise name.
          </Typography>
        </div>
        <div>
          <TextField size='small' label='description' placeholder='description' rows={4} fullWidth multiline />
          <Typography variant='body2' color='textSecondary'>
            Give your Requirement a clear and concise description.
          </Typography>
        </div>
        <CustomIconButton color='primary' variant='tonal' size='small' className='h-10 mt-4'>
          <span className='tabler-send w-5 h-5 mr-2' />
          Submit
        </CustomIconButton>
      </form>
    </div>
  )
}

export default CreateRequirement
