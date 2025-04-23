'use client'

import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { IOperation, ITask } from '@/@core/utils/types'
import { useCreateOperationMutation } from '@/store/features/operation/operationApi'
import { useGetTasksQuery } from '@/store/features/task/taskApi'
import { Button, FormControlLabel, IconButton, Switch, TextField } from '@mui/material'
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
  const [durationMode, setDurationMode] = React.useState(false)

  const { showAlert, showToast } = useSweetAlert()

  const { data: tasks, error: taskError, isLoading: isLoadingTasks } = useGetTasksQuery()
  const [createOperation, { isLoading, isError, error, isSuccess }] = useCreateOperationMutation()

  const handleCreateOperationSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const duration = formData.get('duration') as string
    const description = formData.get('description') as string
    const durationModeChar = durationMode ? 'h' : 'j'
    if (!selectedTasks?.length) {
      showAlert('', 'Veuillez sélectionner au moins une tâche', 'error')
      close()

      return
    }

    try {
      const tasksIds = selectedTasks?.map((task: ITask) => task.id)

      const response: IOperation = await createOperation({
        label,
        duration: Number(duration),
        durationMode: durationModeChar,
        description,
        tasksIds
      }).unwrap()

      showToast('Opération créée avec succès!', 'success')
    } catch (err) {
      showAlert('Error', "Une erreur s'est produite lors de la tentative de création d'une nouvelle opération", 'error')
    }
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', p: 4, minWidth: 450 }}>
      <IconButton onClick={close} sx={{ position: 'absolute', top: 8, left: 8 }}>
        <i className='tabler-x' />
      </IconButton>
      <Typography variant='h4' className='my-4  mt-10'>
        Créer une opération
      </Typography>

      <div className='bg-backgroundPaper'>
        <form onSubmit={handleCreateOperationSubmit}>
          <div className='mb-4'>
            <TextField size='small' name='label' label='Libellé' placeholder='Libellé' required fullWidth />
          </div>
          <div className='my-8'>
            <Autocomplete
              multiple
              id='checkboxes-tasks'
              options={tasks || []}
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
          <div className='mb-4'>
            <TextField
              type='number'
              size='small'
              name='duration'
              label={`durée ${durationMode ? 'en heures' : 'en jours'}`}
              placeholder='Durée'
              required
              fullWidth
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*'
              }}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '')
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  size='small'
                  checked={durationMode}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDurationMode(!durationMode)}
                />
              }
              label='en heure'
              className='float-end mb-3'
            />
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
          </div>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button disabled={isLoading} variant='outlined' size='small' onClick={close} className='h-10 mt-4 w-full'>
              Annuler
            </Button>
            <Button disabled={isLoading} variant='contained' size='small' className='h-10 mt-4 w-full' type='submit'>
              {isLoading ? 'Soumettre ...' : 'Soumettre'}
            </Button>
          </Box>
        </form>
      </div>
    </Box>
  )
}

export default CreateOperation
