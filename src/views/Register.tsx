'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Alert, Box, Card, CardContent, MenuItem } from '@mui/material'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { invalidateSessionCache } from '@/store/api'
import AuthIllustrationV1Wrapper from '@components/layout/auth/AuthIllustrationV1Wrapper'
import themeConfig from '@configs/themeConfig'
import CustomTextField from '@core/components/mui/TextField'
import { signIn } from 'next-auth/react'

type RegisterFormData = {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  confirmPassword: string
  phone: string
  gender: string
  profileImage?: string
  userRole?: string
}

const Register = () => {
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const router = useRouter()
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError
  } = useForm<RegisterFormData>()

  const password = watch('password')

  const submitForm: SubmitHandler<RegisterFormData> = async data => {
    try {
      // Vérifier que les mots de passe correspondent
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Les mots de passe ne correspondent pas'
        })

        return
      }

      // Préparer le payload (sans confirmPassword)
      const { confirmPassword: _confirmPassword, ...registerPayload } = data

      // 1️⃣ REGISTER BACKEND
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACK_END_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerPayload),
        credentials: 'include'
      })

      if (!res.ok) {
        const err = await res.json()

        throw new Error(err.message || "Échec de l'inscription")
      }

      const { accessToken } = await res.json()

      // 2️⃣ AUTO-LOGIN avec NextAuth
      await signIn('credentials', {
        accessToken,
        redirect: false
      })

      // Invalider le cache
      invalidateSessionCache()

      // Afficher message de succès
      setSuccessMessage('Inscription réussie ! Redirection...')

      // Rediriger après 1.5 secondes
      setTimeout(() => {
        router.push('/')
      }, 1500)
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
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src='/images/logo.png' alt='UPTEL Logo' width='50' height='50' />
              <Typography variant='h4' sx={{ mb: 1.5, textAlign: 'center' }}>
                {themeConfig.templateName.toUpperCase()}
              </Typography>
            </Box>
            <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h5' sx={{ mb: 1 }}>
                Créer un compte
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                Remplissez le formulaire pour vous inscrire
              </Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={handleSubmit(submitForm)}>
              {/* Messages d'erreur ou succès */}
              <Box sx={{ mb: 2 }}>
                {errors.root && (
                  <Alert variant='outlined' severity='error'>
                    {errors.root.message}
                  </Alert>
                )}
                {successMessage && (
                  <Alert variant='outlined' severity='success'>
                    {successMessage}
                  </Alert>
                )}
              </Box>

              {/* Prénom et Nom */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{ required: 'Le prénom est requis' }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Prénom'
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='Jean'
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName?.message}
                    />
                  )}
                />
                <Controller
                  name='lastName'
                  control={control}
                  rules={{ required: 'Le nom est requis' }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Nom'
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='Dupont'
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName?.message}
                    />
                  )}
                />
              </Box>

              {/* Email */}
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{
                    required: "L'email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "L'adresse e-mail n'est pas valide"
                    }
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      type='email'
                      label='Email'
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='jean.dupont@example.com'
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                    />
                  )}
                />
              </Box>

              {/* Username */}
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='username'
                  control={control}
                  rules={{ required: "Le nom d'utilisateur est requis" }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label="Nom d'utilisateur"
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='jeandupont'
                      error={Boolean(errors.username)}
                      helperText={errors.username?.message}
                    />
                  )}
                />
              </Box>

              {/* Téléphone et Genre */}
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Controller
                  name='phone'
                  control={control}
                  rules={{
                    required: 'Le numéro de téléphone est requis',
                    minLength: {
                      value: 10,
                      message: 'Le numéro doit contenir au moins 10 caractères'
                    }
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Téléphone'
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='0612345678'
                      error={Boolean(errors.phone)}
                      helperText={errors.phone?.message}
                    />
                  )}
                />
                <Controller
                  name='gender'
                  control={control}
                  rules={{ required: 'Le genre est requis' }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      label='Genre'
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.gender)}
                      helperText={errors.gender?.message}
                    >
                      <MenuItem value='male'>Homme</MenuItem>
                      <MenuItem value='female'>Femme</MenuItem>
                      <MenuItem value='other'>Autre</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Box>

              {/* Mot de passe */}
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: 'Le mot de passe est requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Mot de passe'
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='••••••••'
                      type={isPasswordShown ? 'text' : 'password'}
                      error={Boolean(errors.password)}
                      helperText={errors.password?.message}
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

              {/* Confirmer mot de passe */}
              <Box sx={{ mb: 4 }}>
                <Controller
                  name='confirmPassword'
                  control={control}
                  rules={{
                    required: 'Veuillez confirmer votre mot de passe',
                    validate: value => value === password || 'Les mots de passe ne correspondent pas'
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CustomTextField
                      fullWidth
                      label='Confirmer le mot de passe'
                      value={value || ''}
                      onBlur={onBlur}
                      onChange={onChange}
                      placeholder='••••••••'
                      type={isConfirmPasswordShown ? 'text' : 'password'}
                      error={Boolean(errors.confirmPassword)}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              edge='end'
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => setIsConfirmPasswordShown(!isConfirmPasswordShown)}
                            >
                              <i className={isConfirmPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  )}
                />
              </Box>

              {/* Bouton d'inscription */}
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }} disabled={isSubmitting}>
                {isSubmitting ? 'Inscription en cours...' : "S'inscrire"}
              </Button>

              {/* Lien vers login */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='body2' sx={{ mr: 1 }}>
                  Vous avez déjà un compte ?
                </Typography>
                <Typography
                  component={Link}
                  href='/login'
                  variant='body2'
                  sx={{ color: 'primary.main', textDecoration: 'none' }}
                >
                  Se connecter
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationV1Wrapper>
    </Box>
  )
}

export default Register
