'use client'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import { useGetAllCardsQuery } from '@/store/features/card/cardApi'
import { useGetAllEmployeesQuery } from '@/store/features/employee/employeeApi'
import { useGetRolesQuery } from '@/store/features/role/roleApi'
import { useGetAllVehiculeQuery } from '@/store/features/vehicule/vehiculeApi'
import CustomTextField from '@core/components/mui/TextField'
import type { IEquipe, IEquipeRequest } from '@core/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

interface Props {
  isOpen: boolean
  toggleForm: () => void
  handleAdd: (equipe: IEquipeRequest) => void
  handleEdit: (equipe: IEquipeRequest) => void
  cancleEditMode: () => void
  equipeToEdit: IEquipe | null
  isEditMode: boolean
}

const schema = yup
  .object({
    name: yup.string().required('Le nom est requis'),
    members: yup
      .array()
      .of(
        yup.object({
          id: yup.string().required('Employé requis'),
          name: yup.string().required('Employé requis'),
          role: yup.string().required('Rôle requis')
        })
      )
      .min(1, 'Au moins un employé est requis'),
    fuelCard: yup.string().nullable().required('Carte Gasoil requise'),
    highwayCard: yup.string().nullable().required('Carte Telepaige requise'),
    vehicule: yup.string().nullable().required('Véhicule requis'),
    selectedEmployee: yup.string().nullable().optional(),
    selectedRole: yup.string().nullable().optional()
  })
  .required()

export default function EquipeForm(props: Props) {
  const { isOpen, toggleForm, equipeToEdit, isEditMode, handleAdd, cancleEditMode, handleEdit } = props

  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const { data: cardsData } = useGetAllCardsQuery()
  const { data: vehiculesData } = useGetAllVehiculeQuery()
  const { data: employeesData } = useGetAllEmployeesQuery()
  const { data: roleEmployees } = useGetRolesQuery()

  const cards = cardsData ?? []
  const vehicules = vehiculesData ?? []
  const employees = employeesData ?? []
  const roles = roleEmployees ?? []

  const defaultValues: IEquipeRequest = {
    name: isEditMode && equipeToEdit ? equipeToEdit.name : '',
    members:
      isEditMode && equipeToEdit
        ? equipeToEdit.members.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role
          }))
        : [],

    fuelCard: isEditMode && equipeToEdit && equipeToEdit.fuelCard?.matricule ? equipeToEdit.fuelCard.id || '' : '',
    highwayCard:
      isEditMode && equipeToEdit && equipeToEdit.highwayCard?.matricule ? equipeToEdit.highwayCard.id || '' : '',
    vehicule: isEditMode && equipeToEdit && equipeToEdit.vehicule?.registrationId ? equipeToEdit.vehicule.id || '' : ''
  }

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<IEquipeRequest>({
    defaultValues,
    resolver: yupResolver(schema)
  })

  // Récupère la valeur actuelle des membres depuis le form
  const members = watch('members')

  const onSubmit: SubmitHandler<IEquipeRequest> = data => {
    const payload = {
      name: data.name,
      members: data.members,
      fuelCardId: data.fuelCard || null,
      highwayCardId: data.highwayCard || null,
      vehiculeId: data.vehicule || null
    }
    if (isEditMode && equipeToEdit) {
      handleEdit({ ...payload, id: equipeToEdit.id } as any)
    } else {
      handleAdd(payload as any)
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
    <SidebarDrawerForm
      headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} Equipe`}
      open={isOpen}
      toggle={toggle}
      customWidth='600px'
    >
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
                  label='Nom Equipe'
                  id='name'
                  error={Boolean(errors.name)}
                  aria-describedby='name'
                  {...(errors.name && { helperText: 'Ce champs est obligatoire' })}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomTextField
              select
              fullWidth
              label='Employé'
              value={selectedEmployee}
              onChange={e => {
                const empId = e.target.value
                setSelectedEmployee(empId)

                // Récupère le rôle automatiquement
                const emp = employees.find(e => e.id === empId)
                if (emp?.role?.id) {
                  setSelectedRole(emp.role.id)
                } else {
                  setSelectedRole('')
                }
              }}
            >
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={12} sm={12}>
            <CustomTextField
              select
              fullWidth
              label='Rôle'
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.role}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button
              variant='outlined'
              onClick={() => {
                const emp = employees.find(e => e.id === selectedEmployee)
                const role = roles.find(r => r.id === selectedRole)
                if (!emp || !role) return

                setValue('members', [
                  ...(watch('members') || []),
                  {
                    id: emp.id,
                    name: emp.firstName + ' ' + emp.lastName,
                    role: role.role
                  }
                ])

                setSelectedEmployee('')
                setSelectedRole('')
              }}
              disabled={!selectedEmployee || !selectedRole}
            >
              Ajouter le membre
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant='h6' gutterBottom>
              Les membres de l'équipe
            </Typography>
            {members && members.length > 0 ? (
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Rôle</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.role || 'Aucun rôle sélectionné'}</TableCell>
                      <TableCell align='right'>
                        <Button
                          size='small'
                          color='error'
                          onClick={() =>
                            setValue(
                              'members',
                              members.filter((_, i) => i !== index)
                            )
                          }
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography>Aucun membre ajouté</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='vehicule'
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
                  label='Vehicule'
                  id='vehicule'
                  error={Boolean(errors.vehicule)}
                  aria-describedby='vehicule'
                  {...(errors.vehicule && { helperText: 'Ce champs est obligatoire' })}
                >
                  {vehicules &&
                    vehicules.map(vehicule => (
                      <MenuItem key={vehicule.id} value={vehicule.id}>
                        {vehicule.registrationId}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='fuelCard'
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
                  label='Carte Gasoil'
                  id='fuelCard'
                  error={Boolean(errors.fuelCard)}
                  aria-describedby='type'
                  {...(errors.fuelCard && { helperText: 'Ce champs est obligatoire' })}
                >
                  {cards &&
                    cards
                      .filter(card => card.type === 'gasoil')
                      .map(card => (
                        <MenuItem key={card.id} value={card.id}>
                          {card.matricule}
                        </MenuItem>
                      ))}
                </CustomTextField>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='highwayCard'
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
                  label='Carte Telepaige'
                  id='highwayCard'
                  error={Boolean(errors.highwayCard)}
                  aria-describedby='highwayCard'
                  {...(errors.highwayCard && { helperText: 'Ce champs est obligatoire' })}
                >
                  {cards &&
                    cards
                      .filter(card => card.type === 'autoroute')
                      .map(card => (
                        <MenuItem key={card.id} value={card.id}>
                          {card.matricule}
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
