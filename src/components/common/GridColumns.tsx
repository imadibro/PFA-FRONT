import { GridColDef } from '@mui/x-data-grid'
import { Chip, IconButton, Menu, MenuItem } from '@mui/material'
import { MouseEvent, useState } from 'react'
import { GridBaseColDef } from '@mui/x-data-grid/internals'
import { formatDateFR } from '@/@core/utils/format'
import { ChipProps, Typography, TypographyProps } from '@mui/material'

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
}
interface DynamicColumn extends GridBaseColDef {}
interface ColumnsProps {
  toggleEditMode?: (row: Row | any) => void
  deleteObject?: (id: string) => void
  customColumns: DynamicColumn[]
  includeActions?: boolean
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
export const RowOptions = ({ row, toggleEditMode, deleteObject }: RowOptionProps) => {
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
  includeActions = false // Default to false if not provided
}: ColumnsProps): GridColDef[] => {
  const columns: GridColDef[] = [...(customColumns as GridBaseColDef[])]

  if (includeActions && toggleEditMode && deleteObject) {
    columns.push({
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: ({ row }) => <RowOptions toggleEditMode={toggleEditMode} deleteObject={deleteObject} row={row} />
    })
  }

  return columns
}

// Helper functions to render cells
export const renderTypographyCell =
  (field: string) =>
  ({ row }: CellType) => (
    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }} title={row[field]}>
      {row[field]}
    </Typography>
  )
export const renderDateCell =
  (field: string) =>
  ({ row }: CellType) => (
    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
      {formatDateFR(new Date(row[field]))}
    </Typography>
  )

export const renderChipCell =
  (field: string, conditions: Condition[], defaultChipProps: ChipProps = {}, typographyProps: TypographyProps = {}) =>
  ({ row }: CellType) => {
    const matchedCondition = conditions.find(condition => row[field] === condition.value)

    const chipProps = matchedCondition ? matchedCondition.chipProps : defaultChipProps
    return (
      <Typography sx={{ fontWeight: 500, color: 'text.secondary', ...typographyProps.sx }} {...typographyProps}>
        <Chip label={row[field]} {...chipProps} className='mt-4' />
      </Typography>
    )
  }

export const renderChipsCell =
  ({ field, chipProps = {}, containerProps = {} }: RenderChipsCellProps) =>
  ({ row }: CellType) => {
    const items: any[] = row[field] || []

    return (
      <div className='text-center space-x-1 overflow-auto' title={field} {...containerProps}>
        {items.map((item, index) => (
          <Chip key={index} label={item.label} {...chipProps} />
        ))}
      </div>
    )
  }
