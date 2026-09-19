'use client'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

import { useGlobalHorizon } from './GlobalHorizonContext'
import { MOCK_CATEGORIES } from './mockData'

const CategoryChips = () => {
  const { selectedCategory, setSelectedCategory } = useGlobalHorizon()

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        overflowX: 'auto',
        pb: 1,
        mb: 3,
        '&::-webkit-scrollbar': { height: 4 },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#e0e3e6', borderRadius: 2 }
      }}
    >
      {MOCK_CATEGORIES.map(cat => {
        const isActive = selectedCategory === cat.value

        return (
          <Chip
            key={cat.value}
            label={cat.label}
            onClick={() => setSelectedCategory(cat.value)}
            avatar={
              <Avatar
                sx={{
                  bgcolor: isActive ? '#002155 !important' : '#f7f9fc !important',
                  width: 28,
                  height: 28
                }}
              >
                <i
                  className={cat.icon}
                  style={{
                    fontSize: 15,
                    color: isActive ? '#ffffff' : '#434651'
                  }}
                />
              </Avatar>
            }
            sx={{
              px: 1,
              height: 38,
              borderRadius: '20px',
              fontWeight: isActive ? 700 : 500,
              fontSize: 13,
              bgcolor: isActive ? '#002155' : '#ffffff',
              color: isActive ? '#ffffff' : '#434651',
              border: isActive ? 'none' : '1px solid #e0e3e6',
              '&:hover': {
                bgcolor: isActive ? '#003580' : '#f7f9fc'
              },
              flexShrink: 0
            }}
          />
        )
      })}
    </Box>
  )
}

export default CategoryChips
