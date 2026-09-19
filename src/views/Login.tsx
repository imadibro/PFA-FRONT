'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

// Type Imports
// import type { SystemMode } from '@core/types'
import { Alert, Box, Card, CardContent } from '@mui/material'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { invalidateSessionCache } from '@/store/api'
import AuthIllustrationV1Wrapper from '@components/layout/auth/AuthIllustrationV1Wrapper'
import { signIn } from 'next-auth/react'

type FormData = {
  usernameOrEmail: string
  password: string
}

const LoginV2 = (/*{ mode }: { mode: SystemMode }*/) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [rememberMe, setRememberMe] = useState<boolean>(true)

  // Hooks
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormData>()

  const submitForm: SubmitHandler<FormData> = async data => {
    try {
      // 1️⃣ LOGIN BACKEND (browser)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Login failed')
      }

      const { accessToken } = await res.json()

      // 2️⃣ STORE accessToken IN NEXTAUTH
      await signIn('credentials', {
        accessToken,
        redirect: false
      })

      //  INVALIDATE CACHE (force reload next time)
      invalidateSessionCache()

      router.push('/')
    } catch (e: any) {
      setError('root', {
        type: 'manual',
        message: e.message
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
                  name='usernameOrEmail'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      autoFocus
                      label="Nom d'utilisateur ou Email"
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder="Nom d'utilisateur ou Email"
                      error={Boolean(errors.usernameOrEmail)}
                      {...(errors.usernameOrEmail && { helperText: errors.usernameOrEmail.message })}
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant='body2' sx={{ mr: 1 }}>
                  Vous n&apos;avez pas de compte ?
                </Typography>
                <Typography
                  component='a'
                  href='/register'
                  variant='body2'
                  sx={{ color: 'primary.main', textDecoration: 'none', cursor: 'pointer' }}
                >
                  S&apos;inscrire
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

export default LoginV2
