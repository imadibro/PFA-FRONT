import type { ChangeEvent } from 'react'
import React, { useState, forwardRef } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Button } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { DatePicker } from '@mui/lab'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { formatDate, formatDateFR } from '@/@core/utils/format'
import CustomTextField from '@/@core/components/mui/TextField'
import ExcelComponent from '@/@core/components/excel/ExcelComponent'

interface Props {
  value: string
  clearSearch: () => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  toggleForm: () => void
  title: string
  handleChecked: (checked: boolean) => void
  checkBoxLabel: string
  showCheckBox: boolean
  showDateFilter: boolean
  handleDateFilter: (start: Date, end: Date) => void
  clearDateFilter: () => void
  data: any
  showExcel: boolean | undefined
  hideAddButton: boolean | undefined
  handleImport?: (file: File) => void
}

interface PickerProps {
  label?: string
  end: Date | number | null
  start: Date | number | null
}

const QuickSearchToolbar = (props: Props) => {
  const [checked, setChecked] = useState<boolean>(false)
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(new Date())

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
    props.handleChecked(event.target.checked)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
    if (start && end) {
      props.handleDateFilter(start.setHours(0, 0, 0, 0), end.setHours(0, 0, 0, 0))
    }
  }

  const clearDateFilter = () => {
    setStartDateRange(new Date())
    setEndDateRange(new Date())
    props.clearDateFilter()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && props.handleImport) {
      props.handleImport(file)
    }
  }

  const CustomInput = forwardRef((datePickerProps: PickerProps, ref) => {
    const startDate = formatDate(datePickerProps.start + '')
    const endDate = datePickerProps.end !== null ? ` - ${formatDate(datePickerProps.end)}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return (
      <CustomTextField
        inputRef={ref}
        label={datePickerProps.label || ''}
        {...datePickerProps}
        value={value}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <i className='uiw:date' />
            </Box>
          ),
          endAdornment: (
            <IconButton size='small' title='Clear' aria-label='Clear' onClick={clearDateFilter}>
              <i className='tabler:x' />
            </IconButton>
          )
        }}
      />
    )
  })

  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <div style={{ display: 'flex' }}>
        <CustomTextField
          value={props.value}
          placeholder='Recherche…'
          autoFocus
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            props.onChange(event)
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <i className='tabler-search' />
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <i className='tabler-x' />
              </IconButton>
            )
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto'
            },
            '& .MuiInputBase-root > svg': {
              mr: 2
            },
            mr: 2
          }}
        />

        {props.showDateFilter ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              selectsRange
              monthsShown={2}
              endDate={endDateRange}
              selected={startDateRange}
              startDate={startDateRange}
              shouldCloseOnSelect={false}
              id='date-range-picker-months'
              onChange={handleOnChangeRange}
              customInput={<CustomInput end={endDateRange as Date | number} start={startDateRange as Date | number} />}
            />
          </LocalizationProvider>
        ) : null}

        {props.showCheckBox ? (
          <FormControlLabel
            sx={{ ml: 0 }}
            label={props.checkBoxLabel}
            control={<Checkbox checked={checked} onChange={handleChange} />}
          />
        ) : null}
      </div>
      <div>
        {props.showExcel && (
          <>
            <input
              accept='.xlsx, .xls'
              style={{ display: 'none' }}
              id='raised-button-file'
              type='file'
              onChange={handleFileChange}
            />
            {props.handleImport?.length && (
              <label htmlFor='raised-button-file' className='mx-2'>
                <Button variant='contained' component='span' color='info' sx={{ '& i, & svg': { mr: 2 } }}>
                  <span className='tabler-file-import' />
                  Importer
                </Button>
              </label>
            )}
            <ExcelComponent fileName={`${props.title}-${formatDateFR(new Date(), true)}.xlsx`} data={props.data} />
          </>
        )}
        {!props.hideAddButton && (
          <Button
            title={'Ajouter '.concat(props.title)}
            onClick={props.toggleForm}
            variant='contained'
            sx={{ '& i, & svg': { mr: 2 } }}
          >
            <i className='tabler-plus' />
            Ajouter
          </Button>
        )}
      </div>
    </Box>
  )
}

export default QuickSearchToolbar
