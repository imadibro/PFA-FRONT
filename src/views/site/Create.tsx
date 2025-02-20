import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import React, { useRef } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import Box from '@mui/material/Box'
import { Alert, Button, StepLabel, TextField } from '@mui/material'
import { useCreateSiteMutation, useMapRequirementsToSiteMutation } from '@/store/features/site/siteApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'

const steps = ['Créer un site', 'Affecter les exigences au site']

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

const CreateSite = ({
  mode,
  requirements,
  close
}: {
  mode: SystemMode
  requirements: IRequirement[]
  close: () => void
}) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean
  }>({})
  const [isStep1Submitted, setStep1IsSubmitted] = React.useState(false)
  const [selectedRequirements, setSelectedRequirements] = React.useState<ITask[]>([])
  const [createdSite, setCreatedSite] = React.useState<ISite>()
  const { showAlert, showToast } = useSweetAlert()

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

  const [createSite, { isLoading, isError, error, isSuccess }] = useCreateSiteMutation()
  const [
    mapRequirementToSite,
    {
      isLoading: mapRequirementsLoading,
      isError: mapRequirementsIsError,
      error: mapRequirementsError,
      isSuccess: mapRequirementsIsSuccess
    }
  ] = useMapRequirementsToSiteMutation()

  const handleCreateSiteSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const siteNbr = formData.get('siteNbr') as string
    const description = formData.get('description') as string
    try {
      const response: ISite = await createSite({ label, siteNbr, description }).unwrap()
      setCreatedSite(response)
      setActiveStep(1)
      showToast('site créé avec succès!', 'success')
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to create a new site', 'error')
    }
  }

  const handleComplete = async () => {
    setCompleted({
      ...completed,
      [activeStep]: true
    })

    if (!createdSite?.id) return
    if (!selectedRequirements?.length) {
      close()
      showToast('site créé avec succès !', 'success')
      return
    }
    const requirementsIds = selectedRequirements?.map((task: ITask) => task.id)
    try {
      await mapRequirementToSite({ siteId: createdSite.id, requirementsIds }).unwrap()
      setActiveStep(1)
      close()
      showToast('Exigences attribuée au site avec succès !', 'success')
    } catch (err) {
      showAlert('Error', 'Something went wrong while trying to Assigne requirements to Site', 'error')
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
          <form onSubmit={handleCreateSiteSubmit} ref={formStep1Ref}>
            {isError && <Alert severity='error'>{(error as any)?.data?.message || 'Failed to create site'}</Alert>}
            <div className='mb-4'>
              <TextField size='small' name='label' label='label' placeholder='label' required fullWidth />
              <Typography variant='body2' color='textSecondary'>
                Donnez à votre site une étiquette claire et concise.
              </Typography>
            </div>
            <div className='mb-4'>
              <TextField size='small' name='siteNbr' label='site Number' placeholder='site Number' required fullWidth />
              <Typography variant='body2' color='textSecondary'>
                Donnez à votre numéro de site un numéro clair et concis.
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
                Donnez à votre site une description claire et concise.
              </Typography>
            </div>
          </form>
        </div>
      ) : (
        <form>
          {mapRequirementsIsError && (
            <Alert severity='error'>
              {(mapRequirementsError as any)?.data?.message || 'Failed to map requirement to site'}
            </Alert>
          )}
          <div className='my-8'>
            <Autocomplete
              multiple
              id='checkboxes-requirements'
              options={requirements}
              disableCloseOnSelect
              getOptionLabel={option => option.label}
              value={selectedRequirements}
              onChange={(event, newValue) => setSelectedRequirements(newValue)}
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
                  label='Exigences ciblées'
                  helperText='Toutes les exigences qui feront partie de ce site.'
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
        <Button onClick={handleNext} sx={{ mr: 1 }} disabled={isLoading || mapRequirementsLoading}>
          {isLoading && activeStep === 0
            ? 'Soumettre...'
            : mapRequirementsLoading
              ? 'Compléter...'
              : activeStep === 1
                ? 'Compléter'
                : 'Suivant'}
        </Button>
      </Box>
    </Box>
  )
}

export default CreateSite
