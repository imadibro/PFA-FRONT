import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid } from '@mui/material'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import * as yup from 'yup'

import CustomTextField from '@core/components/mui/TextField'

import type { ICard, ICardRequest } from '@core/utils/types'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import { formatToFrDate } from '@/@core/utils/format'

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
    expireDate: yup.date().required('Expiration date is required'),
    balance: yup
      .number()
      .typeError('Balance must be a number')
      .positive('Balance must be positive')
      .required('Balance is required')
  })
  .required()

export default function CardForm(props: Props) {
  const { isOpen, toggleForm, cardToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit } = props

  // const defaultValues: ICardRequest = {
  //   matricule: isEditMode ? (cardToEdit?.matricule ?? '') : '',
  //   expireDate: isEditMode ? (cardToEdit?.expireDate ?? '') : '',
  //   balance: isEditMode ? (cardToEdit?.balance ?? 0) : 0
  // }

  const defaultValues: ICardRequest = {
    matricule: isEditMode ? cardToEdit?.matricule : '',
    expireDate: isEditMode ? formatToFrDate(cardToEdit?.expireDate as string) : '',
    balance: isEditMode ? cardToEdit?.balance : 0
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<ICard>({
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
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Date Expiration *'
                  id='expireDate'
                  error={Boolean(errors.expireDate)}
                  aria-describedby='expireDate'
                  {...(errors.expireDate && { helperText: 'Ce champs est obligatoire' })}
                />
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
