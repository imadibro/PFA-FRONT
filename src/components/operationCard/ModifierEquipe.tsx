import CustomTextField from '@/@core/components/mui/TextField'
import type { IEquipeRequest } from '@/@core/utils/types'
import { useGetAllEmployeesQuery } from '@/store/features/employee/employeeApi'
import { useGetRolesQuery } from '@/store/features/role/roleApi'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

type ModifierEquipeProps = {
  open: boolean
  onClose: () => void
  equipeToEdit: IEquipeRequest
  onSave?: (members: { id: string; name: string; role: string }[]) => void
}

const schema = yup
  .object({
    members: yup
      .array()
      .of(
        yup.object({
          id: yup.string().required('Employé requis'),
          name: yup.string().required('Employé requis'),
          role: yup.string().required('Rôle requis')
        })
      )
      .min(1, 'Au moins un employé est requis')
  })
  .required()

const ModifierEquipe = ({ open, onClose, equipeToEdit, onSave }: ModifierEquipeProps) => {
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedRole, setSelectedRole] = useState('')

  const defaultValues: Partial<IEquipeRequest> = {
    members: equipeToEdit
      ? equipeToEdit.members?.map(member => ({
          id: member.id,
          name: member.name,
          role: member.role
        }))
      : []
  }

  const {
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<Partial<IEquipeRequest>>({
    defaultValues,
    resolver: yupResolver(schema as any)
  })

  useEffect(() => {
    if (equipeToEdit) {
      reset({
        members:
          equipeToEdit.members?.map(member => ({
            id: member.id,
            name: member.name,
            role: member.role
          })) || []
      })
    }
  }, [equipeToEdit, reset])

  // ------------- Amélioration #1 -------------
  const members = watch('members') ?? []
  const { data } = useGetAllEmployeesQuery()
  const { data: roleEmployees } = useGetRolesQuery()

  const employees = data || []
  const roles = roleEmployees ?? []

  // employés disponibles = tous - déjà sélectionnés
  const employeesAvailable = useMemo(
    () => employees.filter(emp => !members.some((m: any) => m.id === emp.id)),
    [employees, members]
  )

  // si l'employé sélectionné n'est plus dispo (car déjà ajouté), on nettoie
  useEffect(() => {
    if (selectedEmployee && !employeesAvailable.some(e => e.id === selectedEmployee)) {
      setSelectedEmployee('')
      setSelectedRole('')
    }
  }, [employeesAvailable, selectedEmployee])

  const onSubmitEquipe = (data: any) => {
    onSave?.(data.members ?? [])
    reset()
    onClose()
  }

  // ------------- Amélioration #2 -------------
  const canSave = (members?.length ?? 0) > 0

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <form onSubmit={handleSubmit(onSubmitEquipe)}>
        <DialogTitle>Changer l'équipe</DialogTitle>

        <DialogContent dividers>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <Typography variant='h6' gutterBottom>
                Les membres de l'équipe
              </Typography>
              {!showAddEmployee && (
                <Button variant='outlined' onClick={() => setShowAddEmployee(true)}>
                  Ajouter un membre
                </Button>
              )}
            </Box>

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
                  {members.map((member: any, index: number) => (
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
                              members.filter((_: any, i: number) => i !== index)
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

          {showAddEmployee && (
            <Grid spacing={2} marginTop={10}>
              <Grid item xs={12} sm={12} marginBottom={3}>
                <CustomTextField
                  select
                  fullWidth
                  label='Employé'
                  value={selectedEmployee}
                  onChange={e => {
                    const empId = e.target.value
                    setSelectedEmployee(empId)
                    const emp = employees.find(x => x.id === empId)
                    setSelectedRole(emp?.role?.id || '')
                  }}
                >
                  {employeesAvailable.map(emp => (
                    <MenuItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </MenuItem>
                  ))}
                  {employeesAvailable.length === 0 && <MenuItem disabled>Aucun employé disponible</MenuItem>}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={12} marginBottom={3}>
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
                    if (members.some((m: any) => m.id === emp.id)) return // garde-fou

                    setValue('members', [
                      ...members,
                      { id: emp.id, name: `${emp.firstName} ${emp.lastName}`, role: role.role }
                    ])

                    setSelectedEmployee('')
                    setSelectedRole('')
                    setShowAddEmployee(false)
                  }}
                  disabled={!selectedEmployee || !selectedRole}
                >
                  Ajouter le membre
                </Button>
                <Button
                  style={{ marginLeft: 5 }}
                  variant='outlined'
                  color='error'
                  onClick={() => setShowAddEmployee(false)}
                >
                  Annuler
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ mt: 2 }}>
          {errors.members && (
            <Typography color='error' sx={{ mt: 2 }}>
              {errors.members.message as any}
            </Typography>
          )}
          <Button onClick={onClose}>Annuler</Button>
          <Button type='submit' variant='contained' disabled={!canSave}>
            Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModifierEquipe
