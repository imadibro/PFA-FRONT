'use client'

import React from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Slide from '@mui/material/Slide'

import { CURRENCY_SYMBOLS } from './types'
import { useGlobalHorizon } from './GlobalHorizonContext'

const BookingToastNotification = () => {
  const { toastData, dismissToast, setActiveTab } = useGlobalHorizon()

  const sym = CURRENCY_SYMBOLS[toastData.currency]

  return (
    <Slide direction='left' in={toastData.visible} mountOnEnter unmountOnExit>
      <Paper
        elevation={12}
        sx={{
          position: 'fixed',
          top: 80,
          right: 20,
          zIndex: 2000,
          width: 360,
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid #e0e3e6'
        }}
      >
        {/* Green top bar */}
        <Box sx={{ height: 4, bgcolor: '#43a047' }} />
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  bgcolor: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className='tabler-check' style={{ fontSize: 16, color: '#43a047' }} />
              </Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#43a047' }}>
                Booking Confirmed!
              </Typography>
            </Box>
            <IconButton size='small' onClick={dismissToast}>
              <i className='tabler-x' style={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box
              component='img'
              src={toastData.propertyImage}
              alt={toastData.propertyTitle}
              sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', lineHeight: 1.3, fontSize: 13 }}>
                {toastData.propertyTitle}
              </Typography>
              <Typography variant='caption' sx={{ color: '#747782', display: 'block' }}>
                Code: <strong>{toastData.bookingCode}</strong>
              </Typography>
              <Typography variant='caption' sx={{ color: '#747782', display: 'block' }}>
                {toastData.checkIn} — {toastData.checkOut}
              </Typography>
              <Typography variant='subtitle2' sx={{ fontWeight: 800, color: '#002155', mt: 0.3 }}>
                {sym}
                {toastData.totalAmount.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant='contained'
            size='small'
            onClick={() => {
              dismissToast()
              setActiveTab('bookings')
            }}
            sx={{
              mt: 1.5,
              bgcolor: '#002155',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { bgcolor: '#003580' }
            }}
          >
            View Booking
          </Button>
        </Box>
      </Paper>
    </Slide>
  )
}

export default BookingToastNotification
