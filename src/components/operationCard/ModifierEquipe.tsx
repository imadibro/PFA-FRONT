import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, MenuItem as MuiMenuItem } from '@mui/material'

import { Controller, useForm } from 'react-hook-form'
import CustomTextField from '@/@core/components/mui/TextField'
import { useGetAllEmployeesQuery } from '@/store/features/employee/employeeApi'

type ModifierEquipeProps = {
  open: boolean
  onClose: () => void
}

const ModifierEquipe = ({ open, onClose }: ModifierEquipeProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const { data } = useGetAllEmployeesQuery()
  const employees = data || []

  const onSubmitEquipe = (data: any) => {
    console.log('Données soumises :', data)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Changer l'équipe</DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmitEquipe)}>
          <Grid container spacing={3} mt={1}>
            {/* Chef d'équipe */}
            <Grid item xs={12}>
              <Controller
                name='chefEquipe'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    select
                    fullWidth
                    label='Chef d’équipe *'
                    value={field.value}
                    onChange={field.onChange}
                    error={!!errors.chefEquipe}
                    helperText={errors.chefEquipe && 'Ce champ est obligatoire'}
                  >
                    {employees.map(emp => (
                      <MuiMenuItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </MuiMenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Technicien 1 */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='technicien1'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='name' value={field.value} onChange={field.onChange}>
                    {employees.map(emp => (
                      <MuiMenuItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </MuiMenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Technicien 2 */}
            <Grid item xs={12} sm={6}>
              <Controller
                name='technicien2'
                control={control}
                render={({ field }) => (
                  <CustomTextField select fullWidth label='role' value={field.value} onChange={field.onChange}>
                    {employees.map(emp => (
                      <MuiMenuItem key={emp.id} value={emp.id}>
                        {emp.name} ({emp.role?.role})
                      </MuiMenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
          </Grid>

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Annuler</Button>
            <Button type='submit' variant='contained'>
              Enregistrer
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ModifierEquipe
