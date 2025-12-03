import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'

export default function CreateSiteModal({ open, onClose, onSubmit }: any) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { label: '', siteNbr: '' }
  })

  const submit = (data: any) => {
    onSubmit(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Créer un site</DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label='Label' {...register('label', { required: true })} fullWidth />
        <TextField label='Numéro' {...register('siteNbr', { required: true })} fullWidth />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant='contained' color='error'>
          Annuler
        </Button>
        <Button onClick={handleSubmit(submit)} variant='contained' color='primary'>
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  )
}
