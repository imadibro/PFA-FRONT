// import React from 'react'
// import { Box, Typography, Stack, IconButton, Menu, MenuItem, Chip, ListItemIcon } from '@mui/material'
// import { MapPin, MoreVertical } from 'lucide-react'
// import type { IOperation } from '@/@core/utils/types'

// export default function OperationHeader({
//   operation,
//   onDelete
// }: {
//   operation: IOperation
//   onDelete: (id: string) => void
// }) {
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
//   const open = Boolean(anchorEl)
//   const [opens, setOpens] = React.useState(false)

//   const handleClickOpen = () => {
//     setOpens(true)
//   }
//   const handleClose = () => {
//     setOpens(false)
//   }

//   const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget)
//   }

//   const handleMenuClose = () => {
//     setAnchorEl(null)
//   }

//   const handleChangeEquipe = () => {
//     console.log('Changer équipe')
//     handleMenuClose()
//   }

//   const handleChangeOperation = () => {
//     console.log('Changer opération')
//     handleMenuClose()
//   }

//   const handleDelete = () => {
//     if (operation && onDelete) {
//       onDelete(operation.id)
//     }
//     handleMenuClose()
//   }

//   return (
//     <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
//       {/* Left: project + site */}
//       <Box sx={{ minWidth: 0 }}>
//         <Typography variant='subtitle1' fontWeight={600} noWrap>
//           {operation?.project?.projectCode}
//         </Typography>
//         <Stack direction='row' spacing={0.5} alignItems='center'>
//           <MapPin size={14} />
//           <Typography variant='body2' noWrap>
//             {operation?.site?.siteNbr}
//           </Typography>
//         </Stack>
//       </Box>

//       {/* Right: tasks + menu */}
//       <Stack direction='row' spacing={1} alignItems='center'>
//         <Chip
//           label={`${operation?.operationTasks?.operationTasksIds?.length || 0} tasks`}
//           size='small'
//           color='primary'
//         />
//         <IconButton size='small' onClick={handleMenuOpen}>
//           <MoreVertical size={18} />
//         </IconButton>
//         <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
//           <MenuItem onClick={handleChangeOperation}>
//             <ListItemIcon>
//               <i className='tabler-eye' />
//             </ListItemIcon>
//             Affichier detailes
//           </MenuItem>
//           <MenuItem onClick={handleChangeEquipe}>
//             <ListItemIcon>
//               <i className='tabler-edit' />
//             </ListItemIcon>
//             Changer équipe
//           </MenuItem>
//           <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
//             <ListItemIcon>
//               <i className='tabler-trash' />
//             </ListItemIcon>
//             Supprimer
//           </MenuItem>
//         </Menu>
//       </Stack>
//     </Stack>
//   )
// }

import React from 'react'
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider
} from '@mui/material'
import { MapPin, MoreVertical } from 'lucide-react'
import type { IOperation } from '@/@core/utils/types'
import ModifierEquipe from './ModifierEquipe'

export default function OperationHeader({
  operation,
  onDelete
}: {
  operation: IOperation
  onDelete: (id: string) => void
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
    onDelete(operation.id)
    handleMenuClose()
  }

  /* ---------------------------- UI ------------------------------ */
  return (
    <>
      {/* En‑tête de la carte */}
      <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
        {/* Gauche : Projet + site */}
        <Box sx={{ minWidth: 0 }}>
          <Typography variant='subtitle1' fontWeight={600} noWrap>
            {operation.project.projectCode}
          </Typography>
          <Stack direction='row' spacing={0.5} alignItems='center'>
            <MapPin size={14} />
            <Typography variant='body2' noWrap>
              {operation.site.siteNbr}
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
            <MoreVertical size={18} />
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
            <Typography variant='h6'>{operation.project.projectCode}</Typography>

            <Stack direction='row' spacing={0.5} alignItems='center'>
              <MapPin size={16} />
              <Typography variant='body2'>Site : {operation.site.siteNbr}</Typography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Typography variant='subtitle2'>Équipe</Typography>
            <Stack direction='row' spacing={1} flexWrap='wrap'>
              {operation?.equipe?.members?.map(m => <Chip key={m.id} label={`${m.name} (${m.role})`} size='small' />)}
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Typography variant='body2'>
              Matricule : {operation?.equipe?.vehicule ? operation?.equipe?.vehicule?.registrationId : 'N/A'}
            </Typography>
            <Typography variant='body2'>
              Carte gasoil: {operation?.equipe?.fuelCard ? operation?.equipe?.fuelCard?.matricule : 'N/A'}
            </Typography>
            <Typography variant='body2'>
              Badge telepaige: {operation?.equipe?.highwayCard ? operation?.equipe?.highwayCard?.matricule : 'N/A'}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDetails}>Fermer</Button>
        </DialogActions>
      </Dialog>

      <ModifierEquipe open={showEquipeDialog} onClose={() => setShowEquipeDialog(false)} />
    </>
  )
}
