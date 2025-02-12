'use client'

import React, { useEffect, useRef } from 'react'
import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { Button, StepLabel, TextField } from '@mui/material'
import { useCreateOperationMutation, useMapTasksToOperationMutation } from '@/store/features/operation/operationApi'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import Box from '@mui/material/Box'

const steps = ['Create Operation', 'Affect Tasks to Operation']

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

const CreateOperation = ({ mode, tasks, close }: { mode: SystemMode; tasks: ITask[]; close: () => void }) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})
  const [isStep1Submitted, setStep1IsSubmitted] = React.useState(false)
  const [selectedTasks, setSelectedTasks] = React.useState<ITask[]>([])
  const [createdOperation, setCreatedOperation] = React.useState<IOperation>()

  const formStep1Ref = useRef<HTMLFormElement | null>(null)

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = async () => {
    if (activeStep == 0 && formStep1Ref.current && !isStep1Submitted) {
      formStep1Ref.current.requestSubmit()
    } else if (activeStep == 1) {
      await handleComplete()
    }

    if (isStep1Submitted) {
      const newActiveStep =
        isLastStep() && !allStepsCompleted() ? steps.findIndex((step, i) => !(i in completed)) : activeStep + 1
      setActiveStep(newActiveStep)
    }
  }

  const [createOperation, { isLoading, isError, error, isSuccess }] = useCreateOperationMutation()
  const [
    mapTasksToOperation,
    { isLoading: mapTasksLoading, isError: mapTasksIsError, error: mapTasksError, isSuccess: mapTasksIsSuccess }
  ] = useMapTasksToOperationMutation()

  const handleCreateOperationSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const description = formData.get('description') as string
    try {
      const response: IOperation = await createOperation({ label, description }).unwrap()
      setCreatedOperation(response)
      setActiveStep(1)
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  const handleComplete = async () => {
    setCompleted({
      ...completed,
      [activeStep]: true
    })

    if (!selectedTasks || !selectedTasks.length || !createdOperation?.id) return

    const tasksIds = selectedTasks?.map((task: ITask) => task.id)
    try {
      await mapTasksToOperation({ operationId: createdOperation.id, tasksIds }).unwrap()
      setActiveStep(1)
      close()
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} className='mt-8'>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepLabel color='inherit'>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep == 0 ? (
        <div className='bg-backgroundPaper p-6'>
          <form onSubmit={handleCreateOperationSubmit} ref={formStep1Ref}>
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
          </form>
        </div>
      ) : (
        <form>
          <div className='my-8'>
            <Autocomplete
              multiple
              id='checkboxes-tasks'
              options={tasks}
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
        </form>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={handleNext} sx={{ mr: 1 }} disabled={isLoading}>
          {activeStep == 0 ? 'Next' : 'Complete'}
        </Button>
      </Box>
    </Box>
  )
}

export default CreateOperation
