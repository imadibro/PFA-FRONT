import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid } from '@mui/material'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import CustomTextField from '@core/components/mui/TextField'
import type { IVehiculeOwner, IVehiculeOwnerRequest } from '@core/utils/types'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'

interface Props {
  isOpen: boolean
  toggleForm: () => void
  handleAdd: (card: IVehiculeOwnerRequest) => void
  handleEdit: (card: IVehiculeOwnerRequest) => void
  cancleEditMode: () => void
  vehiculeOwnerToEdit: IVehiculeOwner | null
  isEditMode: boolean
}

const schema = yup
  .object({
    name: yup.string().required('Name is required'),
  })
  .required()

export default function VehiculeOwnerForm(props: Props) {
  const { isOpen, toggleForm, vehiculeOwnerToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit } = props

  // const defaultValues: ICardRequest = {
  //   matricule: isEditMode ? (cardToEdit?.matricule ?? '') : '',
  //   expireDate: isEditMode ? (cardToEdit?.expireDate ?? '') : '',
  //   balance: isEditMode ? (cardToEdit?.balance ?? 0) : 0
  // }

  const defaultValues: IVehiculeOwnerRequest = {
    name: isEditMode ? (vehiculeOwnerToEdit?.name ?? '') : ''
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IVehiculeOwner>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<IVehiculeOwnerRequest> = data => {
    if (isEditMode && vehiculeOwnerToEdit) {
      handleEdit({ ...data, id: vehiculeOwnerToEdit?.id })
    } else {
      handleAdd(data)
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
    <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} propriétaire`} open={isOpen} toggle={toggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Propriétaire du véhicule *'
                  id='name'
                  error={Boolean(errors.name)}
                  aria-describedby='name'
                  {...(errors.name && { helperText: 'Ce champs est obligatoire' })}
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
