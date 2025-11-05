import { useToastComponante } from '@/components/common/ToastComponante'
import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'
import type { IActionColumnsProps, ICellType, IVehicule } from '@core/utils/types'
import { Icon } from '@iconify/react'
import { Card, IconButton, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

const RowOptions = ({ row, toggleEditMode, deleteObject }: IActionColumnsProps<IVehicule>) => {
  const { confirmDelete } = useToastComponante()

  const handleEdit = () => {
    toggleEditMode(row!)
  }

  const handleDelete = async () => {
    const result = await confirmDelete('')

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

const columns = ({ toggleEditMode, deleteObject }: IActionColumnsProps<IVehicule>): GridColDef[] => {
  return [
    {
      field: 'registrationId',
      headerName: 'Registration',
      flex: 1
    },
    {
      field: 'vehiculeOwner',
      headerName: 'Propriétaire',
      flex: 1,
      renderCell: ({ row }: ICellType<IVehicule>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.vehiculeOwner ? row.vehiculeOwner.name : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'vehiculeType',
      headerName: 'Type du véhicule',
      flex: 1,
      renderCell: ({ row }: ICellType<IVehicule>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.vehiculeType ? row.vehiculeType.vehicule_type : 'N/A'}
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
      renderCell: ({ row }: ICellType<IVehicule>) => (
        <RowOptions row={row} toggleEditMode={toggleEditMode} deleteObject={deleteObject} />
      )
    }
  ]
}

type Props = {
  vehicules: IVehicule[]
  totalItems: number
  isLoading: boolean
  handleDelete: (id: string) => void
  toggleEditMode: (vehicule: IVehicule) => void
  toggleForm: () => void
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel) => void
  searchValue: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
}

const VehiculeView = (props: Props) => {
  const {
    vehicules,
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
        title='Vehicule'
        data={vehicules}
      />
    )
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
  }

  return (
    <Card sx={{ boxShadow: 'none' }}>
      <DataGrid
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
        rowHeight={35}
        rowCount={totalItems}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        rows={vehicules}
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

export default VehiculeView
