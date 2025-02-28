import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid } from '@mui/material'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import CustomTextField from '@core/components/mui/TextField'
import type { IVehiculeType, IVehiculeTypeRequest } from '@core/utils/types'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'

interface Props {
  isOpen: boolean
  toggleForm: () => void
  handleAdd: (card: IVehiculeTypeRequest) => void
  handleEdit: (card: IVehiculeTypeRequest) => void
  cancleEditMode: () => void
  vehiculeTypeToEdit: IVehiculeType | null
  isEditMode: boolean
}

const schema = yup
  .object({
    vehicule_type: yup.string().required('Type is required'),
  })
  .required()

export default function VehiculeTypeForm(props: Props) {
  const { isOpen, toggleForm, vehiculeTypeToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit } = props

  const defaultValues: IVehiculeTypeRequest = {
    vehicule_type: isEditMode ? (vehiculeTypeToEdit?.vehicule_type ?? '') : ''
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IVehiculeType>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<IVehiculeTypeRequest> = data => {
    if (isEditMode && vehiculeTypeToEdit) {
      handleEdit({ ...data, id: vehiculeTypeToEdit?.id })
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
    <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} type du vehicule`} open={isOpen} toggle={toggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Controller
              name='vehicule_type'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Type de véhicule *'
                  id='vehicule_type'
                  error={Boolean(errors.vehicule_type)}
                  aria-describedby='vehicule_type'
                  {...(errors.vehicule_type && { helperText: 'Ce champs est obligatoire' })}
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
