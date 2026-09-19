'use client'

import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import CircularProgress from '@mui/material/CircularProgress'

import { CURRENCY_SYMBOLS, type Currency } from '@/components/global-horizon/types'
import {
  useGetUserProfileQuery,
  useToggleNotificationsMutation,
  useUpdateCurrencyMutation,
  useGetSavedPropertiesQuery
} from '@/store/features/user/userApi'
import { useGetPropertiesQuery } from '@/store/features/property/propertyApi'

interface ProfileViewProps {
  onViewProperty?: (propertyId: string) => void
  onRemoveFromWishlist?: (propertyId: string) => void
}

const ProfileView: React.FC<ProfileViewProps> = ({ onViewProperty, onRemoveFromWishlist }) => {
  const { data: userProfile, isLoading } = useGetUserProfileQuery()
  const { data: savedPropertyIds = [] } = useGetSavedPropertiesQuery()
  const { data: allProperties = [] } = useGetPropertiesQuery()
  const [toggleNotifications] = useToggleNotificationsMutation()
  const [updateCurrency] = useUpdateCurrencyMutation()

  const savedProperties = allProperties.filter(p => savedPropertyIds.includes(p.id))

  const handleCurrencyChange = async (currency: Currency) => {
    try {
      await updateCurrency({
        currency,
        currencySymbol: CURRENCY_SYMBOLS[currency]
      }).unwrap()
    } catch (error) {
      console.error('Failed to update currency:', error)
    }
  }

  const handleToggleNotifications = async () => {
    try {
      await toggleNotifications().unwrap()
    } catch (error) {
      console.error('Failed to toggle notifications:', error)
    }
  }

  if (isLoading || !userProfile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight: 800, color: '#002155', mb: 0.5 }}>
        My Profile
      </Typography>
      <Typography variant='body2' sx={{ color: '#747782', mb: 3 }}>
        Manage your account and preferences
      </Typography>

      {/* Profile Card */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e3e6', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar src={userProfile.avatar} sx={{ width: 80, height: 80 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant='h6' sx={{ fontWeight: 700, color: '#191c1e', mb: 0.5 }}>
              {userProfile.name}
            </Typography>
            <Typography variant='body2' sx={{ color: '#747782', mb: 1 }}>
              {userProfile.email}
            </Typography>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fff3e0',
                px: 2,
                py: 0.5,
                borderRadius: 2
              }}
            >
              <i className='tabler-crown' style={{ fontSize: 18, color: '#e65100' }} />
              <Typography variant='caption' sx={{ fontWeight: 700, color: '#e65100' }}>
                {userProfile.membershipTier}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='h5' sx={{ fontWeight: 800, color: '#002155' }}>
              {userProfile.points.toLocaleString()}
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              Reward Points
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Button
          fullWidth
          variant='outlined'
          sx={{
            borderColor: '#e0e3e6',
            color: '#434651',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': { borderColor: '#002155' }
          }}
        >
          Edit Profile
        </Button>
      </Paper>

      {/* Preferences */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e3e6', mb: 3 }}>
        <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 2 }}>
          Preferences
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant='body2' sx={{ fontWeight: 600, color: '#191c1e' }}>
              Currency
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              Display prices in your preferred currency
            </Typography>
          </Box>
          <Select
            value={userProfile.currency}
            onChange={e => handleCurrencyChange(e.target.value as Currency)}
            size='small'
            sx={{ minWidth: 120 }}
          >
            <MenuItem value='GBP'>GBP (£)</MenuItem>
            <MenuItem value='USD'>USD ($)</MenuItem>
            <MenuItem value='EUR'>EUR (€)</MenuItem>
          </Select>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant='body2' sx={{ fontWeight: 600, color: '#191c1e' }}>
              Push Notifications
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              Receive updates about your bookings
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={userProfile.pushNotifications}
                onChange={handleToggleNotifications}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#002155'
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#002155'
                  }
                }}
              />
            }
            label=''
          />
        </Box>
      </Paper>

      {/* Saved Properties */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e0e3e6' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e' }}>
            Saved Properties ({savedProperties.length})
          </Typography>
        </Box>

        {savedProperties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <i className='tabler-heart-off' style={{ fontSize: 48, color: '#e0e3e6' }} />
            <Typography variant='body2' sx={{ color: '#747782', mt: 2 }}>
              No saved properties yet
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2
            }}
          >
            {savedProperties.map(property => (
              <Box
                key={property.id}
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  '&:hover': {
                    '& .overlay': { opacity: 1 }
                  }
                }}
                onClick={() => onViewProperty?.(property.id)}
              >
                <Box
                  component='img'
                  src={property.images[0]}
                  alt={property.title}
                  sx={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
                <Box
                  className='overlay'
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s'
                  }}
                >
                  <Button
                    variant='contained'
                    size='small'
                    onClick={e => {
                      e.stopPropagation()
                      onRemoveFromWishlist?.(property.id)
                    }}
                    sx={{
                      bgcolor: '#fff',
                      color: '#c62828',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#f5f5f5' }
                    }}
                  >
                    Remove
                  </Button>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  <Typography variant='caption' sx={{ color: '#fff', fontWeight: 600 }}>
                    {CURRENCY_SYMBOLS[userProfile.currency]}
                    {property.pricePerNight}
                  </Typography>
                </Box>
                <Box sx={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
                  <Typography
                    variant='caption'
                    sx={{ color: '#fff', fontWeight: 700, textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    {property.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default ProfileView
