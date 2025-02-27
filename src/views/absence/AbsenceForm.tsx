import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { Alert, Box, Button, IconButton, TextField } from '@mui/material'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useUpdateAbsenceMutation, useCreateAbsenceMutation } from '@/store/features/absence/absenceApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs, { Dayjs } from 'dayjs'
import Autocomplete from '@mui/material/Autocomplete'
import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import { IAbsence, IAbsenceReasons, IEmployee } from '@/@core/utils/types'

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

const absenceReasons: IAbsenceReasons[] = ['Malade', 'Congie', 'Autre']

const AbsenceForm = ({
  mode,
  absenceToEdit,
  employees,
  onClose,
  isEditMode
}: {
  mode: SystemMode
  absenceToEdit?: IAbsence | null
  employees: IEmployee[]
  onClose: () => void
  isEditMode: boolean
}) => {
  const [updateAbsence, { isLoading: isUpdating, isError: updateError, error: updateErr }] = useUpdateAbsenceMutation()
  const [createAbsence, { isLoading: isCreating, isError: createError, error: createErr }] = useCreateAbsenceMutation()
  const { showAlert, showToast } = useSweetAlert()

  const [selectedEmployee, setSelectedEmployee] = React.useState<IEmployee | null | undefined>(absenceToEdit?.employee)
  const [selectedAbsenceReason, setSelectedAbsenceReason] = React.useState<IAbsenceReasons | null | undefined>(
    absenceToEdit?.absence
  )

  const [isSelectedEmployeeError, setIsSelectedEmployeeError] = React.useState(false)
  const [isSelectedAbsenceReasonError, setIsSelectedAbsenceReasonError] = React.useState(false)
  const [isSelectedStartDateError, setIsSelectedStartDateError] = React.useState(false)
  const [isSelectedEndDateError, setIsSelectedEndDateError] = React.useState(false)

  const [startDate, setStartDate] = React.useState<Dayjs | null>(() =>
    absenceToEdit?.startDate ? dayjs(absenceToEdit?.startDate) : null
  )
  const [endDate, setEndDate] = React.useState<Dayjs | null>(() =>
    absenceToEdit?.endDate ? dayjs(absenceToEdit?.endDate) : null
  )

  const [notes, setNotes] = React.useState<string | null | undefined>(absenceToEdit?.notes)
  const [autre, setAutre] = React.useState(absenceToEdit?.autre)
  const [isAutre, setIsAutre] = React.useState(false)

  useEffect(() => {
    if (selectedAbsenceReason?.toLowerCase() == 'autre') {
      setIsAutre(true)
    } else {
      setIsAutre(false)
      setAutre('')
    }
  }, [selectedAbsenceReason])

  const isUpdatingAbsence = isEditMode && absenceToEdit?.id
  const isLoading = isUpdatingAbsence ? isUpdating : isCreating
  const isError = isUpdatingAbsence ? updateError : createError
  const error = isUpdatingAbsence ? updateErr : createErr

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date)
    setIsSelectedStartDateError(!date)
  }

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date)
    setIsSelectedEndDateError(!date)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const employee = selectedEmployee
    const absence = selectedAbsenceReason

    if (!employee?.id) {
      setIsSelectedEmployeeError(true)
      return
    }
    if (!absence) {
      setIsSelectedAbsenceReasonError(true)
      return
    }
    if (!startDate) {
      setIsSelectedStartDateError(true)
      return
    }
    if (!endDate) {
      setIsSelectedEndDateError(true)
      return
    }
    console.log('startDate ', startDate.toISOString())
    console.log('endDate ', endDate.toISOString())

    try {
      if (isUpdatingAbsence) {
        await updateAbsence({
          id: absenceToEdit.id,
          employee,
          absence,
          autre,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          notes
        }).unwrap()
        showToast('Absence modifiée avec succès!', 'success')
      } else {
        await createAbsence({
          employee,
          absence,
          autre,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          notes
        }).unwrap()
        showToast('Absence créée avec succès!', 'success')
      }
      onClose()
    } catch (err) {
      showAlert(
        'Erreur',
        `Une erreur est survenue lors de la ${isUpdatingAbsence ? 'mise à jour' : 'création'} de l'absence`,
        'error'
      )
    } finally {
      setIsSelectedEmployeeError(false)
      setIsSelectedAbsenceReasonError(false)
    }
  }

  return (
    <div className='bg-backgroundPaper p-4'>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
        <i className='tabler-x' />
      </IconButton>
      <Typography variant='h4' className='my-4 mt-10'>
        {isUpdatingAbsence ? "Mettre à jour l'absence" : 'Créer une absence'}
      </Typography>
      <form onSubmit={handleSubmit}>
        {isError && (
          <Alert severity='error'>
            {(error as any)?.data?.message ||
              `Échec de la ${isUpdatingAbsence ? 'mise à jour' : 'création'} de l'absence`}
          </Alert>
        )}

        <div className='my-8'>
          <Autocomplete
            id='checkboxes-employees'
            options={employees}
            size='small'
            getOptionLabel={option => `${option.firstName} ${option.lastName}`}
            value={selectedEmployee}
            onChange={(event, newValue) => setSelectedEmployee(newValue)}
            ChipProps={{ color: 'warning' }}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {`${option.firstName} ${option.lastName}`}
              </li>
            )}
            renderInput={params => (
              <TextField
                {...params}
                fullWidth
                label='Employé'
                helperText='Employé absent.'
                error={isSelectedEmployeeError}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Tooltip title={`${option.firstName} ${option.lastName}`} key={option.id}>
                  <StyledChip
                    {...getTagProps({ index })}
                    variant='filled'
                    label={`${option.firstName} ${option.lastName}`}
                    deleteIcon={<i className='tabler:trash' />}
                  />
                </Tooltip>
              ))
            }
          />
        </div>

        <div className='my-8'>
          <Autocomplete
            id='checkboxes-absenceReasons'
            size='small'
            options={absenceReasons}
            getOptionLabel={option => option}
            value={selectedAbsenceReason}
            onChange={(event, newValue) => setSelectedAbsenceReason(newValue)}
            ChipProps={{ color: 'warning' }}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option}
              </li>
            )}
            renderInput={params => (
              <TextField {...params} fullWidth label="Type d'absence" error={isSelectedAbsenceReasonError} />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Tooltip title={option} key={option}>
                  <StyledChip
                    {...getTagProps({ index })}
                    variant='filled'
                    label={option}
                    deleteIcon={<i className='tabler:trash' />}
                  />
                </Tooltip>
              ))
            }
          />
        </div>
        {isAutre && (
          <div className='mb-4'>
            <TextField
              size='small'
              name='autre'
              label='Motif'
              placeholder='Motif'
              required
              fullWidth
              multiline
              value={autre}
              onChange={e => setAutre(e.target.value)}
            />
          </div>
        )}

        <div className='mb-4'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ width: '100%' }}
              label='Date de début'
              name='startDate'
              value={startDate}
              onChange={handleStartDateChange}
              slotProps={{
                textField: {
                  error: isSelectedStartDateError,
                  size: 'small',
                  helperText: isSelectedStartDateError ? 'La date de début est obligatoire' : ''
                }
              }}
            />
          </LocalizationProvider>
        </div>

        <div className='mb-4'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{ width: '100%' }}
              label='Date de fin'
              name='endDate'
              value={endDate}
              onChange={handleEndDateChange}
              slotProps={{
                textField: {
                  error: isSelectedEndDateError,
                  size: 'small',
                  helperText: isSelectedEndDateError ? 'La date de fin est obligatoire' : ''
                }
              }}
            />
          </LocalizationProvider>
        </div>

        <div className='mb-4'>
          <TextField
            size='small'
            name='notes'
            label='Notes supplémentaires'
            placeholder='Notes supplémentaires'
            rows={4}
            fullWidth
            multiline
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
          <Button disabled={isLoading} variant='outlined' size='small' onClick={onClose} className='h-10 mt-4 w-full'>
            Annuler
          </Button>
          <CustomIconButton
            type='submit'
            color='primary'
            variant='contained'
            size='small'
            className='h-10 mt-4 w-full'
            disabled={isLoading}
          >
            {isLoading
              ? isUpdatingAbsence
                ? 'Mise à jour...'
                : 'Création...'
              : isUpdatingAbsence
                ? 'Modifier'
                : 'Créer'}
          </CustomIconButton>
        </Box>
      </form>
    </div>
  )
}

export default AbsenceForm
