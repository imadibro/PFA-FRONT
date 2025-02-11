'use client'
// MUI Imports
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
import Paper from '@mui/material/Paper'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import React from 'react'
import CustomBadge from './Badge'

// Type Imports
type TableProps = {
  data: any[]
  headBg?: string
}

type RowProps = {
  row: any
  columns: string[]
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  maxHeight: '500px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '4px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.paper
  }
}))

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650
}))

const Row = ({ row, columns }: RowProps) => {
  return (
    <TableRow>
      {columns.map(col => {
        const value = row[col]

        if (Array.isArray(value)) {
          return (
            <TableCell key={col} align={'left'}>
              <div className='flex justify-evenly'>
                {value.map((item, index) => (
                  <CustomBadge
                    key={index}
                    tonal='true'
                    color='primary'
                    badgeContent={item.label}
                    sx={{ marginLeft: '8px', minWidth: '30%', height: '100%' }}
                  ></CustomBadge>
                ))}
              </div>
            </TableCell>
          )
        }

        if (typeof value === 'object' && value !== null) {
          return (
            <TableCell key={col} align={'left'}>
              {Object.entries(value).map(([subKey, subValue]) => (
                <div key={subKey}>
                  <CustomBadge
                    tonal='true'
                    color={subValue == 'high' ? 'error' : 'default'}
                    badgeContent={subValue + ''}
                    sx={{ marginLeft: '8px', minWidth: '30%' }}
                  ></CustomBadge>
                </div>
              ))}
            </TableCell>
          )
        }

        return (
          <TableCell key={col} align={'left'}>
            {value}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

const CustomTable = ({ data, headBg = 'primary' }: TableProps) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : []
  return (
    <StyledTableContainer>
      <StyledTable aria-label='custom table'>
        <TableHead>
          <TableRow>
            {columns.map(col => (
              <TableCell
                key={col}
                align={'left'}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: `var(--mui-palette-${headBg}-lightOpacity)`,
                  padding: '12px 16px',
                  color: `var(--mui-palette-${headBg}-main)`,
                  textTransform: 'capitalize',
                  borderBottom: `2px solid var(--mui-palette-${headBg}-main)`,
                  '&:hover': {
                    backgroundColor: `var(--mui-palette-${headBg}-main)`,
                    color: `white`
                  }
                }}
              >
                {col.charAt(0).toUpperCase() + col.slice(1)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <Row key={index} row={row} columns={columns} />
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  )
}

export default CustomTable
