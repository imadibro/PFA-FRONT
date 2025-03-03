'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

// MUI Imports
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

// Type Imports
import { Alert, Box, Card, CardContent, useTheme } from '@mui/material'
import type { SystemMode } from '@core/types'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import AuthIllustrationV1Wrapper from '@/@layouts/components/auth/AuthIllustrationV1Wrapper'

type FormData = {
  username: string
  password: string
}

const LoginV2 = ({ mode }: { mode: SystemMode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [rememberMe, setRememberMe] = useState<boolean>(true)

  // Hooks
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setError
  } = useForm<FormData>()

  const submitForm: SubmitHandler<FormData> = async data => {
    const { username, password } = data
    try {
      if (!username || !password) {
        setError('root', {
          type: 'manual',
          message: 'Tous les champs sont obligatoires'
        })
        return
      }

      const result = await signIn('credentials', {
        username: username,
        password: password,
        redirect: false,
        callbackUrl: '/planification'
      })
      if (result?.error) {
        setError('root', {
          type: 'manual',
          message: result?.error || 'Invalid username or password'
        })
        return
      }
      if (result?.ok) {
        router.push('/')
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Service not available at the moment. Please contact support.'
      })
    }
  }

  return (
    <Box className='content-center'>
      <AuthIllustrationV1Wrapper>
        <Card>
          <CardContent sx={{ p: theme => `${theme.spacing(10.5, 8, 8)} !important` }}>
            <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src='/images/logo.png' alt='UPTEL Logo' width='50' height='50' />
              <Typography variant='h4' sx={{ mb: 1.5, textAlign: 'center' }}>
                {themeConfig.templateName.toUpperCase()}
              </Typography>
              <Typography variant='h6' sx={{ mb: -5.5, textAlign: 'center' }} color={'primary'}>
                planing
              </Typography>
            </Box>
            <Box sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h5' sx={{ mb: 1.5 }}>
                {themeConfig.templateSlogan}
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(submitForm)}>
              <div className='my-2'>
                {errors.root && (
                  <Alert variant='outlined' severity='error'>
                    {errors.root.message}
                  </Alert>
                )}
              </div>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label="Nom d'utilisateur"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder="Nom d'utilisateur"
                      error={Boolean(errors.username)}
                      {...(errors.username && { helperText: errors.username.message })}
                    />
                  )}
                />
              </Box>
              <Box sx={{ mb: 1.5 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      value={value}
                      onBlur={onBlur}
                      label='Mot de passe'
                      onChange={onChange}
                      placeholder='*********'
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      {...(errors.password && { helperText: errors.password.message })}
                      type={isPasswordShown ? 'text' : 'password'}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setIsPasswordShown(!isPasswordShown)}
                            >
                              <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  mb: 1.75,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <FormControlLabel
                  label='Mémoriser mes informations'
                  control={<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />}
                />
              </Box>
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={isSubmitting}>
                {isSubmitting ? 'Se connecter ...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

export default LoginV2
