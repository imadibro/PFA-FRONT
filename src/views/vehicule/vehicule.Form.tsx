'use client'

import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, MenuItem } from '@mui/material'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import CustomTextField from '@core/components/mui/TextField'
import type { IVehicule, IVehiculeOwner, IVehiculeRequest, IVehiculeType } from '@core/utils/types'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import { vehiculeOwnerService, vehiculeTypeService } from '@/@core/services'

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
    cost: yup.string().required('Le coût est requis'),
    owner: yup.string().required('Le propriétaire est requis'),
    type: yup.string().required('Le type est requis')
  })
  .required()

export default function VehiculeForm(props: Props) {
  const { isOpen, toggleForm, vehiculeToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit } = props

  const [owners, setOwners] = useState<IVehiculeOwner[]>([])
  const [types, setTypes] = useState<IVehiculeType[]>([])

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

  // const defaultValues: IVehiculeRequest = {
  //   registrationId: isEditMode ? vehiculeToEdit?.registrationId : '',
  //   cost: isEditMode ? vehiculeToEdit?.cost : 0,
  //   owner: isEditMode ? vehiculeToEdit?.owner : { id: '', name: '' },
  //   type: isEditMode ? vehiculeToEdit?.type : { id: '', vehicule_type: '' }
  // }

  const defaultValues: IVehiculeRequest = {
    registrationId: isEditMode && vehiculeToEdit ? vehiculeToEdit.registrationId : '',
    cost: isEditMode && vehiculeToEdit ? vehiculeToEdit.cost : 0,
    owner: isEditMode && vehiculeToEdit && vehiculeToEdit.owner.name ? vehiculeToEdit.owner.id : '',
    type: isEditMode && vehiculeToEdit && vehiculeToEdit.type.vehicule_type ? vehiculeToEdit.type.id : ''
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IVehicule>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  const onSubmit: SubmitHandler<IVehiculeRequest> = data => {
    if (isEditMode && vehiculeToEdit) {
      handleEdit({ ...data, id: vehiculeToEdit?.id })
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
              name='cost'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Cout de véhicule *'
                  id='cost'
                  error={Boolean(errors.cost)}
                  aria-describedby='cost'
                  {...(errors.cost && { helperText: 'Ce champs est obligatoire' })}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='owner'
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
                  id='owner'
                  error={Boolean(errors.owner)}
                  aria-describedby='owner'
                  {...(errors.owner && { helperText: 'Ce champs est obligatoire' })}
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
              name='type'
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
                  id='type'
                  error={Boolean(errors.type)}
                  aria-describedby='type'
                  {...(errors.type && { helperText: 'Ce champs est obligatoire' })}
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
