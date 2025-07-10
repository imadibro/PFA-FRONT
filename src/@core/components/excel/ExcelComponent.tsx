import React from 'react'
import { Button } from '@mui/material'
import * as XLSX from 'xlsx'

const exportToXLSX = (data: any, fileName: string) => {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, fileName)
}

interface Props {
  data: any
  fileName: string
}

const ExcelComponent = (props: Props) => {
  const { data, fileName } = props

  return (
    <Button
      disabled={!data || data.length === 0}
      sx={{
        bgcolor: '#32aa68',
        color: '#222',
        mr: 2,
        fontWeight: 600,
        boxShadow: 'none',
        '&:hover': { bgcolor: '#34e78e', boxShadow: 'none' },
        '& i': { mr: 1 }
      }}
      variant='contained'
      title='Export Excel'
      onClick={() => exportToXLSX(data, fileName)}
    >
      <i className='tabler-file-export' />
      Exporter
    </Button>
  )
}

export default ExcelComponent
