import type { SystemMode } from '@core/types'
import { Alert, Box, IconButton } from '@mui/material'
import { useState } from 'react'
import { TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import CustomIconButton from '@/@core/components/mui/IconButton'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { IOperation, ITask } from '@/@core/utils/types'
import { useUpdateOperationMutation } from '@/store/features/operation/operationApi'

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
  const [combinedTasks, setCombinedTasks] = useState<ITask[] | null>([...tasks, ...(operationToEdit?.tasks || [])])

  const [selectedTasks, setSelectedTasks] = useState<ITask[]>([...(operationToEdit?.tasks || [])])

  const { showAlert, showToast } = useSweetAlert()

  const [updateOperation, { isLoading, isError, error, isSuccess }] = useUpdateOperationMutation()

  const handleUpdateOperationSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string

    const initialTasks = operationToEdit?.tasks || []
    const tasksToAdd = selectedTasks.filter(task => !initialTasks.some(t => t.id === task.id))?.map(item => item.id)
    const tasksToRemove = initialTasks.filter(task => !selectedTasks.some(t => t.id === task.id))?.map(item => item.id)

    if (!operationToEdit?.id) return
    try {
      await updateOperation({ id: operationToEdit.id, label, description, tasksToAdd, tasksToRemove }).unwrap()
      onClose()
      showToast('Opération modifiée avec succès!', 'success')
    } catch (err) {
      showAlert('Error', "Une erreur s'est produite lors de la tentative de mise à jour de l'opération", 'error')
    }
  }

  return (
    <div className='bg-backgroundPaper p-4' style={{ minWidth: 450 }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
        <i className='tabler-x' />
      </IconButton>
      <Typography variant='h4' className='my-4  mt-10'>
        Mise à jour de l'opération
      </Typography>
      <Box sx={{ width: '100%' }}>
        <form onSubmit={handleUpdateOperationSubmit}>
          {isError && (
            <Alert severity='error'>{(error as any)?.data?.message || "Échec de la mise à jour de l'opération"}</Alert>
          )}
          <div className='mb-4'>
            <TextField
              size='small'
              name='label'
              label='Libellé'
              placeholder='Libellé'
              defaultValue={operationToEdit?.label}
              required
              fullWidth
            />
          </div>
          <div className='mb-4'>
            <TextField
              size='small'
              name='description'
              label='description'
              placeholder='description'
              defaultValue={operationToEdit?.description}
              rows={4}
              fullWidth
              multiline
            />
          </div>

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
              renderInput={params => <TextField {...params} fullWidth label='Tâches ciblées' />}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Tooltip title={`${option.label}`} key={option.id}>
                    <StyledChip {...getTagProps({ index })} label={`${option.label}`} />
                  </Tooltip>
                ))
              }
            />
          </div>
          <CustomIconButton
            type='submit'
            color='primary'
            variant='contained'
            size='small'
            className='h-10 mt-4'
            disabled={isLoading}
          >
            <span className='tabler-edit w-5 h-5 mr-2' />
            {isLoading ? 'Mise à jour...' : 'Modifier'}
          </CustomIconButton>
        </form>
      </Box>
    </div>
  )
}

export default UpdateOperation
