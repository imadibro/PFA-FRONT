'use client'

import { vehiculeOwnerService, vehiculeTypeService } from '@/@core/services'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import { useGetVehiculeModelQuery } from '@/store/features/vehicule/vehiculeApi'
import CustomTextField from '@core/components/mui/TextField'
import type { IVehicule, IVehiculeOwner, IVehiculeRequest, IVehiculeType } from '@core/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'
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

  const [owners, setOwners] = useState<IVehiculeOwner[]>([])
  const [types, setTypes] = useState<IVehiculeType[]>([])

  const { data } = useGetVehiculeModelQuery()

  const vehiculeModels = data ?? []

  useEffect(() => {
    vehiculeOwnerService.getAllOwners().then(data => {
      setOwners(data)
    })
  }, [])

  useEffect(() => {
    vehiculeTypeService.getAllType().then(data => {
      setTypes(data)
    })
  }, [])

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
  //   console.log(data)
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
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  SelectProps={{
                    value,
                    onChange: e => onChange(e.target.value)
                  }}
                  fullWidth
                  label='Proprieter associé *'
                  id='vehiculeOwner'
                  error={Boolean(errors.vehiculeOwner)}
                  aria-describedby='owner'
                  {...(errors.vehiculeOwner && { helperText: 'Ce champs est obligatoire' })}
                >
                  {owners &&
                    owners.map(owner => (
                      <MenuItem key={owner.id} value={owner.id}>
                        {owner.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='vehiculeType'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  SelectProps={{
                    value,
                    onChange: e => onChange(e)
                  }}
                  fullWidth
                  label='Type associé *'
                  id='vehiculeType'
                  error={Boolean(errors.vehiculeType)}
                  aria-describedby='type'
                  {...(errors.vehiculeType && { helperText: 'Ce champs est obligatoire' })}
                >
                  {types &&
                    types.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.vehicule_type}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='vehiculeModel'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  SelectProps={{
                    value,
                    onChange: e => onChange(e.target.value)
                  }}
                  fullWidth
                  label='Le model'
                  id='vehiculeModel'
                  error={Boolean(errors.vehiculeModel)}
                  aria-describedby='vehiculeModel'
                  {...(errors.vehiculeModel && { helperText: 'Ce champs est obligatoire' })}
                >
                  {vehiculeModels &&
                    vehiculeModels.map(model => (
                      <MenuItem key={model.id} value={model.id}>
                        {model.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
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
