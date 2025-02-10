import { Modal, Box, Typography, IconButton } from '@mui/material'

interface CustomModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='custom-modal-title'
      aria-describedby='custom-modal-description'
    >
      <Box className='bg-backgroundPaper p-6 rounded-lg shadow-lg w-[90%] max-w-lg mx-auto mt-20 relative'>
        {/* Close Button */}
        <IconButton className='absolute top-2 right-2' onClick={onClose}>
          <span className='tabler-x w-5 h-5 mr-2' />
        </IconButton>

        {/* Modal Title */}
        {title && (
          <Typography id='custom-modal-title' variant='h6' component='h2'>
            {title}
          </Typography>
        )}

        {/* Modal Content */}
        <Typography id='custom-modal-description' className='mt-2'>
          {children}
        </Typography>
      </Box>
    </Modal>
  )
}

export default CustomModal
