'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import { useGlobalHorizon } from './GlobalHorizonContext'
import type { Property } from './types'
import { CURRENCY_SYMBOLS } from './types'

interface PropertyCardProps {
  property: Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { currency, convertPrice, promoActive, wishlist, toggleWishlist, setSelectedProperty, setDetailModalOpen } =
    useGlobalHorizon()

  const isFavorite = wishlist.includes(property.id)
  const discountedPrice = promoActive ? Math.round(property.pricePerNight * 0.85) : property.pricePerNight
  const showOriginal = promoActive || (property.originalPricePerNight ?? 0) > property.pricePerNight
  const sym = CURRENCY_SYMBOLS[currency]

  const handleViewDeal = () => {
    setSelectedProperty(property)
    setDetailModalOpen(true)
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid #e0e3e6',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,33,85,0.12)',
          transform: 'translateY(-2px)'
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component='img'
          height={200}
          image={property.images[0]}
          alt={property.title}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            '&:hover': { transform: 'scale(1.08)' }
          }}
        />
        {/* Rating Badge */}
        <Chip
          label={`${property.rating} ${property.ratingText}`}
          size='small'
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: '#002155',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: 11,
            height: 26
          }}
        />
        {/* Wishlist Heart */}
        <IconButton
          onClick={e => {
            e.stopPropagation()
            toggleWishlist(property.id)
          }}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            width: 34,
            height: 34,
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
          }}
        >
          <i
            className={isFavorite ? 'tabler-heart-filled' : 'tabler-heart'}
            style={{ fontSize: 18, color: isFavorite ? '#e53935' : '#747782' }}
          />
        </IconButton>
        {/* Promo Badge */}
        {promoActive && (
          <Chip
            label='-15%'
            size='small'
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              bgcolor: '#febb02',
              color: '#6c4d00',
              fontWeight: 800,
              fontSize: 11
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Chip
            label={property.type}
            size='small'
            sx={{
              height: 20,
              fontSize: 10,
              fontWeight: 700,
              bgcolor: '#d9e2ff',
              color: '#002155',
              letterSpacing: 0.5
            }}
          />
          <Typography variant='caption' sx={{ color: '#747782', display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <i className='tabler-map-pin' style={{ fontSize: 13 }} />
            {property.location}
          </Typography>
        </Box>
        <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#191c1e', lineHeight: 1.3, mb: 0.5 }}>
          {property.title}
        </Typography>
        <Typography variant='caption' sx={{ color: '#747782', mb: 1.5, flex: 1 }}>
          {property.reviewsCount.toLocaleString()} reviews
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            {showOriginal && (
              <Typography variant='caption' sx={{ textDecoration: 'line-through', color: '#747782', mr: 0.5 }}>
                {sym}
                {convertPrice(property.originalPricePerNight ?? property.pricePerNight)}
              </Typography>
            )}
            <Typography variant='h6' component='span' sx={{ fontWeight: 800, color: '#002155' }}>
              {sym}
              {convertPrice(discountedPrice)}
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              {' '}
              /night
            </Typography>
          </Box>
          <Button
            variant='contained'
            size='small'
            onClick={handleViewDeal}
            sx={{
              bgcolor: '#febb02',
              color: '#6c4d00',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#e5a800', boxShadow: 'none' }
            }}
          >
            View Deal
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PropertyCard
