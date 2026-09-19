'use client'

import React from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'

import type { ActiveTab } from './types'

interface BottomNavProps {
  activeTab: ActiveTab
  onTabChange: (tab: ActiveTab) => void
  unreadMessagesCount?: number
  upcomingBookingsCount?: number
}

const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount = 0,
  upcomingBookingsCount = 0
}) => {
  const tabs: Array<{
    value: ActiveTab
    label: string
    icon: string
    badge?: number
  }> = [
    { value: 'home', label: 'Home', icon: 'tabler-home' },
    { value: 'bookings', label: 'Bookings', icon: 'tabler-calendar', badge: upcomingBookingsCount },
    { value: 'messages', label: 'Messages', icon: 'tabler-message', badge: unreadMessagesCount },
    { value: 'profile', label: 'Profile', icon: 'tabler-user' }
  ]

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderTop: '1px solid #e0e3e6',
        display: { xs: 'block', md: 'none' }
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          py: 1
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.value

          return (
            <Box
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#f7f9fc'
                }
              }}
            >
              <Badge
                badgeContent={tab.badge}
                color='error'
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: 10,
                    height: 18,
                    minWidth: 18
                  }
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isActive ? '#002155' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <i
                    className={tab.icon}
                    style={{
                      fontSize: 24,
                      color: isActive ? '#febb02' : '#747782'
                    }}
                  />
                </Box>
              </Badge>
              <Typography
                variant='caption'
                sx={{
                  mt: 0.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#002155' : '#747782',
                  fontSize: 11
                }}
              >
                {tab.label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}

export default BottomNav
