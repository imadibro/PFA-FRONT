'use client'

import React, { useState } from 'react'

import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'

import { CURRENCY_SYMBOLS, type Currency, type ActiveTab } from './types'

interface NavbarProps {
  activeTab: ActiveTab
  userProfile?: {
    name: string
    email: string
    avatar: string
    currency: Currency
  }
  onOpenProfile: () => void
  onSelectCurrency: (currency: Currency, symbol: string) => void
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, userProfile, onOpenProfile, onSelectCurrency }) => {
  const [currencyMenuAnchor, setCurrencyMenuAnchor] = useState<null | HTMLElement>(null)
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null)

  const handleCurrencySelect = (currency: Currency) => {
    onSelectCurrency(currency, CURRENCY_SYMBOLS[currency])
    setCurrencyMenuAnchor(null)
  }

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        bgcolor: '#fff',
        borderBottom: '1px solid #e0e3e6',
        zIndex: 1200
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: '#002155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className='tabler-world' style={{ fontSize: 24, color: '#febb02' }} />
          </Box>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 800,
              color: '#002155',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Global Horizon
          </Typography>
        </Box>

        {/* Center - Active Tab Title */}
        <Typography
          variant='subtitle1'
          sx={{
            fontWeight: 700,
            color: '#191c1e',
            textTransform: 'capitalize',
            display: { xs: 'none', md: 'block' }
          }}
        >
          {activeTab === 'home' ? 'Discover' : activeTab}
        </Typography>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Currency Selector */}
          {userProfile && (
            <>
              <IconButton
                size='small'
                onClick={e => setCurrencyMenuAnchor(e.currentTarget)}
                sx={{
                  bgcolor: '#f7f9fc',
                  '&:hover': { bgcolor: '#e0e3e6' }
                }}
              >
                <Typography variant='caption' sx={{ fontWeight: 700, color: '#002155' }}>
                  {CURRENCY_SYMBOLS[userProfile.currency]}
                </Typography>
              </IconButton>
              <Menu
                anchorEl={currencyMenuAnchor}
                open={Boolean(currencyMenuAnchor)}
                onClose={() => setCurrencyMenuAnchor(null)}
              >
                <MenuItem onClick={() => handleCurrencySelect('GBP')}>
                  <Typography variant='body2'>GBP (£)</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleCurrencySelect('USD')}>
                  <Typography variant='body2'>USD ($)</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleCurrencySelect('EUR')}>
                  <Typography variant='body2'>EUR (€)</Typography>
                </MenuItem>
              </Menu>
            </>
          )}

          {/* Profile Menu */}
          {userProfile && (
            <>
              <IconButton size='small' onClick={e => setProfileMenuAnchor(e.currentTarget)}>
                <Avatar src={userProfile.avatar} sx={{ width: 36, height: 36 }} />
              </IconButton>
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={() => setProfileMenuAnchor(null)}
                PaperProps={{
                  sx: { minWidth: 200, mt: 1 }
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e' }}>
                    {userProfile.name}
                  </Typography>
                  <Typography variant='caption' sx={{ color: '#747782' }}>
                    {userProfile.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    setProfileMenuAnchor(null)
                    onOpenProfile()
                  }}
                >
                  <i className='tabler-user' style={{ fontSize: 18, marginRight: 8 }} />
                  <Typography variant='body2'>My Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => setProfileMenuAnchor(null)}>
                  <i className='tabler-settings' style={{ fontSize: 18, marginRight: 8 }} />
                  <Typography variant='body2'>Settings</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => setProfileMenuAnchor(null)}>
                  <i className='tabler-logout' style={{ fontSize: 18, marginRight: 8 }} />
                  <Typography variant='body2' sx={{ color: '#c62828' }}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
