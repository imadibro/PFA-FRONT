'use client'

import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { IOperationTask, IOperationTrans, IOperationType, IOperationZone, ITask } from '@/@core/utils/types'
import { useToastComponante } from '@/components/common/ToastComponante'
import {
  useCreateOperationTasksMutation,
  useGetOperationsTransQuery,
  useGetOperationsTypesQuery,
  useGetOperationsZonesQuery
} from '@/store/features/operation/operationTasksApi'
import { useGetTasksQuery } from '@/store/features/task/taskApi'
import { isRTKQueryError } from '@/utils/functions'
import { Button, Grid, IconButton, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React from 'react'

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

const CreateOperation = ({ close }: { close: () => void }) => {
  const [selectedTasks, setSelectedTasks] = React.useState<ITask[]>([])
  const [selectedType, setSelectedType] = React.useState<IOperationType | null>(null)
  const [selectedZone, setSelectedZone] = React.useState<IOperationZone | null>(null)
  const [selectedTrans, setSelectedTrans] = React.useState<IOperationTrans | null>(null)
  // const [durationMode, setDurationMode] = React.useState(false)

  const { showAlert, showToast } = useSweetAlert()
  const { showUnauthorizedToast } = useToastComponante()

  const { data: tasks /* error: taskError, isLoading: isLoadingTasks */ } = useGetTasksQuery()
  const {
    data: operationTypes
    // error: operationTypeError,
    // isLoading: isLoadingOperationTypes
  } = useGetOperationsTypesQuery()
  const {
    data: operationTrans
    // error: operationTransError,
    // isLoading: isLoadingOperationTrans
  } = useGetOperationsTransQuery()
  const {
    data: operationZones
    // error: operationZoneError,
    // isLoading: isLoadingOperationZones
  } = useGetOperationsZonesQuery()

  const [createOperationTasks, { isLoading /* isError, error, isSuccess */ }] = useCreateOperationTasksMutation()

  const handleCreateOperationSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // const formData = new FormData(event.currentTarget as HTMLFormElement)

    if (!selectedTasks?.length) {
      showAlert('', 'Veuillez sélectionner au moins une tâche', 'error')
      return
    }
    if (!selectedType) {
      showAlert('', 'Veuillez sélectionner une operation', 'error')
      return
    }
    if (!selectedZone) {
      showAlert('', 'Veuillez sélectionner une zone', 'error')
      return
    }
    if (!selectedTrans) {
      showAlert('', 'Veuillez sélectionner un trans', 'error')
      return
    }

    try {
      const tasksIds = selectedTasks?.map((task: ITask) => task.id).filter(Boolean) || []
      const operationType = selectedType?.id
      const operationZone = selectedZone?.id
      const operationTrans = selectedTrans?.id

      const response: IOperationTask = await createOperationTasks({
        operationTypeId: operationType,
        operationZoneId: operationZone,
        operationTransId: operationTrans,
        operationTasksIds: tasksIds
      }).unwrap()
      showToast('Opération créée avec succès!', 'success')
      close()
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        showAlert(
          'Error',
          "Une erreur s'est produite lors de la tentative de création d'une nouvelle opération",
          'error'
        )
      }
    }
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', p: 4, minWidth: 450 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Créer une type opération
        </Typography>
        <IconButton onClick={close} sx={{ color: 'grey.600' }}>
          <i className='tabler-x' />
        </IconButton>
      </Box>

      <div className='bg-backgroundPaper'>
        <form onSubmit={handleCreateOperationSubmit}>
          <div className='mb-4'>
            <Autocomplete
              id='checkboxes-types'
              options={operationTypes || []}
              disableCloseOnSelect={false}
              blurOnSelect
              getOptionLabel={option => option.label}
              value={selectedType}
              onChange={(event, newValue) => setSelectedType(newValue)}
              ChipProps={{ color: 'warning' }}
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.id}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option.label}
                </li>
              )}
              limitTags={5}
              renderInput={params => <TextField {...params} fullWidth label='Opération' size='small' />}
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

          <div className='my-8'>
            <Autocomplete
              id='checkboxes-zones'
              options={operationZones || []}
              disableCloseOnSelect={false}
              blurOnSelect
              getOptionLabel={option => option.label}
              value={selectedZone}
              onChange={(event, newValue) => setSelectedZone(newValue)}
              ChipProps={{ color: 'warning' }}
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.id}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option.label}
                </li>
              )}
              limitTags={5}
              renderInput={params => <TextField {...params} fullWidth label='Zone' size='small' />}
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

          <div className='my-8'>
            <Autocomplete
              id='checkboxes-trans'
              options={operationTrans || []}
              disableCloseOnSelect={false}
              blurOnSelect
              getOptionLabel={option => option.label}
              value={selectedTrans}
              onChange={(event, newValue) => setSelectedTrans(newValue)}
              ChipProps={{ color: 'warning' }}
              renderOption={(props, option, { selected }) => (
                <li {...props} key={option.id}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                  {option.label}
                </li>
              )}
              limitTags={5}
              renderInput={params => <TextField {...params} fullWidth label='Trans' size='small' />}
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

          <div className='my-8'>
            <Autocomplete
              multiple
              id='checkboxes-tasks'
              options={tasks}
              disableCloseOnSelect={false}
              blurOnSelect
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
              renderInput={params => <TextField {...params} fullWidth label='Tâches ciblées' size='small' />}
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

          <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              type='submit'
              variant='contained'
              fullWidth
              sx={{ fontWeight: 600, bgcolor: '#7C5CFA', '&:hover': { bgcolor: '#6c4edb' } }}
              disabled={isLoading}
            >
              {isLoading ? 'Ajouter...' : 'Ajouter'}
            </Button>

            <Button
              fullWidth
              disabled={isLoading}
              onClick={close}
              style={{ marginLeft: 3 }}
              variant='outlined'
              color='error'
            >
              Annuler
            </Button>
          </Grid>
        </form>
      </div>
    </Box>
  )
}

export default CreateOperation
