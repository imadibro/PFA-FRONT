'use client'

import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'

import { CURRENCY_SYMBOLS } from './types'
import { useGlobalHorizon } from './GlobalHorizonContext'

const BookingCheckoutModal = () => {
  const {
    checkoutModalOpen,
    setCheckoutModalOpen,
    selectedProperty,
    currency,
    convertPrice,
    promoActive,
    checkoutNights,
    dateRange,
    guests,
    submitBooking
  } = useGlobalHorizon()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('credit-card')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!selectedProperty) return null

  const p = selectedProperty
  const sym = CURRENCY_SYMBOLS[currency]
  const rate = promoActive ? Math.round(p.pricePerNight * 0.85) : p.pricePerNight
  const convertedRate = convertPrice(rate)
  const subtotal = convertedRate * checkoutNights
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee

  const handleClose = () => {
    setCheckoutModalOpen(false)
    setProcessing(false)
    setSuccess(false)
    setName('')
    setEmail('')
    setPhone('')
  }

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return

    setProcessing(true)

    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)

      setTimeout(() => {
        submitBooking({ name, email, phone, paymentMethod })
        handleClose()
      }, 1500)
    }, 2000)
  }

  return (
    <Dialog
      open={checkoutModalOpen}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e0e3e6'
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 800, color: '#002155' }}>
            Complete Your Booking
          </Typography>
          <IconButton onClick={handleClose} size='small'>
            <i className='tabler-x' style={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Box sx={{ p: 2.5 }}>
          {/* Booking Summary */}
          <Paper
            elevation={0}
            sx={{ p: 2, borderRadius: 2.5, border: '1px solid #e0e3e6', mb: 3, display: 'flex', gap: 2 }}
          >
            <Box
              component='img'
              src={p.images[0]}
              alt={p.title}
              sx={{ width: 80, height: 80, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
            />
            <Box sx={{ flex: 1 }}>
              <Chip
                label={p.type}
                size='small'
                sx={{ bgcolor: '#d9e2ff', color: '#002155', fontWeight: 700, fontSize: 10, height: 20, mb: 0.5 }}
              />
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e' }}>
                {p.title}
              </Typography>
              <Typography variant='caption' sx={{ color: '#747782' }}>
                {p.location}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                <Typography variant='caption' sx={{ color: '#434651' }}>
                  <i className='tabler-calendar' style={{ fontSize: 12, verticalAlign: 'middle' }} /> {dateRange.start}{' '}
                  — {dateRange.end}
                </Typography>
                <Typography variant='caption' sx={{ color: '#434651' }}>
                  <i className='tabler-users' style={{ fontSize: 12, verticalAlign: 'middle' }} /> {guests.adults}{' '}
                  guests
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant='h6' sx={{ fontWeight: 800, color: '#002155' }}>
                {sym}
                {total.toLocaleString()}
              </Typography>
              <Typography variant='caption' sx={{ color: '#747782' }}>
                {checkoutNights} nights
              </Typography>
            </Box>
          </Paper>

          {/* Guest Information */}
          <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 1.5 }}>
            Guest Information
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              size='small'
              label='Full Name'
              value={name}
              onChange={e => setName(e.target.value)}
              InputProps={{
                startAdornment: <i className='tabler-user' style={{ marginRight: 8, color: '#747782', fontSize: 18 }} />
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              size='small'
              label='Email Address'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <i className='tabler-mail' style={{ marginRight: 8, color: '#747782', fontSize: 18 }} />
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              size='small'
              label='Phone Number'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              InputProps={{
                startAdornment: (
                  <i className='tabler-phone' style={{ marginRight: 8, color: '#747782', fontSize: 18 }} />
                )
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>

          {/* Payment Method */}
          <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 1.5 }}>
            Payment Method
          </Typography>
          <RadioGroup value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} sx={{ mb: 3 }}>
            <Paper
              elevation={0}
              sx={{
                border: paymentMethod === 'credit-card' ? '2px solid #002155' : '1px solid #e0e3e6',
                borderRadius: 2,
                mb: 1,
                px: 2
              }}
            >
              <FormControlLabel
                value='credit-card'
                control={<Radio size='small' sx={{ color: '#002155', '&.Mui-checked': { color: '#002155' } }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-credit-card' style={{ fontSize: 18, color: '#002155' }} />
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      Credit Card
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%' }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                border: paymentMethod === 'digital-pay' ? '2px solid #002155' : '1px solid #e0e3e6',
                borderRadius: 2,
                mb: 1,
                px: 2
              }}
            >
              <FormControlLabel
                value='digital-pay'
                control={<Radio size='small' sx={{ color: '#002155', '&.Mui-checked': { color: '#002155' } }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-wallet' style={{ fontSize: 18, color: '#002155' }} />
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      Digital Pay
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%' }}
              />
            </Paper>
            <Paper
              elevation={0}
              sx={{
                border: paymentMethod === 'pay-on-arrival' ? '2px solid #002155' : '1px solid #e0e3e6',
                borderRadius: 2,
                px: 2
              }}
            >
              <FormControlLabel
                value='pay-on-arrival'
                control={<Radio size='small' sx={{ color: '#002155', '&.Mui-checked': { color: '#002155' } }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className='tabler-cash' style={{ fontSize: 18, color: '#002155' }} />
                    <Typography variant='body2' sx={{ fontWeight: 600 }}>
                      Pay on Arrival
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%' }}
              />
            </Paper>
          </RadioGroup>

          <Divider sx={{ mb: 2 }} />

          {/* Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#002155' }}>
              Total Amount
            </Typography>
            <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#002155' }}>
              {sym}
              {total.toLocaleString()}
            </Typography>
          </Box>

          {/* Submit Button */}
          <Button
            fullWidth
            variant='contained'
            size='large'
            onClick={handleSubmit}
            disabled={processing || success || !name.trim() || !email.trim()}
            sx={{
              bgcolor: success ? '#43a047' : '#febb02',
              color: success ? '#ffffff' : '#6c4d00',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1,
              borderRadius: 2,
              py: 1.5,
              '&:hover': { bgcolor: success ? '#43a047' : '#e5a800' },
              '&.Mui-disabled': {
                bgcolor: processing ? '#002155' : undefined,
                color: processing ? '#ffffff' : undefined
              },
              boxShadow: success ? '0 4px 14px rgba(67,160,71,0.4)' : '0 4px 14px rgba(254,187,2,0.4)'
            }}
          >
            {processing ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} sx={{ color: '#ffffff' }} />
                Processing...
              </Box>
            ) : success ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <i className='tabler-check' style={{ fontSize: 20 }} />
                Booking Confirmed!
              </Box>
            ) : (
              'Confirm & Pay'
            )}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default BookingCheckoutModal
