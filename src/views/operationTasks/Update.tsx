'use client'

import { useState } from 'react'
import { Box, IconButton, TextField, Button, Checkbox, Tooltip, Typography, Grid } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import {
  useGetOperationsTypesQuery,
  useGetOperationsZonesQuery,
  useGetOperationsTransQuery,
  useUpdateOperationTasksMutation
} from '@/store/features/operation/operationTasksApi'
import type { IOperationTask, IOperationTrans, IOperationType, IOperationZone, ITask } from '@/@core/utils/types'

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
  operationToEdit,
  tasks,
  onClose
}: {
  operationToEdit: IOperationTask
  tasks: ITask[]
  onClose: () => void
}) => {
  const { showAlert, showToast } = useSweetAlert()
  const [updateOperation, { isLoading }] = useUpdateOperationTasksMutation()

  const [selectedType, setSelectedType] = useState<IOperationType | null>(operationToEdit?.operationType || null)
  const [selectedZone, setSelectedZone] = useState<IOperationZone | null>(operationToEdit?.operationZone || null)
  const [selectedTrans, setSelectedTrans] = useState<IOperationTrans | null>(operationToEdit?.operationTrans || null)
  const [selectedTasks, setSelectedTasks] = useState<ITask[]>(operationToEdit?.tasks || [])

  const { data: operationTypes } = useGetOperationsTypesQuery()
  const { data: operationZones } = useGetOperationsZonesQuery()
  const { data: operationTrans } = useGetOperationsTransQuery()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedType || !selectedZone || !selectedTrans || selectedTasks.length === 0) {
      showAlert('Erreur', 'Veuillez remplir tous les champs', 'error')
      return
    }

    const form = new FormData(e.currentTarget as HTMLFormElement)

    const initialTasks = operationToEdit?.tasks || []
    const tasksToAdd = selectedTasks.filter(t => !initialTasks.some(init => init.id === t.id)).map(t => t.id)
    // const tasksToRemove = initialTasks.filter(t => !selectedTasks.some(sel => sel.id === t.id)).map(t => t.id)
    const newTasks = selectedTasks.map(t => t.id)

    try {
      await updateOperation({
        id: operationToEdit.id,
        // label,
        operationTypeId: selectedType.id,
        operationZoneId: selectedZone.id,
        operationTransId: selectedTrans.id,
        operationTasksIds: newTasks
        // tasksToRemove
      }).unwrap()
      showToast('Opération modifiée avec succès', 'success')
      onClose()
    } catch (err) {
      showAlert('Erreur', "La mise à jour de l'opération a échoué", 'error')
    }
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', p: 4, minWidth: 450 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Modifier type d'opération
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'grey.600' }}>
          <i className='tabler-x' />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <Autocomplete
            options={operationTypes || []}
            getOptionLabel={option => option.label}
            value={selectedType}
            onChange={(e, val) => setSelectedType(val)}
            renderInput={params => <TextField {...params} fullWidth label='Opération' size='small' />}
          />
        </div>

        <div className='mb-4'>
          <Autocomplete
            options={operationZones || []}
            getOptionLabel={option => option.label}
            value={selectedZone}
            onChange={(e, val) => setSelectedZone(val)}
            renderInput={params => <TextField {...params} fullWidth label='Zone' size='small' />}
          />
        </div>

        <div className='mb-4'>
          <Autocomplete
            options={operationTrans || []}
            getOptionLabel={option => option.label}
            value={selectedTrans}
            onChange={(e, val) => setSelectedTrans(val)}
            renderInput={params => <TextField {...params} fullWidth label='Trans' size='small' />}
          />
        </div>

        <div className='mb-4'>
          <Autocomplete
            multiple
            options={tasks}
            getOptionLabel={option => option.label}
            value={selectedTasks}
            onChange={(event, newValue) => setSelectedTasks(newValue)}
            renderInput={params => <TextField {...params} fullWidth label='Tâches ciblées' size='small' />}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option.label}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Tooltip title={`${option.label}`} key={option.id}>
                  <StyledChip
                    {...getTagProps({ index })}
                    variant='filled'
                    deleteIcon={<i className='tabler:trash' />}
                    label={`${option.label}`}
                    onAbort={() => setSelectedTasks(selectedTasks.filter(t => t.id !== option.id))}
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
            {isLoading ? 'Modifier...' : 'Modifier'}
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
    </Box>
  )
}

export default UpdateOperation
