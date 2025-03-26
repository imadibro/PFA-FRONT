import React from 'react'
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
  activeTab: string
}

const schema = yup
  .object({
    matricule: yup.string().required('Matricule is required'),
    expireDate: yup.string().required('Expiration date is required'),
    type: yup.string().required()
  })
  .required()

export default function CardForm(props: Props) {
  const { isOpen, toggleForm, cardToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit, activeTab } = props

  const defaultValues: ICardRequest = {
    matricule: isEditMode && cardToEdit ? cardToEdit.matricule : '',
    expireDate: isEditMode && cardToEdit ? dayjs(cardToEdit.expireDate).format('YYYY-MM-DD') : '',
    type: activeTab
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
    const cardData = {
      ...data,
      type: activeTab
    }
    if (isEditMode && cardToEdit) {
      handleEdit({ ...cardData, id: cardToEdit?.id })
    } else {
      handleAdd(cardData)
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
                    value={field.value ? dayjs(field.value, 'YYYY-MM-DD') : null}
                    onChange={newValue => {
                      // Convertir la date en format ISO 8601
                      const formattedDate = newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
                      field.onChange(formattedDate)
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
