import React from 'react'
import { formatToShowingCardDate } from '@/@core/utils/format'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import CustomTextField from '@core/components/mui/TextField'
import type { ICard, ICardRequest } from '@core/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid } from '@mui/material'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

interface Props {
  isOpen: boolean
  toggleForm: () => void
  handleAdd: (card: ICardRequest) => void
  handleEdit: (card: ICardRequest) => void
  cancleEditMode: () => void
  cardToEdit: ICard | null
  isEditMode: boolean
}

const schema = yup
  .object({
    matricule: yup.string().required('Matricule is required'),
    expireDate: yup.string().required('Expiration date is required'),
    //   if (!value) return false

    //   // Check format using regex
    //   if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false

    //   // Parse the date parts
    //   const [day, month, year] = value.split('/').map(Number)

    //   // Check if it's a valid date (e.g., not 31/02/2023)
    //   const date = new Date(year, month - 1, day)
    //   return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    // })
    // .test('is-future-date', 'Expiration date must be in the future', value => {
    //   if (!value) return false

    //   // Parse the date
    //   const [day, month, year] = value.split('/').map(Number)
    //   const date = new Date(year, month - 1, day)

    //   // Compare with current date (without time)
    //   const today = new Date()
    //   today.setHours(0, 0, 0, 0)

    //   return date >= today
    // }),
    balance: yup
      .number()
      .typeError('Balance must be a number')
      .positive('Balance must be positive')
      .required('Balance is required')
  })
  .required()

export default function CardForm(props: Props) {
  const { isOpen, toggleForm, cardToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit } = props

  const defaultValues: ICardRequest = {
    matricule: isEditMode && cardToEdit ? cardToEdit.matricule : '',
    expireDate: isEditMode && cardToEdit ? formatToShowingCardDate(cardToEdit?.expireDate as string) : '',
    balance: isEditMode && cardToEdit ? cardToEdit?.balance : 0
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ICardRequest>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<ICardRequest> = data => {
    if (isEditMode && cardToEdit) {
      handleEdit({ ...data, id: cardToEdit?.id })
    } else {
      handleAdd(data)
      console.log(data)
    }

    reset()
    toggleForm()
  }

  const toggle = () => {
    if (isEditMode) {
      cancleEditMode()
    }

    toggleForm()
  }

  return (
    <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} Carte`} open={isOpen} toggle={toggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Controller
              name='matricule'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Matricule *'
                  id='matricule'
                  error={Boolean(errors.matricule)}
                  aria-describedby='matricule'
                  {...(errors.matricule && { helperText: 'Ce champs est obligatoire' })}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='expireDate'
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={['year', 'month']}
                    label='Date Expiration *'
                    format='MM/YYYY'
                    value={field.value ? dayjs(field.value, 'MM-YYYY') : null}
                    onChange={newValue => {
                      field.onChange(newValue ? newValue.format('MM-YYYY') : '')
                    }}
                    minDate={dayjs()}
                    maxDate={dayjs().add(5, 'year')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(errors.expireDate),
                        helperText: errors.expireDate?.message,
                        InputProps: {
                          placeholder: ''
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='balance'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Balance *'
                  id='balance'
                  error={Boolean(errors.balance)}
                  aria-describedby='Balance'
                  {...(errors.balance && { helperText: 'Ce champs est obligatoire' })}
                />
              )}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button fullWidth type='submit' variant='contained'>
              {isEditMode ? 'Modifier' : 'Ajouter'}
            </Button>
          </Grid>
          <Grid item xs={6} sm={6}>
            <Button fullWidth onClick={toggle} style={{ marginLeft: 3 }} variant='outlined' color='error'>
              Annuler
            </Button>
          </Grid>
        </Grid>
      </form>
    </SidebarDrawerForm>
  )
}
