import CustomIconButton from '@/@core/components/mui/IconButton'
import { useCreateRequirementMutation } from '@/store/features/requirement/requirementApi'
import type { SystemMode } from '@core/types'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'

const CreateRequirement = ({ mode }: { mode: SystemMode }) => {
  const [CreateRequirement, { isLoading, isError, error, isSuccess }] = useCreateRequirementMutation()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    const priority = formData.get('priority') as string

    await CreateRequirement({ label, description, priority }).unwrap()
    console.log('Requirement submitted')
  }
  return (
    <div className='bg-backgroundPaper p-2'>
      {isError && <p className='text-red-500'>Error: {(error as any)?.data?.message || 'Failed to create task'}</p>}
      {isSuccess && <p style={{ color: 'green' }}>Task created successfully!</p>}
      <Typography variant='h4' className='my-2'>
        Create Requirement
      </Typography>
      <form action='' onSubmit={handleSubmit}>
        <div className='mb-4'>
          <TextField size='small' name='label' label='label' placeholder='label' fullWidth />
          <Typography variant='body2' color='textSecondary'>
            Give your Requirement a clear and concise name.
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
            Give your Requirement a clear and concise description.
          </Typography>
        </div>

        <div className='mb-4'>
          <FormControl fullWidth size='small'>
            <InputLabel id='demo-simple-select-label'>priority</InputLabel>
            <Select labelId='demo-simple-select-label' id='demo-simple-select' name='priority' label='PRIORITY'>
              <MenuItem value={'Faible'}>Faible</MenuItem>
              <MenuItem value={'Moyen'}>Moyen</MenuItem>
              <MenuItem value={'Élevé'}>Élevé</MenuItem>
            </Select>
          </FormControl>
          <Typography variant='body2' color='textSecondary'>
            Give your Requirement a clear and concise description.
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

export default CreateRequirement
