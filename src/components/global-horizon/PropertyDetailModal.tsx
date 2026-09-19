'use client'

import { useState } from 'react'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

import { useGlobalHorizon } from './GlobalHorizonContext'
import { CURRENCY_SYMBOLS } from './types'

const PropertyDetailModal = () => {
  const {
    selectedProperty,
    detailModalOpen,
    setDetailModalOpen,
    setSelectedProperty,
    currency,
    convertPrice,
    promoActive,
    wishlist,
    toggleWishlist,
    checkoutNights,
    setCheckoutNights,
    setCheckoutModalOpen,
    addReview
  } = useGlobalHorizon()

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mapMode, setMapMode] = useState<'roadmap' | 'satellite'>('roadmap')
  const [reviewExpanded, setReviewExpanded] = useState(false)
  const [newRating, setNewRating] = useState<number | null>(5)
  const [newComment, setNewComment] = useState('')

  if (!selectedProperty) return null

  const p = selectedProperty
  const sym = CURRENCY_SYMBOLS[currency]
  const rate = promoActive ? Math.round(p.pricePerNight * 0.85) : p.pricePerNight
  const convertedRate = convertPrice(rate)
  const subtotal = convertedRate * checkoutNights
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee
  const isFav = wishlist.includes(p.id)

  const nightOptions = [2, 4, 6, 8]

  const ratingCategories = [
    { label: 'Cleanliness', value: 4.9 },
    { label: 'Accuracy', value: 4.8 },
    { label: 'Communication', value: 5.0 },
    { label: 'Location', value: 4.9 },
    { label: 'Value', value: 4.7 }
  ]

  const avgScore = (ratingCategories.reduce((a, c) => a + c.value, 0) / ratingCategories.length).toFixed(1)

  const handleClose = () => {
    setDetailModalOpen(false)
    setSelectedProperty(null)
    setCurrentImageIndex(0)
    setReviewExpanded(false)
    setNewComment('')
    setNewRating(5)
  }

  const handleSubmitReview = () => {
    if (newComment.trim() && newRating) {
      addReview(p.id, newRating, newComment)
      setNewComment('')
      setNewRating(5)
      setReviewExpanded(false)
    }
  }

  return (
    <Dialog
      open={detailModalOpen}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      scroll='paper'
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '92vh'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 10,
            bgcolor: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
          }}
        >
          <i className='tabler-x' style={{ fontSize: 20 }} />
        </IconButton>

        {/* Photo Gallery */}
        <Box sx={{ position: 'relative', height: 320, overflow: 'hidden' }}>
          <Box
            component='img'
            src={p.images[currentImageIndex]}
            alt={p.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gallery Dots */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 0.8
            }}
          >
            {p.images.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                sx={{
                  width: idx === currentImageIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: idx === currentImageIndex ? '#febb02' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </Box>
          {/* Nav Arrows */}
          {p.images.length > 1 && (
            <>
              <IconButton
                onClick={() => setCurrentImageIndex(i => (i === 0 ? p.images.length - 1 : i - 1))}
                sx={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' }
                }}
              >
                <i className='tabler-chevron-left' />
              </IconButton>
              <IconButton
                onClick={() => setCurrentImageIndex(i => (i === p.images.length - 1 ? 0 : i + 1))}
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.95)' }
                }}
              >
                <i className='tabler-chevron-right' />
              </IconButton>
            </>
          )}
          {/* Wishlist */}
          <IconButton
            onClick={() => toggleWishlist(p.id)}
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              bgcolor: 'rgba(255,255,255,0.9)',
              '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
            }}
          >
            <i
              className={isFav ? 'tabler-heart-filled' : 'tabler-heart'}
              style={{ fontSize: 20, color: isFav ? '#e53935' : '#747782' }}
            />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Title & Info */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  label={p.type}
                  size='small'
                  sx={{ bgcolor: '#d9e2ff', color: '#002155', fontWeight: 700, fontSize: 10, height: 22 }}
                />
                <Typography variant='caption' sx={{ color: '#747782' }}>
                  <i className='tabler-map-pin' style={{ fontSize: 13, verticalAlign: 'middle' }} /> {p.location}
                </Typography>
              </Box>
              <Typography variant='h5' sx={{ fontWeight: 800, color: '#191c1e' }}>
                {p.title}
              </Typography>
            </Box>
            <Chip label={`${p.rating} ${p.ratingText}`} sx={{ bgcolor: '#002155', color: '#fff', fontWeight: 700 }} />
          </Box>

          <Typography variant='body2' sx={{ color: '#434651', mb: 3, lineHeight: 1.7 }}>
            {p.description}
          </Typography>

          {/* Host Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              border: '1px solid #e0e3e6',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={p.hostAvatar} sx={{ width: 44, height: 44 }} />
              <Box>
                <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e' }}>
                  {p.hostName}
                </Typography>
                <Typography variant='caption' sx={{ color: '#747782' }}>
                  Verified Host
                </Typography>
              </Box>
            </Box>
            <Button
              size='small'
              variant='outlined'
              startIcon={<i className='tabler-message' style={{ fontSize: 16 }} />}
              sx={{
                borderColor: '#002155',
                color: '#002155',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                '&:hover': { bgcolor: '#d9e2ff', borderColor: '#002155' }
              }}
            >
              Message Host
            </Button>
          </Paper>

          {/* Amenities Grid */}
          <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#191c1e', mb: 1.5 }}>
            Amenities
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1, mb: 3 }}>
            {p.amenities.map(amenity => (
              <Box key={amenity} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <i className='tabler-circle-check-filled' style={{ fontSize: 16, color: '#002155' }} />
                <Typography variant='body2' sx={{ color: '#434651', fontSize: 13 }}>
                  {amenity}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Interactive Map */}
          <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#191c1e', mb: 1.5 }}>
            Location
          </Typography>
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              height: 200,
              borderRadius: 2.5,
              overflow: 'hidden',
              border: '1px solid #e0e3e6',
              mb: 3,
              bgcolor: mapMode === 'satellite' ? '#1a3a2a' : '#e8ecf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Map grid lines */}
            <Box sx={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
              {[...Array(8)].map((_, i) => (
                <Box
                  key={`h-${i}`}
                  sx={{
                    position: 'absolute',
                    top: `${(i + 1) * 12}%`,
                    left: 0,
                    right: 0,
                    height: '1px',
                    bgcolor: mapMode === 'satellite' ? '#ffffff' : '#002155'
                  }}
                />
              ))}
              {[...Array(10)].map((_, i) => (
                <Box
                  key={`v-${i}`}
                  sx={{
                    position: 'absolute',
                    left: `${(i + 1) * 10}%`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    bgcolor: mapMode === 'satellite' ? '#ffffff' : '#002155'
                  }}
                />
              ))}
            </Box>

            {/* Center Pin */}
            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: '#002155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 0.5,
                  boxShadow: '0 4px 16px rgba(0,33,85,0.3)'
                }}
              >
                <i className='tabler-map-pin-filled' style={{ fontSize: 24, color: '#febb02' }} />
              </Box>
              <Chip
                label={`${sym}${convertedRate}/night`}
                size='small'
                sx={{ bgcolor: '#002155', color: '#fff', fontWeight: 700, fontSize: 11 }}
              />
              {/* Radar Pulse */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  border: '2px solid rgba(0,33,85,0.2)',
                  animation: 'radar-pulse 2s ease-out infinite',
                  '@keyframes radar-pulse': {
                    '0%': { transform: 'translate(-50%, -50%) scale(0.5)', opacity: 1 },
                    '100%': { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
                  }
                }}
              />
            </Box>

            {/* Map Controls */}
            <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <ToggleButtonGroup
                value={mapMode}
                exclusive
                onChange={(_, v) => v && setMapMode(v)}
                size='small'
                sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
              >
                <ToggleButton value='roadmap' sx={{ px: 1.2, py: 0.5, fontSize: 11, textTransform: 'none' }}>
                  Map
                </ToggleButton>
                <ToggleButton value='satellite' sx={{ px: 1.2, py: 0.5, fontSize: 11, textTransform: 'none' }}>
                  Satellite
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 0.3 }}>
              <IconButton size='small' sx={{ bgcolor: 'rgba(255,255,255,0.9)', width: 30, height: 30 }}>
                <i className='tabler-plus' style={{ fontSize: 14 }} />
              </IconButton>
              <IconButton size='small' sx={{ bgcolor: 'rgba(255,255,255,0.9)', width: 30, height: 30 }}>
                <i className='tabler-minus' style={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Paper>

          <Divider sx={{ mb: 3 }} />

          {/* Ratings & Reviews */}
          <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#191c1e', mb: 2 }}>
            Ratings & Reviews
          </Typography>

          {/* Score Summary */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e0e3e6', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ textAlign: 'center', minWidth: 70 }}>
                <Typography variant='h3' sx={{ fontWeight: 800, color: '#002155', lineHeight: 1 }}>
                  {avgScore}
                </Typography>
                <Rating
                  value={parseFloat(avgScore)}
                  precision={0.1}
                  readOnly
                  size='small'
                  sx={{ mt: 0.5, color: '#febb02' }}
                />
                <Typography variant='caption' sx={{ display: 'block', color: '#747782' }}>
                  {p.reviewsCount} reviews
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                {ratingCategories.map(cat => (
                  <Box key={cat.label} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant='caption' sx={{ width: 100, color: '#434651', fontSize: 12 }}>
                      {cat.label}
                    </Typography>
                    <LinearProgress
                      variant='determinate'
                      value={(cat.value / 5) * 100}
                      sx={{
                        flex: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#e0e3e6',
                        '& .MuiLinearProgress-bar': { bgcolor: '#febb02', borderRadius: 3 }
                      }}
                    />
                    <Typography variant='caption' sx={{ fontWeight: 700, color: '#002155', minWidth: 24 }}>
                      {cat.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Guest Reviews */}
          {(p.guestReviews ?? []).map(review => (
            <Paper key={review.id} elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e0e3e6', mb: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Avatar src={review.authorAvatar} sx={{ width: 36, height: 36 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 700, fontSize: 13 }}>
                    {review.authorName}
                  </Typography>
                  <Typography variant='caption' sx={{ color: '#747782' }}>
                    {review.authorLocation} · {review.stayDuration}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Rating value={review.rating} precision={0.5} readOnly size='small' sx={{ color: '#febb02' }} />
                  <Typography variant='caption' sx={{ display: 'block', color: '#747782' }}>
                    {review.date}
                  </Typography>
                </Box>
              </Box>
              <Typography variant='body2' sx={{ color: '#434651', fontSize: 13, lineHeight: 1.6, mb: 1 }}>
                {review.comment}
              </Typography>
              <Button
                size='small'
                startIcon={<i className='tabler-thumb-up' style={{ fontSize: 14 }} />}
                sx={{ color: '#747782', textTransform: 'none', fontSize: 12 }}
              >
                Helpful ({review.helpfulCount})
              </Button>
            </Paper>
          ))}

          {/* Write Feedback */}
          <Button
            onClick={() => setReviewExpanded(!reviewExpanded)}
            variant='outlined'
            fullWidth
            sx={{
              mt: 1,
              mb: 2,
              borderColor: '#e0e3e6',
              color: '#002155',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': { bgcolor: '#f7f9fc', borderColor: '#002155' }
            }}
            startIcon={<i className='tabler-pencil' style={{ fontSize: 16 }} />}
          >
            {reviewExpanded ? 'Close Feedback Form' : 'Write Feedback'}
          </Button>

          {reviewExpanded && (
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e0e3e6', mb: 3 }}>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 1 }}>
                Your Rating
              </Typography>
              <Rating
                value={newRating}
                onChange={(_, v) => setNewRating(v)}
                size='large'
                sx={{ mb: 2, color: '#febb02' }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder='Share your experience...'
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <Button
                variant='contained'
                onClick={handleSubmitReview}
                disabled={!newComment.trim()}
                sx={{
                  bgcolor: '#002155',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#003580' }
                }}
              >
                Submit Review
              </Button>
            </Paper>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Stay Duration Selector */}
          <Typography variant='subtitle1' sx={{ fontWeight: 700, color: '#191c1e', mb: 1.5 }}>
            Length of Stay
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {nightOptions.map(n => (
              <Button
                key={n}
                variant={checkoutNights === n ? 'contained' : 'outlined'}
                onClick={() => setCheckoutNights(n)}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  fontWeight: 700,
                  ...(checkoutNights === n
                    ? { bgcolor: '#002155', '&:hover': { bgcolor: '#003580' } }
                    : { borderColor: '#e0e3e6', color: '#434651', '&:hover': { borderColor: '#002155' } })
                }}
              >
                {n} nights
              </Button>
            ))}
          </Box>

          {/* Price Breakdown */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: 2.5, bgcolor: '#f7f9fc', border: '1px solid #e0e3e6', mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant='body2' sx={{ color: '#434651' }}>
                {sym}
                {convertedRate} x {checkoutNights} nights
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {sym}
                {subtotal.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant='body2' sx={{ color: '#434651' }}>
                Service fee (10%)
              </Typography>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                {sym}
                {serviceFee.toLocaleString()}
              </Typography>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#002155' }}>
                Total
              </Typography>
              <Typography variant='subtitle1' sx={{ fontWeight: 800, color: '#002155' }}>
                {sym}
                {total.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Sticky Footer */}
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            bgcolor: '#ffffff',
            borderTop: '1px solid #e0e3e6',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 800, color: '#002155' }}>
              {sym}
              {total.toLocaleString()}
            </Typography>
            <Typography variant='caption' sx={{ color: '#747782' }}>
              Total for {checkoutNights} nights
            </Typography>
          </Box>
          <Button
            variant='contained'
            size='large'
            onClick={() => setCheckoutModalOpen(true)}
            sx={{
              bgcolor: '#febb02',
              color: '#6c4d00',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1,
              borderRadius: 2,
              px: 4,
              '&:hover': { bgcolor: '#e5a800' },
              boxShadow: '0 4px 14px rgba(254,187,2,0.4)'
            }}
          >
            Book Deal Now
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default PropertyDetailModal
