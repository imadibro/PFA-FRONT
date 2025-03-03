import type { MouseEvent } from 'react'
import { useState } from 'react'
import type { GridColDef } from '@mui/x-data-grid'
import type { ChipProps, TypographyProps } from '@mui/material'
import { Chip, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import type { GridBaseColDef } from '@mui/x-data-grid/internals'
import { formatDateFR, formatTimeFR } from '@/@core/utils/format'

export interface CellType {
  row: any
}

interface Row {
  id: string
}

interface RowOptionsHookProps {
  toggleEditMode: (row: Row) => void
  deleteObject: (id: string) => void
}

interface RowOptionProps {
  row: Row
  toggleEditMode: (row: any) => void
  deleteObject: (id: string) => void
  customAction?: any
  handleCustomAction?: (row: any) => void
}
interface DynamicColumn extends GridBaseColDef {}
interface ColumnsProps {
  toggleEditMode?: (row: Row | any) => void
  deleteObject?: (id: string) => void
  customColumns: DynamicColumn[]
  includeActions?: boolean
  customAction?: any
  handleCustomAction?: (row: any) => void
}

type Condition = {
  value: string | number
  chipProps: ChipProps
}

type RenderChipsCellProps = {
  field: string
  chipProps?: ChipProps
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

export const useRowOptions = ({ toggleEditMode, deleteObject }: RowOptionsHookProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = (row: any) => {
    toggleEditMode(row)
    handleRowOptionsClose()
  }

  const handleDelete = (row: any) => {
    if (row?.id) {
      deleteObject(row.id)
    }
    handleRowOptionsClose()
  }

  return {
    anchorEl,
    rowOptionsOpen,
    handleRowOptionsClick,
    handleRowOptionsClose,
    handleEdit,
    handleDelete
  }
}
export const RowOptions = ({ row, toggleEditMode, deleteObject, customAction, handleCustomAction }: RowOptionProps) => {
  const { anchorEl, rowOptionsOpen, handleRowOptionsClick, handleRowOptionsClose, handleEdit, handleDelete } =
    useRowOptions({ toggleEditMode, deleteObject })

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <i className='tabler-dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        {customAction && handleCustomAction && (
          <MenuItem
            onClick={() => {
              handleCustomAction(row)
              handleRowOptionsClose()
            }}
            sx={{ '& i, & svg': { mr: 2 } }}
          >
            <i className='tabler-file-invoice text-gray-500' />
            {customAction}
          </MenuItem>
        )}
        <MenuItem onClick={() => handleEdit(row)} sx={{ '& i, & svg': { mr: 2 } }}>
          <i className='tabler-edit text-green-500' />
          Modifier
        </MenuItem>
        <MenuItem onClick={() => handleDelete(row)} sx={{ '& svg': { mr: 2 } }}>
          <i className='tabler-trash text-red-500' />
          Supprimer
        </MenuItem>
      </Menu>
    </>
  )
}

export const GetColumns = ({
  toggleEditMode,
  deleteObject,
  customColumns,
  includeActions = false, // Default to false if not provided
  customAction = '',
  handleCustomAction = () => {}
}: ColumnsProps): GridColDef[] => {
  const columns: GridColDef[] = [...(customColumns as GridBaseColDef[])]

  if (includeActions && toggleEditMode && deleteObject) {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: ({ row }) => (
        <RowOptions
          toggleEditMode={toggleEditMode}
          deleteObject={deleteObject}
          row={row}
          customAction={customAction}
          handleCustomAction={handleCustomAction}
        />
      )
    })
  }

  return columns
}

// Helper functions to render cells
export const renderTypographyCell =
  (field: string) =>
  ({ row }: CellType) => (
    <Typography
      noWrap
      sx={{
        fontWeight: 500,
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '100%'
      }}
      title={row[field]}
    >
      {row[field]}
    </Typography>
  )
export const renderConcatenatedTypographyCell =
  (fields: string[]) =>
  ({ row }: CellType) => {
    const text = fields
      .map(field => field.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), row))
      .filter(Boolean)
      .join(' ')

    return (
      <Typography
        noWrap
        sx={{
          fontWeight: 500,
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%'
        }}
        title={text}
      >
        {text}
      </Typography>
    )
  }

export const renderDateCell =
  (field: string, showTime: boolean = false) =>
  ({ row }: CellType) => {
    const dateValue = new Date(row[field])

    const formattedDate = showTime
      ? formatDateFR(dateValue) + ' ⏱︎ ' + formatTimeFR(dateValue) // Add time if needed
      : formatDateFR(dateValue)
    return (
      <Typography
        noWrap
        sx={{
          fontWeight: 500,
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          width: '100%'
        }}
      >
        {formattedDate}
      </Typography>
    )
  }

export const renderChipCell =
  (
    field: string,
    conditions: Condition[],
    defaultChipProps: ChipProps = {},
    typographyProps: TypographyProps = {},
    nestedField?: string
  ) =>
  ({ row }: CellType) => {
    let fieldValue = row[field]

    if (nestedField && typeof fieldValue === 'object' && fieldValue !== null) {
      fieldValue = fieldValue[nestedField]
    }

    const matchedCondition = conditions.find(condition => fieldValue === condition.value)

    const chipProps = matchedCondition ? { ...matchedCondition.chipProps } : { ...defaultChipProps }

    const updatedTypographyProps = {
      ...typographyProps,
      sx: {
        fontWeight: 500,
        color: 'text.secondary',
        display: 'flex',
        alignItems: 'center',
        marginTop: -2,
        ...typographyProps.sx
      }
    }

    return (
      <Typography {...updatedTypographyProps}>
        <Chip label={fieldValue} {...chipProps} className='mt-4' sx={{ margin: 'auto' }} />
      </Typography>
    )
  }

export const renderChipsCell =
  ({ field, chipProps = {}, containerProps = {} }: RenderChipsCellProps) =>
  ({ row }: CellType) => {
    const items: any[] = row[field] || []

    return (
      <div
        className='text-center space-x-1 overflow-auto'
        title={field}
        {...containerProps}
        style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}
      >
        {items.map((item, index) => (
          <Chip key={index} label={item.label} {...chipProps} />
        ))}
      </div>
    )
  }
