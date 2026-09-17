'use client'

import React, { useState, useRef, useEffect } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'

import { useGlobalHorizon } from './GlobalHorizonContext'
import { DESTINATIONS } from './mockData'

const SearchBar = () => {
  const { searchDestination, setSearchDestination, dateRange, setDateRange, guests, setGuests, setFilterDrawerOpen } =
    useGlobalHorizon()

  const [localSearch, setLocalSearch] = useState(searchDestination)
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [dateAnchor, setDateAnchor] = useState<HTMLElement | null>(null)
  const [guestAnchor, setGuestAnchor] = useState<HTMLElement | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredDestinations = DESTINATIONS.filter(
    d =>
      d.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      d.country.toLowerCase().includes(localSearch.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowAutocomplete(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectDestination = (name: string) => {
    setLocalSearch(name)
    setSearchDestination(name)
    setShowAutocomplete(false)
  }

  const quickDates = [
    { label: 'Jun 12 — 18', start: 'Jun 12', end: 'Jun 18' },
    { label: 'Jul 1 — 7', start: 'Jul 1', end: 'Jul 7' },
    { label: 'Aug 15 — 22', start: 'Aug 15', end: 'Aug 22' },
    { label: 'Sep 5 — 12', start: 'Sep 5', end: 'Sep 12' }
  ]

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid #e0e3e6',
        bgcolor: '#ffffff',
        mb: 3
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5, alignItems: 'stretch' }}>
        {/* Destination Search */}
        <Box ref={searchRef} sx={{ flex: 2, position: 'relative' }}>
          <TextField
            fullWidth
            size='small'
            placeholder='Where are you going?'
            value={localSearch}
            onChange={e => {
              setLocalSearch(e.target.value)
              setShowAutocomplete(true)
            }}
            onFocus={() => setShowAutocomplete(true)}
            InputProps={{
              startAdornment: (
                <i className='tabler-map-pin' style={{ marginRight: 8, color: '#747782', fontSize: 20 }} />
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: '#f7f9fc'
              }
            }}
          />
          {showAutocomplete && localSearch.length > 0 && filteredDestinations.length > 0 && (
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1300,
                mt: 0.5,
                borderRadius: 2,
                maxHeight: 240,
                overflow: 'auto'
              }}
            >
              <List dense disablePadding>
                {filteredDestinations.map(d => (
                  <ListItemButton key={d.name} onClick={() => handleSelectDestination(d.name)}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <i className='tabler-map-pin' style={{ color: '#002155' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={d.name}
                      secondary={d.country}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
                      secondaryTypographyProps={{ fontSize: 12 }}
                    />
                    <Typography variant='caption' sx={{ color: '#747782' }}>
                      {d.stayCount}+ stays
                    </Typography>
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Date Range */}
        <Button
          variant='outlined'
          onClick={e => setDateAnchor(e.currentTarget)}
          sx={{
            flex: 1,
            borderRadius: 2,
            borderColor: '#e0e3e6',
            color: '#191c1e',
            textTransform: 'none',
            justifyContent: 'flex-start',
            bgcolor: '#f7f9fc',
            '&:hover': { borderColor: '#002155', bgcolor: '#f7f9fc' }
          }}
          startIcon={<i className='tabler-calendar' style={{ color: '#747782' }} />}
        >
          {dateRange.start} — {dateRange.end}
        </Button>
        <Popover
          open={Boolean(dateAnchor)}
          anchorEl={dateAnchor}
          onClose={() => setDateAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{ paper: { sx: { borderRadius: 2, p: 2, minWidth: 220 } } }}
        >
          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 700, color: '#002155' }}>
            Quick Select Dates
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {quickDates.map(qd => (
            <ListItemButton
              key={qd.label}
              onClick={() => {
                setDateRange({ start: qd.start, end: qd.end })
                setDateAnchor(null)
              }}
              sx={{ borderRadius: 1.5, mb: 0.5 }}
              selected={dateRange.start === qd.start}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <i className='tabler-calendar-event' style={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText primary={qd.label} primaryTypographyProps={{ fontSize: 14 }} />
            </ListItemButton>
          ))}
        </Popover>

        {/* Guests & Rooms */}
        <Button
          variant='outlined'
          onClick={e => setGuestAnchor(e.currentTarget)}
          sx={{
            flex: 1,
            borderRadius: 2,
            borderColor: '#e0e3e6',
            color: '#191c1e',
            textTransform: 'none',
            justifyContent: 'flex-start',
            bgcolor: '#f7f9fc',
            '&:hover': { borderColor: '#002155', bgcolor: '#f7f9fc' }
          }}
          startIcon={<i className='tabler-users' style={{ color: '#747782' }} />}
        >
          {guests.adults} Adults · {guests.rooms} Room
        </Button>
        <Popover
          open={Boolean(guestAnchor)}
          anchorEl={guestAnchor}
          onClose={() => setGuestAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          slotProps={{ paper: { sx: { borderRadius: 2, p: 2.5, minWidth: 220 } } }}
        >
          <Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 700, color: '#002155' }}>
            Guests & Rooms
          </Typography>
          {/* Adults */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Adults
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                size='small'
                onClick={() => setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) })}
                sx={{ border: '1px solid #e0e3e6' }}
              >
                <i className='tabler-minus' style={{ fontSize: 16 }} />
              </IconButton>
              <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{guests.adults}</Typography>
              <IconButton
                size='small'
                onClick={() => setGuests({ ...guests, adults: Math.min(10, guests.adults + 1) })}
                sx={{ border: '1px solid #e0e3e6' }}
              >
                <i className='tabler-plus' style={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
          {/* Rooms */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant='body2' sx={{ fontWeight: 600 }}>
              Rooms
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                size='small'
                onClick={() => setGuests({ ...guests, rooms: Math.max(1, guests.rooms - 1) })}
                sx={{ border: '1px solid #e0e3e6' }}
              >
                <i className='tabler-minus' style={{ fontSize: 16 }} />
              </IconButton>
              <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{guests.rooms}</Typography>
              <IconButton
                size='small'
                onClick={() => setGuests({ ...guests, rooms: Math.min(5, guests.rooms + 1) })}
                sx={{ border: '1px solid #e0e3e6' }}
              >
                <i className='tabler-plus' style={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Popover>

        {/* Search Button */}
        <Button
          variant='contained'
          onClick={() => setSearchDestination(localSearch)}
          sx={{
            bgcolor: '#febb02',
            color: '#6c4d00',
            fontWeight: 800,
            borderRadius: 2,
            textTransform: 'uppercase',
            letterSpacing: 1,
            px: 3,
            '&:hover': { bgcolor: '#e5a800' },
            boxShadow: 'none'
          }}
        >
          Search Deals
        </Button>

        {/* Filter Button */}
        <IconButton
          onClick={() => setFilterDrawerOpen(true)}
          sx={{
            border: '1px solid #e0e3e6',
            borderRadius: 2,
            bgcolor: '#f7f9fc',
            '&:hover': { bgcolor: '#e8ecf4' }
          }}
        >
          <i className='tabler-adjustments-horizontal' style={{ fontSize: 20, color: '#002155' }} />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default SearchBar
