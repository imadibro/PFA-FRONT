import type { IEquipe, IEquipeRequest, IOperation } from '@/@core/utils/types'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material'
import { MapPin, MoreVertical } from 'lucide-react'
import React from 'react'
import ModifierEquipe from './ModifierEquipe'

export default function OperationHeader({
  operation,
  onDelete,
  equipe,
  onMembersSave
}: {
  operation: IOperation & { eventId?: string }
  onDelete: (eventId: string, operationId: string) => void
  equipe?: IEquipe
  onMembersSave?: (members: { id: string; name: string; role: string }[]) => void
}) {
  /* ---------------------------- MENU ---------------------------- */
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  /* --------------------------- DIALOG --------------------------- */
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [showEquipeDialog, setShowEquipeDialog] = React.useState(false)

  const openDetails = () => {
    setDetailsOpen(true) // ouvre le Dialog
    handleMenuClose() // ferme le menu
  }
  const closeDetails = () => setDetailsOpen(false)

  /* --------------------------- ACTIONS -------------------------- */
  const handleChangeEquipe = () => {
    setShowEquipeDialog(true)
    handleMenuClose()
  }

  const handleDelete = () => {
    onDelete(operation.eventId!, operation.id!)
    handleMenuClose()
  }

  /* ---------------------------- UI ------------------------------ */
  return (
    <>
      {/* En‑tête de la carte */}
      <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
        {/* Gauche : Projet + site */}
        <Box sx={{ minWidth: 0 }}>
          <Typography className='text-white' variant='subtitle1' fontWeight={600} noWrap>
            {operation?.project?.projectCode}
          </Typography>
          <Stack direction='row' spacing={0.5} alignItems='center'>
            <MapPin className='text-white' size={14} />
            <Typography className='text-white' variant='body2' noWrap>
              {operation?.site?.siteNbr}
            </Typography>
          </Stack>
        </Box>

        {/* Droite : tâches + menu */}
        <Stack direction='row' spacing={1} alignItems='center'>
          {/* <Chip
            label={`${operation?.operationTasks?.operationTasksIds?.length || 0} tasks`}
            size='small'
            color='primary'
          /> */}
          <IconButton size='small' onClick={handleMenuOpen}>
            <MoreVertical className='text-white' size={18} />
          </IconButton>

          {/* Menu contextuel */}
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={openDetails}>
              <ListItemIcon>
                <i className='tabler-eye' />
              </ListItemIcon>
              Afficher détails
            </MenuItem>

            <MenuItem onClick={handleChangeEquipe}>
              <ListItemIcon>
                <i className='tabler-edit' />
              </ListItemIcon>
              Changer équipe
            </MenuItem>

            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <i className='tabler-trash' />
              </ListItemIcon>
              Supprimer
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>

      {/* Dialog de détails */}
      <Dialog open={detailsOpen} onClose={closeDetails} maxWidth='sm' fullWidth>
        <DialogTitle>Détails de l’opération</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1}>
            <Typography variant='h6'>Code projet : {operation?.project?.projectCode}</Typography>

            <Typography variant='h6'>
              {' '}
              Operation :{' '}
              {`${operation.operationTasks.operationZone.label} - ${operation.operationTasks.operationTrans.label} - ${operation.operationTasks.operationType.label}`}{' '}
            </Typography>
            <Typography variant='body2'>
              {' '}
              nombre de tâches : {operation?.operationTasks?.operationTasksIds?.length || 0} tâches
            </Typography>

            <Stack direction='row' spacing={0.5} alignItems='center'>
              <MapPin size={16} />
              <Typography variant='body2'>Site : {operation?.site?.siteNbr}</Typography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Typography variant='subtitle2'>Équipe</Typography>
            <Stack direction='row' spacing={1} flexWrap='wrap'>
              {equipe?.members?.map(m => <Chip key={m.id} label={`${m.name} (${m.role})`} size='small' />)}
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Typography variant='body2'>
              Vehicule : {equipe?.vehicule ? equipe?.vehicule?.registrationId : 'N/A'}
            </Typography>
            <Typography variant='body2'>
              Carte gasoil : {equipe?.fuelCard ? equipe?.fuelCard?.matricule : 'N/A'}
            </Typography>
            <Typography variant='body2'>
              Badge télépéage : {equipe?.highwayCard ? equipe?.highwayCard?.matricule : 'N/A'}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDetails}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <ModifierEquipe
        equipeToEdit={{ ...equipe } as IEquipeRequest}
        open={showEquipeDialog}
        onClose={() => setShowEquipeDialog(false)}
        onSave={onMembersSave}
      />
    </>
  )
}
