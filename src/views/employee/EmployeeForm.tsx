import type { SystemMode } from '@core/types'
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tab
} from '@mui/material'
import { TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import {
  useUpdateEmployeeMutation,
  useCreateEmployeeMutation,
  useUpdateEmployeePasswordMutation
} from '@/store/features/employee/employeeApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import React from 'react'
import CustomTabList from '@/@core/components/mui/TabList'
import { TabContext, TabPanel } from '@mui/lab'
import { IEmployee, IRole } from '@/@core/utils/types'

const EmployeeForm = ({
  mode,
  roles,
  employeeToEdit,
  onClose,
  isEditMode
}: {
  mode: SystemMode
  roles: IRole[]
  employeeToEdit?: IEmployee | null
  onClose: () => void
  isEditMode: boolean
}) => {
  const { showAlert, showToast } = useSweetAlert()
  const [tabValue, setTabValue] = React.useState('1')

  const [showPassword, setShowPassword] = React.useState(false)
  const [isPasswordInValid, setIsPasswordInValid] = React.useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmedPassword, setShowConfirmedPassword] = React.useState(false)
  const [isCurrentPasswordInValid, setIsCurrentPasswordInValid] = React.useState(false)
  const [isNewPasswordInValid, setIsNewPasswordInValid] = React.useState(false)
  const [isConfirmedPasswordInValid, setIsConfirmedPasswordInValid] = React.useState(false)

  const [updateEmployee, { isLoading: isUpdating, isError: updateError, error: updateErr }] =
    useUpdateEmployeeMutation()
  const [createEmployee, { isLoading: isCreating, isError: createError, error: createErr }] =
    useCreateEmployeeMutation()
  const [
    updateEmployeePassword,
    {
      isLoading: isLoadingUpdateEmployeePassword,
      isError: isErrorUpdateEmployeePassword,
      error: errorUpdateEmployeePassword,
      isSuccess: isSuccessUpdateEmployeePassword
    }
  ] = useUpdateEmployeePasswordMutation()

  const isUpdatingEmployee = isEditMode && employeeToEdit?.id
  const isLoading = isUpdatingEmployee ? isUpdating : isCreating
  const isError = isUpdatingEmployee ? updateError : createError
  const error = isUpdatingEmployee ? updateErr : createErr

  const handleClickShowPassword = () => setShowPassword(show => !show)

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    setIsPasswordInValid(password.length < 8)
  }

  const handleCurrentPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    setIsCurrentPasswordInValid(password.length < 8)
  }

  const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    setIsNewPasswordInValid(password.length < 8)
  }

  const handleConfirmedPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value
    setIsConfirmedPasswordInValid(password.length < 8)
  }

  const handleUpdateEmployeeSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    const EmployeeRole = roles.find(item => item.role === role)
    if (!EmployeeRole) {
      return
    }

    try {
      if (isUpdatingEmployee) {
        await updateEmployee({
          id: employeeToEdit.id,
          username,
          email,
          firstName,
          lastName,
          password,
          role: EmployeeRole
        }).unwrap()
        showToast('Employé mis à jour avec succès!', 'success')
      } else {
        await createEmployee({
          username,
          email,
          firstName,
          lastName,
          password,
          role: EmployeeRole
        }).unwrap()
        showToast('Employé créé avec succès!', 'success')
      }
      onClose()
    } catch (err) {
      showAlert(
        'Erreur',
        `Une erreur est survenue lors de la ${isUpdatingEmployee ? 'mise à jour' : 'création'} de l'employé`,
        'error'
      )
    }
  }

  const handleUpdateEmployeePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmedPassword = formData.get('confirmedPassword') as string

    setIsCurrentPasswordInValid(false)
    setIsNewPasswordInValid(false)
    setIsConfirmedPasswordInValid(false)

    if (currentPassword.length < 8 || newPassword.length < 8 || confirmedPassword.length < 8) {
      if (currentPassword.length < 8) setIsCurrentPasswordInValid(true)
      if (newPassword.length < 8) setIsNewPasswordInValid(true)
      if (confirmedPassword.length < 8) setIsConfirmedPasswordInValid(true)
      return
    }
    if (newPassword !== confirmedPassword) {
      setIsConfirmedPasswordInValid(true)
      return
    }

    if (!employeeToEdit?.id) {
      return
    }
    try {
      const response: IEmployee = await updateEmployeePassword({
        id: employeeToEdit.id,
        currentPassword,
        newPassword
      }).unwrap()
      showToast('Mot de passe mis à jour avec succès!', 'success')
    } catch (err) {
      showAlert('Error', "Une erreur s'est produite lors de la tentative de modification du mot de passe", 'error')
    }
  }

  return (
    <div className='bg-backgroundPaper'>
      <Box sx={{ width: '100%', minWidth: 450 }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
          <i className='tabler-x' />
        </IconButton>
        <TabContext value={tabValue}>
          {isUpdatingEmployee && (
            <CustomTabList
              onChange={(_, newValue) => setTabValue(newValue)}
              color='primary'
              sx={{ marginTop: isUpdatingEmployee ? 10 : 0 }}
            >
              <Tab label={"Mettre à jour l'employé"} value='1' />
              {isUpdatingEmployee && <Tab label='Mettre à jour le mot de passe' value='2' />}
            </CustomTabList>
          )}

          <div className='bg-backgroundPaper p-6'>
            <Typography variant='h4' className='my-4 mt-5'>
              {isUpdatingEmployee ? "Mettre à jour l'employé" : 'Créer un employé'}
            </Typography>
            <TabPanel value='1'>
              <form onSubmit={handleUpdateEmployeeSubmit}>
                {isError && (
                  <Alert severity='error' sx={{ my: 4 }}>
                    {(error as any)?.data?.message ||
                      `Échec de la ${isUpdatingEmployee ? 'mise à jour' : 'création'} de l'employé`}
                  </Alert>
                )}
                <div className='mb-4'>
                  <TextField
                    size='small'
                    name='username'
                    label="Nom d'utilisateur"
                    placeholder="Nom d'utilisateur"
                    required
                    fullWidth
                    defaultValue={employeeToEdit?.username}
                  />
                </div>
                <div className='mb-4'>
                  <TextField
                    size='small'
                    name='email'
                    label='E-mail'
                    type='email'
                    placeholder='E-mail'
                    required
                    fullWidth
                    defaultValue={employeeToEdit?.email}
                  />
                </div>
                <div className='mb-4'>
                  <TextField
                    size='small'
                    name='firstName'
                    label='Prénom'
                    placeholder='Prénom'
                    required
                    fullWidth
                    defaultValue={employeeToEdit?.firstName}
                  />
                </div>
                <div className='mb-4'>
                  <TextField
                    size='small'
                    name='lastName'
                    label='Nom de famille'
                    placeholder='Nom de famille'
                    required
                    fullWidth
                    defaultValue={employeeToEdit?.lastName}
                  />
                </div>
                {!isEditMode && (
                  <div className='mb-4'>
                    <FormControl sx={{ width: '100%' }} variant='outlined'>
                      <InputLabel htmlFor='outlined-adornment-password'>Mot de passe</InputLabel>
                      <OutlinedInput
                        id='outlined-adornment-password'
                        size='small'
                        name='password'
                        error={isPasswordInValid}
                        placeholder='Mot de passe'
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label={showPassword ? 'hide the password' : 'display the password'}
                              onClick={handleClickShowPassword}
                              edge='end'
                            >
                              {showPassword ? (
                                <span className='tabler-eye w-5 h-5 mr-2' />
                              ) : (
                                <span className='tabler-eye-off w-5 h-5 mr-2' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label='Mot de passe'
                        onChange={handlePasswordChange}
                      />
                    </FormControl>
                    <Typography variant='body2' color={isPasswordInValid ? 'red' : 'textSecondary'}>
                      {isPasswordInValid
                        ? "Mot de passe doit être d'au moins 8 caractères"
                        : 'Donnez à votre Employé un mot de passe clair et concis.'}
                    </Typography>
                  </div>
                )}
                <div className='mb-4'>
                  <FormControl fullWidth size='small'>
                    <InputLabel id='role-select-label'>Rôle</InputLabel>
                    <Select
                      labelId='role-select-label'
                      id='role-select'
                      name='role'
                      label='Rôle'
                      defaultValue={employeeToEdit?.role?.role || ''}
                      required
                    >
                      {roles.map(roleItem => (
                        <MenuItem key={roleItem.id} value={roleItem.role}>
                          {roleItem.role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
                  <Button
                    disabled={isLoading}
                    variant='outlined'
                    size='small'
                    onClick={onClose}
                    className='h-10 mt-4 w-full'
                  >
                    Annuler
                  </Button>
                  <Button
                    type='submit'
                    sx={{ mr: 1 }}
                    disabled={isLoading || isLoadingUpdateEmployeePassword}
                    variant='contained'
                    size='small'
                    className='h-10 mt-4 w-full'
                  >
                    {isLoading
                      ? isUpdatingEmployee
                        ? 'Mise à jour...'
                        : 'Création...'
                      : isUpdatingEmployee
                        ? 'Modifier'
                        : 'Créer'}
                  </Button>
                </Box>
              </form>
            </TabPanel>
            {isUpdatingEmployee && (
              <TabPanel value='2'>
                <form onSubmit={handleUpdateEmployeePasswordSubmit}>
                  {isErrorUpdateEmployeePassword && (
                    <Alert severity='error' sx={{ my: 4 }}>
                      {(errorUpdateEmployeePassword as any)?.data?.message ||
                        'Impossible de mettre à jour le mot de passe'}
                    </Alert>
                  )}
                  {isSuccessUpdateEmployeePassword && (
                    <Alert severity='success' sx={{ my: 4 }}>
                      Mot de passe mis à jour avec succès
                    </Alert>
                  )}
                  <div className='mb-4'>
                    <FormControl sx={{ width: '100%' }} variant='outlined'>
                      <InputLabel htmlFor='outlined-adornment-password'>Mot de passe actuel</InputLabel>
                      <OutlinedInput
                        id='outlined-adornment-password'
                        size='small'
                        name='currentPassword'
                        error={isCurrentPasswordInValid}
                        placeholder='Mot de passe actuel'
                        type={showCurrentPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label={showCurrentPassword ? 'hide the password' : 'display the password'}
                              onClick={() => setShowCurrentPassword(show => !show)}
                              edge='end'
                            >
                              {showCurrentPassword ? (
                                <span className='tabler-eye w-5 h-5 mr-2' />
                              ) : (
                                <span className='tabler-eye-off w-5 h-5 mr-2' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label='Mot de passe'
                        onChange={handleCurrentPasswordChange}
                      />
                    </FormControl>
                    <Typography variant='body2' color={isCurrentPasswordInValid ? 'red' : 'textSecondary'}>
                      {isCurrentPasswordInValid
                        ? "Mot de passe doit être d'au moins 8 caractères"
                        : 'Donnez à votre employé un mot de passe clair et concis.'}
                    </Typography>
                  </div>
                  <div className='mb-4'>
                    <FormControl sx={{ width: '100%' }} variant='outlined'>
                      <InputLabel htmlFor='outlined-adornment-password'>Nouveau mot de passe</InputLabel>
                      <OutlinedInput
                        id='outlined-adornment-password'
                        size='small'
                        name='newPassword'
                        error={isNewPasswordInValid}
                        placeholder='Nouveau mot de passe'
                        type={showNewPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label={showNewPassword ? 'hide the password' : 'display the password'}
                              onClick={() => setShowNewPassword(show => !show)}
                              edge='end'
                            >
                              {showNewPassword ? (
                                <span className='tabler-eye w-5 h-5 mr-2' />
                              ) : (
                                <span className='tabler-eye-off w-5 h-5 mr-2' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label='Mot de passe'
                        onChange={handleNewPasswordChange}
                      />
                    </FormControl>
                    <Typography variant='body2' color={isNewPasswordInValid ? 'red' : 'textSecondary'}>
                      {isNewPasswordInValid
                        ? "Mot de passe doit être d'au moins 8 caractères"
                        : 'Donnez à votre employé un mot de passe clair et concis.'}
                    </Typography>
                  </div>
                  <div className='mb-4'>
                    <FormControl sx={{ width: '100%' }} variant='outlined'>
                      <InputLabel htmlFor='outlined-adornment-password'>Confirmez le mot de passe</InputLabel>
                      <OutlinedInput
                        id='outlined-adornment-password'
                        size='small'
                        name='confirmedPassword'
                        error={isConfirmedPasswordInValid}
                        placeholder='Confirmez le mot de passe'
                        type={showConfirmedPassword ? 'text' : 'password'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label={showConfirmedPassword ? 'hide the password' : 'display the password'}
                              onClick={() => setShowConfirmedPassword(show => !show)}
                              edge='end'
                            >
                              {showConfirmedPassword ? (
                                <span className='tabler-eye w-5 h-5 mr-2' />
                              ) : (
                                <span className='tabler-eye-off w-5 h-5 mr-2' />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label='Mot de passe'
                        onChange={handleConfirmedPasswordChange}
                      />
                    </FormControl>
                    <Typography variant='body2' color={isConfirmedPasswordInValid ? 'red' : 'textSecondary'}>
                      {isConfirmedPasswordInValid
                        ? "Mot de passe doit être d'au moins 8 caractères"
                        : 'Donnez à votre employé un mot de passe clair et concis.'}
                    </Typography>
                  </div>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
                    <Button
                      disabled={isLoading}
                      variant='outlined'
                      size='small'
                      onClick={onClose}
                      className='h-10 mt-4 w-full'
                    >
                      Annuler
                    </Button>
                    <Button
                      type='submit'
                      sx={{ mr: 1 }}
                      variant='contained'
                      disabled={isLoading || isLoadingUpdateEmployeePassword}
                      className='h-10 mt-4 w-full'
                    >
                      {isLoading || isLoadingUpdateEmployeePassword ? 'Mise à jour...' : 'Modifier'}
                    </Button>
                  </Box>
                </form>
              </TabPanel>
            )}
          </div>
        </TabContext>
      </Box>
    </div>
  )
}

export default EmployeeForm
