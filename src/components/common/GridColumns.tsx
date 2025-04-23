import { formatDateFR, formatTimeFR } from '@/@core/utils/format'
import type { IActionColumnsProps, IEmployee } from '@/@core/utils/types'
import { Icon } from '@iconify/react'
import type { ChipProps, TypographyProps } from '@mui/material'
import { Chip, IconButton, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import type { GridBaseColDef } from '@mui/x-data-grid/internals'

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

const RowOptions = ({ row, toggleEditMode, deleteObject }: IActionColumnsProps<IEmployee>) => {
  const handleEdit = () => {
    toggleEditMode(row!)
  }

  const handleDelete = async () => {
    row && deleteObject(row.id!)
  }

  return (
    <>
      <IconButton color='primary' size='small' title='Modifier' onClick={handleEdit}>
        <Icon icon='tabler:edit' />
      </IconButton>
      <IconButton size='small' color='error' title='Supprimer' onClick={handleDelete}>
        <Icon icon='tabler:trash-x' />
      </IconButton>
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
  ({ row }: CellType) => {
    // Support nested fields like "operationType.label"
    const value = field.split('.').reduce((acc, key) => acc && acc[key], row)

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
        title={value}
      >
        {value}
      </Typography>
    )
  }

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
