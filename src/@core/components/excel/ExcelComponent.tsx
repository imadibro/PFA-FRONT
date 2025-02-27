import { Button } from '@mui/material'
import React from 'react'
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

export const ExcelComponent = (props: Props) => {
  const { data, fileName } = props

  return (
    <Button
      disabled={data.length === 0}
      sx={{ '& svg': { mr: 2 }, mr: 2 }}
      variant='outlined'
      color='success'
      title='Export Excel'
      onClick={() => exportToXLSX(data, fileName)}
    >
      <span className='tabler-file-spreadsheet' />
      Export
    </Button>
  )
}
