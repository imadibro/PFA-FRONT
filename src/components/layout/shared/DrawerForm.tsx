import type { ReactNode } from 'react'

import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import type { BoxProps } from '@mui/material/Box';
import Box from '@mui/material/Box'

import Icon from '@core/components/icon'

interface SidebarDrawerFormType {
  open: boolean
  headerTitle: string
  children: ReactNode
  toggle: () => void
  customWidth?: string
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const SidebarDrawerForm = (props: SidebarDrawerFormType) => {
  const { open, toggle, headerTitle, children, customWidth } = props

  const handleClose = () => {
    toggle()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='persistent'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: customWidth ? customWidth : { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>{headerTitle}</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>{children}</Box>
    </Drawer>
  )
}

export default SidebarDrawerForm
