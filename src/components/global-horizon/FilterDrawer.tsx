'use client'

import React from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'

import type { PropertyType } from './types'
import { CURRENCY_SYMBOLS } from './types'
import { useGlobalHorizon } from './GlobalHorizonContext'

const PROPERTY_TYPES: { label: string; value: PropertyType }[] = [
  { label: 'Hotels', value: 'HOTEL' },
  { label: 'Restaurants', value: 'RESTAURANT' },
  { label: 'Guides', value: 'GUIDE' },
  { label: 'Agencies', value: 'AGENCY' },
  { label: 'Transport', value: 'TRANSPORT' },
  { label: 'Vehicles', value: 'VEHICLE' }
]

const RATING_OPTIONS = [
  { label: 'Any', value: null },
  { label: '8.0+', value: 8.0 },
  { label: '8.5+', value: 8.5 },
  { label: '9.0+', value: 9.0 }
]

const FilterDrawer = () => {
  const { filters, setFilters, filterDrawerOpen, setFilterDrawerOpen, currency, convertPrice } = useGlobalHorizon()

  const sym = CURRENCY_SYMBOLS[currency]

  const handleCategoryToggle = (type: PropertyType) => {
    const current = filters.categories
    const updated = current.includes(type) ? current.filter(c => c !== type) : [...current, type]

    setFilters({ ...filters, categories: updated })
  }

  const handleReset = () => {
    setFilters({ maxPrice: 1200, minRating: null, categories: [], destination: '' })
  }

  return (
    <Drawer
      anchor='right'
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
      PaperProps={{
        sx: {
          width: 340,
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          p: 3
        }
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 800, color: '#002155' }}>
          Filters
        </Typography>
        <IconButton onClick={() => setFilterDrawerOpen(false)}>
          <i className='tabler-x' style={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      {/* Max Nightly Rate */}
      <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 1 }}>
        Max Nightly Rate
      </Typography>
      <Typography variant='body2' sx={{ color: '#002155', fontWeight: 700, mb: 1 }}>
        Up to {sym}
        {convertPrice(filters.maxPrice).toLocaleString()}
      </Typography>
      <Slider
        value={filters.maxPrice}
        onChange={(_, v) => setFilters({ ...filters, maxPrice: v as number })}
        min={50}
        max={1200}
        step={10}
        sx={{
          color: '#002155',
          mb: 3,
          '& .MuiSlider-thumb': {
            bgcolor: '#febb02',
            border: '2px solid #002155',
            width: 20,
            height: 20
          },
          '& .MuiSlider-track': { bgcolor: '#002155' },
          '& .MuiSlider-rail': { bgcolor: '#e0e3e6' }
        }}
      />

      <Divider sx={{ mb: 3 }} />

      {/* Minimum Guest Rating */}
      <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 1.5 }}>
        Minimum Guest Rating
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {RATING_OPTIONS.map(opt => (
          <Button
            key={opt.label}
            variant={filters.minRating === opt.value ? 'contained' : 'outlined'}
            size='small'
            onClick={() => setFilters({ ...filters, minRating: opt.value })}
            sx={{
              flex: 1,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 12,
              ...(filters.minRating === opt.value
                ? { bgcolor: '#002155', '&:hover': { bgcolor: '#003580' } }
                : { borderColor: '#e0e3e6', color: '#434651', '&:hover': { borderColor: '#002155' } })
            }}
          >
            {opt.label}
          </Button>
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Property Type */}
      <Typography variant='subtitle2' sx={{ fontWeight: 700, color: '#191c1e', mb: 1 }}>
        Property Type
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 3 }}>
        {PROPERTY_TYPES.map(pt => (
          <FormControlLabel
            key={pt.value}
            control={
              <Checkbox
                checked={filters.categories.includes(pt.value)}
                onChange={() => handleCategoryToggle(pt.value)}
                size='small'
                sx={{
                  color: '#e0e3e6',
                  '&.Mui-checked': { color: '#002155' }
                }}
              />
            }
            label={
              <Typography variant='body2' sx={{ fontWeight: 500 }}>
                {pt.label}
              </Typography>
            }
          />
        ))}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          fullWidth
          variant='outlined'
          onClick={handleReset}
          sx={{
            borderColor: '#e0e3e6',
            color: '#434651',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': { borderColor: '#002155', color: '#002155' }
          }}
        >
          Reset
        </Button>
        <Button
          fullWidth
          variant='contained'
          onClick={() => setFilterDrawerOpen(false)}
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
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  )
}

export default FilterDrawer
