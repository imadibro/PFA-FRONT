import CustomTabList from '@/@core/components/mui/TabList'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { IEmployee, IRole } from '@/@core/utils/types'
import { useToastComponante } from '@/components/common/ToastComponante'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useUpdateEmployeePasswordMutation
} from '@/store/features/employee/employeeApi'
import type { SystemMode } from '@core/types'
import { TabContext, TabPanel } from '@mui/lab'
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Tab,
  TextField
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import React from 'react'

const EmployeeForm = ({
  roles,
  employeeToEdit,
  onClose,
  isEditMode,
  isOpen
}: {
  mode: SystemMode
  roles: IRole[]
  employeeToEdit?: IEmployee | null
  onClose: () => void
  isEditMode: boolean
  isOpen: boolean
}) => {
  const { showAlert, showToast } = useSweetAlert()
  const { confirmUpdate } = useToastComponante()
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
          role: EmployeeRole.id
        }).unwrap()
        await confirmUpdate('Employé')
      } else {
        await createEmployee({
          username,
          email,
          firstName,
          lastName,
          password,
          role: EmployeeRole.id
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
      await updateEmployeePassword({
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
    <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} employé`} open={isOpen} toggle={onClose}>
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
                defaultValue={isEditMode ? employeeToEdit?.username : ''}
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
              <Autocomplete
                size='small'
                options={roles}
                getOptionLabel={option => option.role || ''}
                defaultValue={roles.find(r => r.role === employeeToEdit?.role?.role) || null}
                onChange={(event, newValue) => {}}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={params => <TextField {...params} label='Rôle' name='role' required />}
              />
            </div>

            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
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
                    : 'Ajouter'}
              </Button>
              <Button
                disabled={isLoading}
                variant='outlined'
                size='small'
                onClick={onClose}
                color='error'
                className='h-10 mt-4 w-full'
              >
                Annuler
              </Button>
            </Box>
          </form>
        </TabPanel>
        {isUpdatingEmployee && (
          <TabPanel value='2'>
            <form onSubmit={handleUpdateEmployeePasswordSubmit}>
              {isErrorUpdateEmployeePassword && (
                <Alert severity='error' sx={{ my: 4 }}>
                  {(errorUpdateEmployeePassword as any)?.data?.message || 'Impossible de mettre à jour le mot de passe'}
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
                  type='submit'
                  sx={{ mr: 1 }}
                  variant='contained'
                  disabled={isLoading || isLoadingUpdateEmployeePassword}
                  className='h-10 mt-4 w-full'
                >
                  {isLoading || isLoadingUpdateEmployeePassword ? 'Mise à jour...' : 'Modifier'}
                </Button>
                <Button
                  disabled={isLoading}
                  variant='outlined'
                  color='error'
                  size='small'
                  onClick={onClose}
                  className='h-10 mt-4 w-full'
                >
                  Annuler
                </Button>
              </Box>
            </form>
          </TabPanel>
        )}
      </TabContext>
    </SidebarDrawerForm>
  )
}

export default EmployeeForm

// import { useForm, Controller } from 'react-hook-form'

// interface EmployeeFormValues {
//   username: string
//   email: string
//   firstName: string
//   lastName: string
//   password: string
//   role: string
// }

// const EmployeeForm = ({
//   roles,
//   employeeToEdit,
//   onClose,
//   isEditMode,
//   isOpen
// }: {
//   mode: SystemMode
//   roles: IRole[]
//   employeeToEdit?: IEmployee | null
//   onClose: () => void
//   isEditMode: boolean
//   isOpen: boolean
// }) => {
//   const { showAlert, showToast } = useSweetAlert()
//   const [showPassword, setShowPassword] = React.useState(false)

//   const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation()
//   const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation()

//   const isUpdatingEmployee = isEditMode && employeeToEdit?.id
//   const isLoading = isUpdatingEmployee ? isUpdating : isCreating

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm<EmployeeFormValues>({
//     defaultValues: {
//       username: isEditMode && employeeToEdit ? employeeToEdit?.username : '',
//       email: isEditMode && employeeToEdit ? employeeToEdit?.email : '',
//       firstName: isEditMode && employeeToEdit ? employeeToEdit?.firstName : '',
//       lastName: isEditMode && employeeToEdit ? employeeToEdit?.lastName : '',
//       password: '',
//       role: isEditMode && employeeToEdit ? employeeToEdit?.role?.role : ''
//     }
//   })

//   // Remise à zéro des valeurs quand l'employé change ou mode change
//   React.useEffect(() => {
//     reset({
//       username: employeeToEdit?.username ?? '',
//       email: employeeToEdit?.email ?? '',
//       firstName: employeeToEdit?.firstName ?? '',
//       lastName: employeeToEdit?.lastName ?? '',
//       password: '',
//       role: employeeToEdit?.role?.role ?? '',
//     })
//   }, [employeeToEdit, isEditMode, reset])

//   const onSubmit = async (data: EmployeeFormValues) => {
//     const employeeRole = roles.find(item => item.role === data.role)
//     if (!employeeRole) return

//     try {
//       if (isUpdatingEmployee) {
//         await updateEmployee({
//           id: employeeToEdit.id,
//           username: data.username,
//           email: data.email,
//           firstName: data.firstName,
//           lastName: data.lastName,
//           password: data.password,
//           role: employeeRole.id
//         }).unwrap()
//         showToast('Employé mis à jour avec succès!', 'success')
//       } else {
//         await createEmployee({
//           username: data.username,
//           email: data.email,
//           firstName: data.firstName,
//           lastName: data.lastName,
//           password: data.password,
//           role: employeeRole.id
//         }).unwrap()
//         showToast('Employé créé avec succès!', 'success')
//       }
//       onClose()
//     } catch (err) {
//       showAlert(
//         'Erreur',
//         `Une erreur est survenue lors de la ${isUpdatingEmployee ? 'mise à jour' : 'création'} de l'employé`,
//         'error'
//       )
//     }
//   }

//   return (
//     <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} employé`} open={isOpen} toggle={onClose}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className='mb-4'>
//           <Controller
//             control={control}
//             name='username'
//             rules={{ required: "Nom d'utilisateur requis" }}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size='small'
//                 label="Nom d'utilisateur"
//                 required
//                 fullWidth
//                 error={!!errors.username}
//                 helperText={errors.username?.message}
//               />
//             )}
//           />
//         </div>
//         <div className='mb-4'>
//           <Controller
//             control={control}
//             name='email'
//             rules={{ required: 'E-mail requis', pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail invalide' } }}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size='small'
//                 label='E-mail'
//                 type='email'
//                 required
//                 fullWidth
//                 error={!!errors.email}
//                 helperText={errors.email?.message}
//               />
//             )}
//           />
//         </div>
//         <div className='mb-4'>
//           <Controller
//             control={control}
//             name='firstName'
//             rules={{ required: 'Prénom requis' }}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size='small'
//                 label='Prénom'
//                 required
//                 fullWidth
//                 error={!!errors.firstName}
//                 helperText={errors.firstName?.message}
//               />
//             )}
//           />
//         </div>
//         <div className='mb-4'>
//           <Controller
//             control={control}
//             name='lastName'
//             rules={{ required: 'Nom de famille requis' }}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size='small'
//                 label='Nom de famille'
//                 required
//                 fullWidth
//                 error={!!errors.lastName}
//                 helperText={errors.lastName?.message}
//               />
//             )}
//           />
//         </div>
//         {!isEditMode && (
//           <div className='mb-4'>
//             <Controller
//               control={control}
//               name='password'
//               rules={{
//                 required: 'Mot de passe requis',
//                 minLength: { value: 8, message: 'Mot de passe doit être d’au moins 8 caractères' }
//               }}
//               render={({ field }) => (
//                 <FormControl sx={{ width: '100%' }} variant='outlined'>
//                   <InputLabel htmlFor='password'>Mot de passe</InputLabel>
//                   <OutlinedInput
//                     {...field}
//                     id='password'
//                     size='small'
//                     error={!!errors.password}
//                     type={showPassword ? 'text' : 'password'}
//                     endAdornment={
//                       <InputAdornment position='end'>
//                         <IconButton onClick={() => setShowPassword(show => !show)} edge='end'>
//                           {showPassword ? (
//                             <span className='tabler-eye w-5 h-5 mr-2' />
//                           ) : (
//                             <span className='tabler-eye-off w-5 h-5 mr-2' />
//                           )}
//                         </IconButton>
//                       </InputAdornment>
//                     }
//                     label='Mot de passe'
//                   />
//                   <Typography variant='body2' color={errors.password ? 'red' : 'textSecondary'}>
//                     {errors.password?.message || 'Donnez à votre employé un mot de passe clair et concis.'}
//                   </Typography>
//                 </FormControl>
//               )}
//             />
//           </div>
//         )}
//         <div className='mb-4'>
//           <Controller
//             control={control}
//             name='role'
//             rules={{ required: 'Rôle requis' }}
//             render={({ field }) => (
//               <FormControl fullWidth size='small' error={!!errors.role}>
//                 <InputLabel id='role-select-label'>Rôle</InputLabel>
//                 <Select {...field} labelId='role-select-label' label='Rôle' required>
//                   {roles.map(roleItem => (
//                     <MenuItem key={roleItem.id} value={roleItem.role}>
//                       {roleItem.role}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.role && (
//                   <Typography variant='body2' color='red'>
//                     {errors.role.message}
//                   </Typography>
//                 )}
//               </FormControl>
//             )}
//           />
//         </div>
//         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
//           <Button
//             type='submit'
//             sx={{ mr: 1 }}
//             disabled={isLoading}
//             variant='contained'
//             size='small'
//             className='h-10 mt-4 w-full'
//           >
//             {isLoading
//               ? isUpdatingEmployee
//                 ? 'Mise à jour...'
//                 : 'Création...'
//               : isUpdatingEmployee
//                 ? 'Modifier'
//                 : 'Ajouter'}
//           </Button>
//           <Button
//             disabled={isLoading}
//             variant='outlined'
//             size='small'
//             onClick={onClose}
//             color='error'
//             className='h-10 mt-4 w-full'
//           >
//             Annuler
//           </Button>
//         </Box>
//       </form>
//     </SidebarDrawerForm>
//   )
// }
// export default EmployeeForm
