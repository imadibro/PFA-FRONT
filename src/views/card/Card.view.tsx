import { Card, IconButton, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { Icon } from '@iconify/react'
import { formatToShowingCardDate } from '@core/utils/format'
import type { IActionColumnsProps, ICellType, ICard } from '@core/utils/types'
import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'
import { useToastComponante } from '@/components/common/DeletedComponante'

const RowOptions = ({ row, toggleEditMode, deleteObject }: IActionColumnsProps<ICard>) => {
  const { confirmDelete } = useToastComponante()

  const handleEdit = () => {
    toggleEditMode(row!)
  }

  const handleDelete = async () => {
    const result = await confirmDelete('cette carte')

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

const columns = ({ toggleEditMode, deleteObject }: IActionColumnsProps<ICard>): GridColDef[] => {
  return [
    {
      field: 'matricule',
      headerName: 'matricule',
      flex: 1
    },
    {
      field: 'expireDate',
      headerName: `Date d'expiration`,
      flex: 1,
      renderCell: ({ row }: ICellType<ICard>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {formatToShowingCardDate(row.expireDate)}
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
      renderCell: ({ row }: ICellType<ICard>) => (
        <RowOptions row={row} toggleEditMode={toggleEditMode} deleteObject={deleteObject} />
      )
    }
  ]
}

type Props = {
  cards: ICard[]
  totalItems: number
  isLoading: boolean
  handleDelete: (id: string) => void
  toggleEditMode: (card: ICard) => void
  toggleForm: () => void
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel) => void
  searchValue: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
}

const CardView = (props: Props) => {
  const {
    cards,
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
        title='Carte'
        data={cards}
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
        rows={cards}
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

export default CardView
