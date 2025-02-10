import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'

const CreateSite = ({ mode }: { mode: SystemMode }) => {
  return (
    <div className='bg-backgroundPaper p-6'>
      <Typography variant='h2' className='my-2'>
        Create New Site
      </Typography>
    </div>
  )
}

export default CreateSite
