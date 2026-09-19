'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

import { useGlobalHorizon } from './GlobalHorizonContext'
import { DESTINATIONS } from './mockData'

const TrendingDestinations = () => {
  const { setSearchDestination } = useGlobalHorizon()

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 800, color: '#002155' }}>
            Trending Destinations
          </Typography>
          <Typography variant='body2' sx={{ color: '#747782' }}>
            Explore the world&apos;s most sought-after locations
          </Typography>
        </Box>
        <Chip
          icon={<i className='tabler-trending-up' style={{ fontSize: 16, color: '#002155' }} />}
          label='Popular Now'
          size='small'
          sx={{ bgcolor: '#d9e2ff', color: '#002155', fontWeight: 600 }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e3e6', borderRadius: 2 }
        }}
      >
        {DESTINATIONS.map(dest => (
          <Card
            key={dest.name}
            onClick={() => setSearchDestination(dest.name)}
            sx={{
              minWidth: 200,
              maxWidth: 200,
              borderRadius: 3,
              cursor: 'pointer',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid #e0e3e6',
              boxShadow: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,33,85,0.12)'
              }
            }}
          >
            <CardMedia component='img' height={130} image={dest.imageUrl} alt={dest.name} sx={{ objectFit: 'cover' }} />
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', lineHeight: 1.2 }}>
                {dest.name}
              </Typography>
              <Typography variant='caption' sx={{ color: '#747782' }}>
                {dest.country}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  display: 'block',
                  color: '#002155',
                  fontWeight: 700,
                  mt: 0.5
                }}
              >
                {dest.propertiesCount}+ stays
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}

export default TrendingDestinations
