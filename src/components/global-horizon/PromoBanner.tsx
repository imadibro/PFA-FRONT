'use client'

import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

import { useGlobalHorizon } from './GlobalHorizonContext'

const PromoBanner = () => {
  const { promoActive, claimPromo } = useGlobalHorizon()

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        mb: 3,
        minHeight: 160,
        background: 'linear-gradient(135deg, #002155 0%, #003580 50%, #001945 100%)',
        display: 'flex',
        alignItems: 'center',
        p: 3
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2
        }}
      />
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
        <Typography variant='h5' sx={{ color: '#ffffff', fontWeight: 800, mb: 0.5, lineHeight: 1.2 }}>
          Exclusive Member Deals
        </Typography>
        <Typography variant='body2' sx={{ color: 'rgba(255,255,255,0.8)', mb: 2 }}>
          Unlock premium savings on luxury stays, dining, guides, and transport worldwide.
        </Typography>
        {promoActive ? (
          <Chip
            icon={<i className='tabler-discount-check' style={{ color: '#6c4d00', fontSize: 18 }} />}
            label='15% DISCOUNT APPLIED!'
            sx={{
              bgcolor: '#febb02',
              color: '#6c4d00',
              fontWeight: 800,
              fontSize: 13,
              height: 36,
              px: 1
            }}
          />
        ) : (
          <Button
            variant='contained'
            onClick={claimPromo}
            sx={{
              bgcolor: '#febb02',
              color: '#6c4d00',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1,
              borderRadius: 2,
              px: 3,
              '&:hover': { bgcolor: '#e5a800' },
              boxShadow: '0 4px 14px rgba(254,187,2,0.4)'
            }}
          >
            Claim 15% Off Deals
          </Button>
        )}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: -30,
          top: -30,
          width: 200,
          height: 200,
          borderRadius: '50%',
          bgcolor: 'rgba(254,187,2,0.08)',
          display: { xs: 'none', md: 'block' }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: 40,
          bottom: -40,
          width: 140,
          height: 140,
          borderRadius: '50%',
          bgcolor: 'rgba(254,187,2,0.05)',
          display: { xs: 'none', md: 'block' }
        }}
      />
    </Box>
  )
}

export default PromoBanner
