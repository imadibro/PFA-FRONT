import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'
import type { IActionColumnsProps, ICellType, IEquipe, IEquipeRequest } from '@core/utils/types'
import { Icon } from '@iconify/react'
import { Box, Card, IconButton, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { useToastComponante } from '@/components/common/DeletedComponante'

const RowOptions = ({ row, toggleEditMode, deleteObject }: IActionColumnsProps<IEquipe>) => {
  const { confirmDelete } = useToastComponante()

  const handleEdit = () => {
    toggleEditMode(row!)
  }

  const handleDelete = async () => {
    const result = await confirmDelete('cette equipe')

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

const columns = ({ toggleEditMode, deleteObject }: IActionColumnsProps<IEquipe>): GridColDef[] => {
  return [
    {
      field: 'name',
      headerName: "Nom d'equipe",
      flex: 1
    },
    {
      field: 'members',
      headerName: 'Employé',
      flex: 1,
      renderCell: ({ row }: ICellType<IEquipe>) => (
        <Box>
          {row.members.length > 0
            ? row.members.map((member, idx) => (
                <Typography key={idx} sx={{ fontWeight: 500, color: 'text.secondary', whiteSpace: 'normal' }}>
                  {member.name}
                </Typography>
              ))
            : 'N/A'}
        </Box>
      )
    },
    {
      field: 'roles',
      headerName: 'Rôle',
      flex: 1,
      renderCell: ({ row }: ICellType<IEquipeRequest>) => (
        <Box>
          {row.members.length > 0
            ? row.members.map((member, idx) => (
                <Typography key={idx} sx={{ fontWeight: 500, color: 'text.secondary', whiteSpace: 'normal' }}>
                  {member.role}
                </Typography>
              ))
            : 'N/A'}
        </Box>
      )
    },

    {
      field: 'highwayCard',
      headerName: 'Carte Tele Paige',
      flex: 1,
      renderCell: ({ row }: ICellType<IEquipe>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.highwayCard?.matricule ? row.highwayCard.matricule : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'fuelCard',
      headerName: 'Carte Gasoil',
      flex: 1,
      renderCell: ({ row }: ICellType<IEquipe>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.fuelCard ? row.fuelCard.matricule : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'vehicule',
      headerName: 'Vehicule',
      flex: 1,
      renderCell: ({ row }: ICellType<IEquipe>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.vehicule?.registrationId ? row.vehicule.registrationId : 'N/A'}
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
      renderCell: ({ row }: ICellType<IEquipe>) => (
        <RowOptions row={row} toggleEditMode={toggleEditMode} deleteObject={deleteObject} />
      )
    }
  ]
}

type Props = {
  equipes: IEquipe[]
  totalItems: number
  isLoading: boolean
  handleDelete: (id: string) => void
  toggleEditMode: (vehicule: IEquipe) => void
  toggleForm: () => void
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel) => void
  searchValue: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
}

const EquipeView = (props: Props) => {
  const {
    equipes,
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
        title='Equipe'
        data={equipes}
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
        // rowHeight={35}
        pageSizeOptions={[10, 25, 50]}
        rowCount={totalItems}
        disableRowSelectionOnClick
        rows={equipes}
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

export default EquipeView
