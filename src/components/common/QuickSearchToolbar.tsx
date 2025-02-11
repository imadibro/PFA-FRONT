import React, { useState, ChangeEvent, forwardRef } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Button } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import CustomTextField from '@/@core/components/mui/TextField'
import { DatePicker } from '@mui/lab'
import { formatDate } from '@/@core/utils/format'

interface Props {
  value: string
  clearSearch: () => void
  onChange: (e: ChangeEvent) => void
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
          onChange={props.onChange}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <i className='tabler:search' />
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <i className='tabler:x' />
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
        {!props.hideAddButton && (
          <Button
            title={'Ajouter '.concat(props.title)}
            onClick={props.toggleForm}
            variant='contained'
            sx={{ '& svg': { mr: 2 } }}
          >
            <i className='tabler:plus' />
            Ajouter
          </Button>
        )}
      </div>
    </Box>
  )
}

export default QuickSearchToolbar
