import type { SystemMode } from '@core/types'
import { Alert, Box } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import CustomTabList from '@/@core/components/mui/TabList'
import { useState } from 'react'
import { Button, StepLabel, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import CustomIconButton from '@/@core/components/mui/IconButton'
import {
  useDetachTasksFromOperationMutation,
  useMapTasksToOperationMutation,
  useUpdateOperationMutation
} from '@/store/features/operation/operationApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'

const StyledChip = styled(Chip)({
  '&.MuiChip-root': {
    backgroundColor: 'rgb(var(--mui-palette-text-primaryChannel) / 0.08)',
    borderRadius: '16px'
  },
  '.MuiChip-deleteIcon': {
    color: '#0363C4'
  }
})

const icon = <i className='tabler:circle-check' />
const checkedIcon = <i className='tabler:checkbox' />

const UpdateOperation = ({
  mode,
  operationToEdit,
  tasks,
  onClose
}: {
  mode: SystemMode
  operationToEdit: IOperation | null
  tasks: ITask[]
  onClose: () => void
}) => {
  const [tabValue, setTabValue] = useState('1')

  const [combinedTasks, setCombinedTasks] = useState<ITask[] | null>([...tasks, ...(operationToEdit?.tasks || [])])

  const [selectedTasks, setSelectedTasks] = useState<ITask[]>([...(operationToEdit?.tasks || [])])

  const { showAlert, showToast } = useSweetAlert()

  const [updateOperation, { isLoading, isError, error, isSuccess }] = useUpdateOperationMutation()
  const [
    mapTasksToOperation,
    {
      isLoading: mapTasksToOperationIsLoading,
      isError: mapTasksToOperationIsError,
      error: mapTasksToOperationError,
      isSuccess: mapTasksToOperationIsSuccess
    }
  ] = useMapTasksToOperationMutation()

  const [
    detachTasksFromOperation,
    {
      isLoading: detachTasksFromOperationIsLoading,
      isError: detachTasksFromOperationIsError,
      error: detachTasksFromOperationError,
      isSuccess: detachTasksFromOperationIsSuccess
    }
  ] = useDetachTasksFromOperationMutation()

  const handleUpdateOperationSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    if (!operationToEdit?.id) return
    try {
      await updateOperation({ id: operationToEdit.id, label, description }).unwrap()
      onClose()
      showToast('Operation updated successfully!', 'success')
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to update operation', 'error')
    }
  }

  const handleUpdateOperationTasksSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // new Tasks => tasks that present in selectedTasks but not in the operationToEdit?.tasks
    // removed Tasks => tasks not present in selectedTasks but were in the initial operationToEdit?.tasks

    const initialTasks = operationToEdit?.tasks || []
    const newTasks = selectedTasks.filter(task => !initialTasks.some(t => t.id === task.id))
    const removedTasks = initialTasks.filter(task => !selectedTasks.some(t => t.id === task.id))

    try {
      if (!operationToEdit?.id) return

      const requests = []

      if (newTasks?.length) {
        const tasksIds = newTasks.map((task: ITask) => task.id)
        requests.push(mapTasksToOperation({ operationId: operationToEdit?.id, tasksIds }))
      }
      if (removedTasks?.length) {
        const tasksIds = removedTasks.map((task: ITask) => task.id)
        requests.push(detachTasksFromOperation({ operationId: operationToEdit?.id, tasksIds }))
      }
      if (requests.length) {
        await Promise.all(requests)
      }
      onClose()
      showToast('operation tasks updated successfully!', 'success')
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to update operation tasks', 'error')
    }
  }
  return (
    <div className='bg-backgroundPaper p-4'>
      <Box sx={{ width: '100%' }}>
        <TabContext value={tabValue}>
          <CustomTabList onChange={(_, newValue) => setTabValue(newValue)} color='primary'>
            <Tab label='Operations' value='1' />
            <Tab label='Tasks' value='2' />
          </CustomTabList>

          <TabPanel value='1'>
            <form onSubmit={handleUpdateOperationSubmit}>
              {isError && (
                <Alert severity='error'>{(error as any)?.data?.message || 'Failed to update operation'}</Alert>
              )}
              <div className='mb-4'>
                <TextField
                  size='small'
                  name='label'
                  label='label'
                  placeholder='label'
                  defaultValue={operationToEdit?.label}
                  required
                  fullWidth
                />
                <Typography variant='body2' color='textSecondary'>
                  Give your operation a clear and concise name.
                </Typography>
              </div>
              <div className='mb-4'>
                <TextField
                  size='small'
                  name='description'
                  label='description'
                  placeholder='description'
                  defaultValue={operationToEdit?.description}
                  required
                  rows={4}
                  fullWidth
                  multiline
                />
                <Typography variant='body2' color='textSecondary'>
                  Give your operation a clear and concise description.
                </Typography>
              </div>
              <CustomIconButton
                type='submit'
                color='primary'
                variant='tonal'
                size='small'
                className='h-10 mt-4'
                disabled={isLoading || mapTasksToOperationIsLoading || detachTasksFromOperationIsLoading}
              >
                <span className='tabler-edit w-5 h-5 mr-2' />
                {isLoading || mapTasksToOperationIsLoading || detachTasksFromOperationIsLoading
                  ? 'Updating...'
                  : 'Update'}
              </CustomIconButton>
            </form>
          </TabPanel>
          <TabPanel value='2'>
            <form onSubmit={handleUpdateOperationTasksSubmit}>
              {detachTasksFromOperationIsError && (
                <Alert severity='error'>
                  {(detachTasksFromOperationError as any)?.data?.message || 'Failed to update operation tasks'}
                </Alert>
              )}
              {mapTasksToOperationIsError && (
                <Alert severity='error'>
                  {(mapTasksToOperationError as any)?.data?.message || 'Failed to update operation tasks'}
                </Alert>
              )}
              <div className='my-8'>
                <Autocomplete
                  multiple
                  id='checkboxes-tasks'
                  options={combinedTasks || []}
                  disableCloseOnSelect
                  getOptionLabel={option => option.label}
                  value={selectedTasks}
                  onChange={(event, newValue) => setSelectedTasks(newValue)}
                  ChipProps={{ color: 'warning' }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props} key={option.id}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  limitTags={5}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Targeted Tasks'
                      helperText='All the tasks that will be part of this operation.'
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Tooltip title={`${option.label}`} key={option.id}>
                        <StyledChip
                          {...getTagProps({ index })}
                          variant='filled'
                          label={`${option.label}`}
                          deleteIcon={<i className='tabler:trash' />}
                        />
                      </Tooltip>
                    ))
                  }
                />
              </div>
              <CustomIconButton
                type='submit'
                color='primary'
                variant='tonal'
                size='small'
                className='h-10 mt-4'
                disabled={isLoading || mapTasksToOperationIsLoading || detachTasksFromOperationIsLoading}
              >
                <span className='tabler-edit w-5 h-5 mr-2' />
                {isLoading || mapTasksToOperationIsLoading || detachTasksFromOperationIsLoading
                  ? 'Updating...'
                  : 'Update'}
              </CustomIconButton>
            </form>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  )
}

export default UpdateOperation
