'use client'

import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import { useGetAllVehiculeOwnerQuery } from '@/store/features/vehicule-owner/vehiculeOwnerApi'
import { useGetAllVehiculeTypeQuery } from '@/store/features/vehicule-type/vehiculeTypeApi'
import { useGetVehiculeModelQuery } from '@/store/features/vehicule/vehiculeApi'
import CustomTextField from '@core/components/mui/TextField'
import type { IVehicule, IVehiculeRequest } from '@core/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  isOpen: boolean
  toggleForm: () => void
  handleAdd: (vehicule: IVehiculeRequest) => void
  handleEdit: (vehicule: IVehiculeRequest) => void
  cancleEditMode: () => void
  vehiculeToEdit: IVehicule | null
  isEditMode: boolean
}

const schema = yup
  .object({
    registrationId: yup.string().required('Registration est requis'),
    vehiculeOwner: yup.string().required('Le propriétaire est requis'),
    vehiculeType: yup.string().required('Le type est requis'),
    vehiculeModel: yup.string().nullable()
  })
  .required()

export default function VehiculeForm(props: Props) {
  const { isOpen, toggleForm, vehiculeToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit } = props

  const { data: vehiculeModel } = useGetVehiculeModelQuery()
  const vehiculeModels = vehiculeModel ?? []
  const { data: vehiculeOwners = [] } = useGetAllVehiculeOwnerQuery()
  const { data: vehiculeTypes = [] } = useGetAllVehiculeTypeQuery()

  const defaultValues: IVehiculeRequest = {
    registrationId: isEditMode && vehiculeToEdit ? vehiculeToEdit.registrationId : '',
    vehiculeOwner:
      isEditMode && vehiculeToEdit && vehiculeToEdit.vehiculeOwner.name ? vehiculeToEdit.vehiculeOwner.id || '' : '',
    vehiculeType:
      isEditMode && vehiculeToEdit && vehiculeToEdit.vehiculeType.vehicule_type
        ? vehiculeToEdit.vehiculeType.id || ''
        : '',
    // vehiculeModel:
    //   isEditMode && vehiculeToEdit && vehiculeToEdit.vehiculeModel.name ? vehiculeToEdit.vehiculeModel.id || '' : ''

    vehiculeModel:
      isEditMode && vehiculeToEdit && vehiculeToEdit.vehiculeModel?.name
        ? vehiculeToEdit.vehiculeModel.id || null
        : null
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IVehiculeRequest>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  // const onSubmit: SubmitHandler<IVehiculeRequest> = async data => {
  //   if (isEditMode && vehiculeToEdit) {
  //     await handleEdit({ ...data, id: vehiculeToEdit?.id })
  //   } else {
  //     await handleAdd(data)
  //   }

  //   reset()
  //   toggleForm()
  // }

  const onSubmit: SubmitHandler<IVehiculeRequest> = async data => {
    const payload = {
      ...data,
      vehiculeModel: data.vehiculeModel || null // <-- null si vide
    }
    if (isEditMode && vehiculeToEdit) {
      await handleEdit({ ...payload, id: vehiculeToEdit?.id })
    } else {
      await handleAdd(payload)
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
    <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} vehicule`} open={isOpen} toggle={toggle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Controller
              name='registrationId'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Registration de véhicule *'
                  id='registrationId'
                  error={Boolean(errors.registrationId)}
                  aria-describedby='registrationId'
                  {...(errors.registrationId && { helperText: 'Ce champs est obligatoire' })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='vehiculeOwner'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  size='small'
                  options={vehiculeOwners || []}
                  getOptionLabel={option => option.name || ''}
                  value={vehiculeOwners?.find(owner => owner.id === value) || null}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : null)
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Proprieter associé *'
                      error={Boolean(error)}
                      helperText={error ? 'Ce champs est obligatoire' : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='vehiculeType'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  size='small'
                  options={vehiculeTypes || []}
                  getOptionLabel={option => option.vehicule_type || ''}
                  value={vehiculeTypes?.find(type => type.id === value) || null}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : null)
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Type associé *'
                      error={Boolean(error)}
                      helperText={error ? 'Ce champs est obligatoire' : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='vehiculeModel'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  size='small'
                  options={vehiculeModels || []}
                  getOptionLabel={option => option.name || ''}
                  value={vehiculeModels?.find(model => model.id === value) || null}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : null)
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Le model'
                      error={Boolean(error)}
                      helperText={error ? 'Ce champs est obligatoire' : ''}
                    />
                  )}
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
