'use client'

import React from 'react'
import Typography from '@mui/material/Typography'
import {
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField
} from '@mui/material'
import Box from '@mui/material/Box'
import { useUpdateClientOrderMutation } from '@/store/features/clientOrder/clientOrderApi'
import type { SystemMode } from '@core/types'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { IOrderStatus, IClient, IOperation, IProject, ISite } from '@/@core/utils/types'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Alert from '@mui/material/Alert'

const UpdateClientOrder = ({
  mode,
  clients,
  sites,
  projects,
  operations,
  clientOrderToEdit,
  close
}: {
  mode: SystemMode
  clients: IClient[]
  sites: ISite[]
  projects: IProject[]
  operations: IOperation[]
  clientOrderToEdit: any // Replace with your proper type
  close: () => void
}) => {
  const [selectedClient, setSelectedClient] = React.useState<IClient | null>(clientOrderToEdit?.client || null)
  const [selectedSite, setSelectedSite] = React.useState<ISite | null>(clientOrderToEdit?.site || null)
  const [selectedProject, setSelectedProject] = React.useState<IProject | null>(clientOrderToEdit?.project || null)
  const [selectedOperation, setSelectedOperation] = React.useState<IOperation | null>(
    clientOrderToEdit?.operation || null
  )
  const [orderDate, setOrderDate] = React.useState<Dayjs | null | undefined>(
    clientOrderToEdit?.orderDate ? dayjs(clientOrderToEdit.orderDate) : dayjs()
  )
  const [status, setStatus] = React.useState<IOrderStatus>(clientOrderToEdit?.status || 'Brouillon')

  const { showAlert, showToast } = useSweetAlert()

  const [updateClientOrder, { isLoading, isError, error, isSuccess }] = useUpdateClientOrderMutation()

  const handleUpdateClientOrderSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const orderReference = formData.get('orderReference') as string
    const notes = formData.get('notes') as string
    const totalAmount = formData.get('totalAmount') as string

    if (!selectedClient || !selectedSite || !selectedProject || !selectedOperation) {
      showAlert('', 'Veuillez sélectionner tous les champs obligatoires', 'error')
      return
    }

    if (!clientOrderToEdit?.id) return

    try {
      await updateClientOrder({
        id: clientOrderToEdit.id,
        orderReference,
        orderDate: orderDate?.toISOString() || new Date().toISOString(),
        totalAmount: parseFloat(totalAmount),
        notes,
        status,
        client: selectedClient,
        site: selectedSite,
        project: selectedProject,
        operation: selectedOperation
      }).unwrap()

      showToast('Commande client mise à jour avec succès!', 'success')
      close()
    } catch (err) {
      showAlert('Error', "Une erreur s'est produite lors de la mise à jour de la commande client", 'error')
    }
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', p: 4, minWidth: 450 }}>
      <IconButton onClick={close} sx={{ position: 'absolute', top: 8, left: 8 }}>
        <i className='tabler-x' />
      </IconButton>
      <Typography variant='h4' className='my-4 mt-10'>
        Mettre à jour la commande client
      </Typography>

      <div className='bg-backgroundPaper'>
        <form onSubmit={handleUpdateClientOrderSubmit}>
          {isError && (
            <Alert severity='error' className='mb-4'>
              {(error as any)?.data?.message || 'Échec de la mise à jour de la commande client'}
            </Alert>
          )}

          <div className='mb-4'>
            <TextField
              size='small'
              name='orderReference'
              label='Référence commande'
              placeholder='Référence'
              required
              fullWidth
              defaultValue={clientOrderToEdit?.orderReference}
            />
          </div>

          <div className='mb-4'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label='Date de commande'
                value={orderDate}
                onChange={newValue => setOrderDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </div>

          <div className='mb-4'>
            <FormControl fullWidth size='small'>
              <InputLabel>Client</InputLabel>
              <Select
                value={selectedClient?.id || ''}
                label='Client'
                onChange={e => {
                  const client = clients.find(c => c.id === e.target.value)
                  setSelectedClient(client || null)
                }}
                required
              >
                {clients.map(client => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.clientReference}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='mb-4'>
            <FormControl fullWidth size='small'>
              <InputLabel>Site</InputLabel>
              <Select
                value={selectedSite?.id || ''}
                label='Site'
                onChange={e => {
                  const site = sites.find(s => s.id === e.target.value)
                  setSelectedSite(site || null)
                }}
                required
              >
                {sites.map(site => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='mb-4'>
            <FormControl fullWidth size='small'>
              <InputLabel>Projet</InputLabel>
              <Select
                value={selectedProject?.id || ''}
                label='Projet'
                onChange={e => {
                  const project = projects.find(p => p.id === e.target.value)
                  setSelectedProject(project || null)
                }}
                required
              >
                {projects.map(project => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.projectCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='mb-4'>
            <FormControl fullWidth size='small'>
              <InputLabel>Opération</InputLabel>
              <Select
                value={selectedOperation?.id || ''}
                label='Opération'
                onChange={e => {
                  const operation = operations.find(o => o.id === e.target.value)
                  setSelectedOperation(operation || null)
                }}
                required
              >
                {operations.map(operation => (
                  <MenuItem key={operation.id} value={operation.id}>
                    {operation.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='mb-4'>
            <TextField
              type='number'
              size='small'
              name='totalAmount'
              label='Montant total'
              placeholder='0.00'
              required
              fullWidth
              defaultValue={clientOrderToEdit?.totalAmount}
              inputProps={{
                step: '0.01',
                min: '0'
              }}
            />
          </div>

          <div className='mb-4'>
            <FormControl fullWidth size='small'>
              <InputLabel>Statut</InputLabel>
              <Select value={status} label='Statut' onChange={e => setStatus(e.target.value as IOrderStatus)} required>
                {['Brouillon', 'En attente', 'Confirmé', 'En cours', 'Terminé', 'Annulé'].map(statusValue => (
                  <MenuItem key={statusValue} value={statusValue}>
                    {statusValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='mb-4'>
            <TextField
              size='small'
              name='notes'
              label='Notes'
              placeholder='Notes supplémentaires'
              rows={4}
              fullWidth
              multiline
              defaultValue={clientOrderToEdit?.notes}
            />
          </div>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button disabled={isLoading} variant='outlined' size='small' onClick={close} className='h-10 mt-4 w-full'>
              Annuler
            </Button>
            <Button disabled={isLoading} variant='contained' size='small' className='h-10 mt-4 w-full' type='submit'>
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </Box>
        </form>
      </div>
    </Box>
  )
}

export default UpdateClientOrder
