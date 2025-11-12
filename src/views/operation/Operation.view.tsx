import { useToastComponante } from '@/components/common/ToastComponante'
import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'
import type { IActionColumnsProps, ICellType, IOperation } from '@core/utils/types'
import { Icon } from '@iconify/react'
import { Card, IconButton, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

const RowOptions = ({ row, toggleEditMode, deleteObject }: IActionColumnsProps<IOperation>) => {
  const { confirmDelete } = useToastComponante()

  const handleEdit = () => {
    toggleEditMode(row!)
  }

  const handleDelete = async () => {
    const result = await confirmDelete('cette operation')

    if (result) row && deleteObject(row.id!)
  }

  return (
    <>
      {/* <IconButton
        color='info'
        size='small'
        title='Detail'

        onClick={handleEdit}
      >
        <Icon icon='mdi:card-account-details-outline' />
      </IconButton> */}
      <IconButton color='primary' size='small' title='Modifier' onClick={handleEdit}>
        <Icon icon='tabler:edit' />
      </IconButton>
      <IconButton size='small' color='error' title='Supprimer' onClick={handleDelete}>
        <Icon icon='tabler:trash-x' />
      </IconButton>
    </>
  )
}

const columns = ({ toggleEditMode, deleteObject }: IActionColumnsProps<IOperation>): GridColDef[] => {
  return [
    {
      field: 'projet',
      headerName: 'Le projet',
      flex: 1,
      renderCell: ({ row }: ICellType<IOperation>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }} title={row.project?.projectCode}>
          {row.project?.projectCode ? row.project?.projectCode : '-'}
        </Typography>
      )
    },
    {
      field: 'clientName',
      headerName: 'Client',
      flex: 1,
      renderCell: ({ row }: ICellType<IOperation>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }} title={row.clientName}>
          {row.clientName ? row.clientName : '-'}
        </Typography>
      )
    },
    {
      field: 'site',
      headerName: 'Site',
      flex: 1,
      renderCell: ({ row }: ICellType<IOperation>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.site ? `${row.site.label} - ${row.site.siteNbr}` : '-'}
        </Typography>
      )
    },
    {
      field: 'operationTasks',
      headerName: 'Les operations',
      flex: 1,
      renderCell: ({ row }: ICellType<IOperation>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.operationTasks
            ? `${row.operationTasks.operationZone.label} - ${row.operationTasks.operationTrans.label} - ${row.operationTasks.operationType.label}`
            : 'N/A'}
        </Typography>
      )
    },

    {
      field: 'gabarit',
      headerName: 'Gabarit',
      flex: 1,
      renderCell: ({ row }: ICellType<IOperation>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.gabarit ? row.gabarit : '-'}
        </Typography>
      )
    },
    {
      field: 'isRecursive',
      headerName: 'Operation récursives',
      flex: 1,
      renderCell: ({ row }: ICellType<IOperation>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.isRecursive ? 'Oui' : 'Non'}
        </Typography>
      )
    },
    {
      align: 'left',
      headerAlign: 'left',
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: ICellType<IOperation>) => (
        <RowOptions row={row} toggleEditMode={toggleEditMode} deleteObject={deleteObject} />
      )
    }
  ]
}

type Props = {
  operation: IOperation[]
  totalItems: number
  isLoading: boolean
  handleDelete: (id: string) => void
  toggleEditMode: (operationToEdit: IOperation) => void
  toggleForm: () => void
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel) => void
  searchValue: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
}

const OperationView = (props: Props) => {
  const {
    operation,
    totalItems,
    isLoading,
    handleDelete,
    toggleEditMode,
    toggleForm,
    setPaginationModel,
    paginationModel,
    searchValue,
    handleSearchChange,
    clearSearch
  } = props

  const CustomToolbar = (toolbarProps: any) => {
    return (
      <QuickSearchToolbar
        {...toolbarProps}
        value={searchValue}
        onChange={handleSearchChange}
        clearSearch={clearSearch}
        toggleForm={toggleForm}
        title='Operation'
        data={operation}
      />
    )
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
  }

  return (
    <Card sx={{ boxShadow: 'none' }}>
      <DataGrid
        getRowHeight={() => 'auto'} // Hauteur automatique
        sx={{
          boxShadow: 'none',
          border: 'none',
          backgroundColor: 'transparent'
        }}
        columns={columns({ toggleEditMode, deleteObject: handleDelete })}
        paginationModel={paginationModel}
        paginationMode='server'
        onPaginationModelChange={handlePaginationChange}
        loading={isLoading}
        autoHeight
        rowCount={totalItems}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        rows={operation}
        localeText={{
          noRowsLabel: 'Aucune donnes a afficher',
          MuiTablePagination: { labelRowsPerPage: 'Lignes par page' }
        }}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          }
        }}
      />
    </Card>
  )
}

export default OperationView
