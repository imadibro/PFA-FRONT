'use client'

import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'

import type { BookingStatus } from '@/components/global-horizon/types'
import { CURRENCY_SYMBOLS } from '@/components/global-horizon/types'
import {
  useGetBookingsQuery,
  useCancelBookingMutation,
  useGetBookingStatsQuery
} from '@/store/features/booking/bookingApi'

const STATUS_COLORS: Record<BookingStatus, { bg: string; color: string }> = {
  CONFIRMED: { bg: '#e8f5e9', color: '#2e7d32' },
  UPCOMING: { bg: '#e3f2fd', color: '#1565c0' },
  COMPLETED: { bg: '#f3e5f5', color: '#7b1fa2' },
  CANCELLED: { bg: '#ffebee', color: '#c62828' }
}

const FILTER_OPTIONS: { label: string; value: BookingStatus | 'ALL' }[] = [
  { label: 'All Bookings', value: 'ALL' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Completed', value: 'COMPLETED' }
]

interface BookingsViewProps {
  onContactHost?: (propertyTitle: string) => void
  onExploreMore?: () => void
}

const BookingsView: React.FC<BookingsViewProps> = ({ onContactHost, onExploreMore }) => {
  const { data: bookings = [], isLoading } = useGetBookingsQuery()
  const { data: stats } = useGetBookingStatsQuery()
  const [cancelBooking] = useCancelBookingMutation()

  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL')
  const [voucherBookingId, setVoucherBookingId] = useState<string | null>(null)

  const filtered = statusFilter === 'ALL' ? bookings : bookings.filter(b => b.status === statusFilter)

  const voucherBooking = bookings.find(b => b.id === voucherBookingId)

  const handleCancelBooking = async (id: string) => {
    try {
      await cancelBooking(id).unwrap()
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight: 800, color: '#002155', mb: 0.5 }}>
        Travel Portfolio
      </Typography>
      <Typography variant='body2' sx={{ color: '#747782', mb: 3 }}>
        Your luxury travel dashboard
      </Typography>

      {/* Stats Cards */}
      {stats && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e0e3e6', textAlign: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#d9e2ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1
              }}
            >
              <i className='tabler-wallet' style={{ fontSize: 22, color: '#002155' }} />
            </Box>
            <Typography variant='h5' sx={{ fontWeight: 800, color: '#002155' }}>
              £{stats.totalInvested.toLocaleString()}
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              Total Invested
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e0e3e6', textAlign: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#fff3e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1
              }}
            >
              <i className='tabler-moon-stars' style={{ fontSize: 22, color: '#e65100' }} />
            </Box>
            <Typography variant='h5' sx={{ fontWeight: 800, color: '#002155' }}>
              {stats.totalNights}
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              Nights Stayed
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e0e3e6', textAlign: 'center' }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1
              }}
            >
              <i className='tabler-plane' style={{ fontSize: 22, color: '#2e7d32' }} />
            </Box>
            <Typography variant='h5' sx={{ fontWeight: 800, color: '#002155' }}>
              {stats.activeTrips}
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              Active Trips
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Filter Tabs */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', pb: 1 }}>
        {FILTER_OPTIONS.map(opt => (
          <Button
            key={opt.value}
            variant={statusFilter === opt.value ? 'contained' : 'outlined'}
            size='small'
            onClick={() => setStatusFilter(opt.value)}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 13,
              whiteSpace: 'nowrap',
              ...(statusFilter === opt.value
                ? { bgcolor: '#002155', '&:hover': { bgcolor: '#003580' } }
                : { borderColor: '#e0e3e6', color: '#434651', '&:hover': { borderColor: '#002155' } })
            }}
          >
            {opt.label}
          </Button>
        ))}
      </Box>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: '1px solid #e0e3e6', textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: '#f7f9fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2
            }}
          >
            <i className='tabler-calendar-off' style={{ fontSize: 32, color: '#747782' }} />
          </Box>
          <Typography variant='h6' sx={{ fontWeight: 700, color: '#002155', mb: 1 }}>
            No bookings found
          </Typography>
          <Typography variant='body2' sx={{ color: '#747782', mb: 3 }}>
            Start planning your next luxury getaway
          </Typography>
          {onExploreMore && (
            <Button
              variant='contained'
              onClick={onExploreMore}
              sx={{
                bgcolor: '#febb02',
                color: '#6c4d00',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': { bgcolor: '#e5a800' }
              }}
            >
              Explore Properties
            </Button>
          )}
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filtered.map(booking => {
            const sym = CURRENCY_SYMBOLS[booking.currency]
            const statusStyle = STATUS_COLORS[booking.status]

            return (
              <Paper key={booking.id} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e3e6' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    component='img'
                    src={booking.propertyImage}
                    alt={booking.propertyTitle}
                    sx={{ width: 120, height: 120, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Box>
                        <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#191c1e', mb: 0.5 }}>
                          {booking.propertyTitle}
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{ color: '#747782', display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          <i className='tabler-map-pin' style={{ fontSize: 14 }} />
                          {booking.location}
                        </Typography>
                      </Box>
                      <Chip
                        label={booking.status}
                        size='small'
                        sx={{
                          bgcolor: statusStyle.bg,
                          color: statusStyle.color,
                          fontWeight: 700,
                          fontSize: 11
                        }}
                      />
                    </Box>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 2 }}>
                      <Box>
                        <Typography variant='caption' sx={{ color: '#747782', display: 'block' }}>
                          Check-in
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#191c1e' }}>
                          {booking.checkIn}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant='caption' sx={{ color: '#747782', display: 'block' }}>
                          Check-out
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#191c1e' }}>
                          {booking.checkOut}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant='caption' sx={{ color: '#747782', display: 'block' }}>
                          Guests
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#191c1e' }}>
                          {booking.guests} adults
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant='caption' sx={{ color: '#747782', display: 'block' }}>
                          Booking Code
                        </Typography>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#002155' }}>
                          {booking.bookingCode}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant='h6' sx={{ fontWeight: 800, color: '#002155' }}>
                        {sym}
                        {booking.totalAmount.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size='small'
                          variant='outlined'
                          onClick={() => setVoucherBookingId(booking.id)}
                          sx={{
                            borderColor: '#e0e3e6',
                            color: '#434651',
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: 'none',
                            '&:hover': { borderColor: '#002155' }
                          }}
                        >
                          View Voucher
                        </Button>
                        {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                          <>
                            {onContactHost && (
                              <Button
                                size='small'
                                variant='outlined'
                                onClick={() => onContactHost(booking.propertyTitle)}
                                sx={{
                                  borderColor: '#e0e3e6',
                                  color: '#434651',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  textTransform: 'none',
                                  '&:hover': { borderColor: '#002155' }
                                }}
                              >
                                Contact Host
                              </Button>
                            )}
                            <Button
                              size='small'
                              variant='outlined'
                              onClick={() => handleCancelBooking(booking.id)}
                              sx={{
                                borderColor: '#ffebee',
                                color: '#c62828',
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { borderColor: '#c62828', bgcolor: '#ffebee' }
                              }}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            )
          })}
        </Box>
      )}

      {/* Voucher Dialog */}
      {voucherBooking && (
        <Dialog open={!!voucherBookingId} onClose={() => setVoucherBookingId(null)} maxWidth='sm' fullWidth>
          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
              <Typography variant='h6' sx={{ fontWeight: 800, color: '#002155' }}>
                Booking Voucher
              </Typography>
              <IconButton size='small' onClick={() => setVoucherBookingId(null)}>
                <i className='tabler-x' />
              </IconButton>
            </Box>

            <Box sx={{ bgcolor: '#f7f9fc', p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant='h4' sx={{ fontWeight: 800, color: '#002155', textAlign: 'center', mb: 1 }}>
                {voucherBooking.bookingCode}
              </Typography>
              <Typography variant='caption' sx={{ color: '#747782', textAlign: 'center', display: 'block' }}>
                Confirmation Code
              </Typography>
            </Box>

            <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 2 }}>
              {voucherBooking.propertyTitle}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ color: '#747782' }}>
                  Check-in:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {voucherBooking.checkIn}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ color: '#747782' }}>
                  Check-out:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {voucherBooking.checkOut}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ color: '#747782' }}>
                  Nights:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {voucherBooking.nights}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='body2' sx={{ color: '#747782' }}>
                  Guests:
                </Typography>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  {voucherBooking.guests} adults
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                  Total Amount:
                </Typography>
                <Typography variant='subtitle2' sx={{ fontWeight: 800, color: '#002155' }}>
                  {CURRENCY_SYMBOLS[voucherBooking.currency]}
                  {voucherBooking.totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant='contained'
              onClick={() => setVoucherBookingId(null)}
              sx={{
                bgcolor: '#002155',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': { bgcolor: '#003580' }
              }}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  )
}

export default BookingsView
