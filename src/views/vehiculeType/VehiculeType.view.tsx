import { useToastComponante } from '@/components/common/ToastComponante'
import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'
import type { IActionColumnsProps, ICellType, IVehiculeType } from '@core/utils/types'
import { Icon } from '@iconify/react'
import { Card, IconButton } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

const RowOptions = ({ row, toggleEditMode, deleteObject }: IActionColumnsProps<IVehiculeType>) => {
  const { confirmDelete } = useToastComponante()

  const handleEdit = () => {
    toggleEditMode(row!)
  }

  const handleDelete = async () => {
    const result = await confirmDelete('ce type de vehicule')

    if (result) row && deleteObject(row.id!)
  }

  return (
    <>
      {/* <IconButton
        color='info'
        size='small'
        title='Detail'

        // onClick={handleEdit}
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

const columns = ({ toggleEditMode, deleteObject }: IActionColumnsProps<IVehiculeType>): GridColDef[] => {
  return [
    {
      field: 'vehicule_type',
      headerName: 'Type de Vehicule',
      flex: 1
    },
    {
      field: 'cost',
      headerName: 'Coût du véhicule',
      flex: 1
    },
    {
      align: 'left',
      headerAlign: 'left',
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: ICellType<IVehiculeType>) => (
        <RowOptions row={row} toggleEditMode={toggleEditMode} deleteObject={deleteObject} />
      )
    }
  ]
}

type Props = {
  vehiculeType: IVehiculeType[]
  totalItems: number
  isLoading: boolean
  handleDelete: (id: string) => void
  toggleEditMode: (vehiculeType: IVehiculeType) => void
  toggleForm: () => void
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel) => void
  searchValue: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
}

const VehiculeTypeView = (props: Props) => {
  const {
    vehiculeType,
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
        title='Type de véhicule'
        data={vehiculeType}
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
        rows={vehiculeType}
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

export default VehiculeTypeView
