import type { SystemMode } from '@core/types'
import Table from '@core/components/mui/Table'
import Typography from '@mui/material/Typography'

const CreateOperation = ({ mode }: { mode: SystemMode }) => {
  return (
    <div className='bg-backgroundPaper p-6'>
      <Typography variant='h2' className='my-2'>
        Create Operation
      </Typography>
    </div>
  )
}

export default CreateOperation
