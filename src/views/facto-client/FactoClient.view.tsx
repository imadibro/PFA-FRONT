import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'
import type { ICellType, IFactoClient } from '@core/utils/types'
import { Card, Typography } from '@mui/material'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import React from 'react'

const ColorCell = ({ row, handleColorChange, colorChange }: any) => {
  const initial = colorChange[row.id] ?? row.colorCode
  const [tempColor, setTempColor] = React.useState(initial)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor(e.target.value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleColorChange(row.id, e.target.value)
  }

  return (
    <input
      type='color'
      value={tempColor}
      onInput={handleInput}
      onBlur={handleBlur}
      style={{
        width: 50,
        height: 30,
        border: 'none',
        borderRadius: 4,
        background: 'none',
        cursor: 'pointer',
        verticalAlign: 'middle'
      }}
      title={row.colorCode}
    />
  )
}

// ensuite seulement: const FactoClientview = (props: Props) => { ... }

const columns = ({ handleColorChange, colorChange }: any): GridColDef[] => {
  return [
    {
      field: 'clientName',
      headerName: 'Nom du client',
      flex: 1,
      renderCell: ({ row }: ICellType<IFactoClient>) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {row.clientName ? `${row.clientName}` : 'N/A'}
        </Typography>
      )
    },
    {
      field: 'colorCode',
      headerName: 'Couleur',
      flex: 1,
      renderCell: ({ row }: ICellType<IFactoClient>) => (
        <ColorCell row={row} handleColorChange={handleColorChange} colorChange={colorChange} />
      )
    }
    // {
    //   field: 'colorCode',
    //   headerName: 'Couleur',
    //   flex: 1,
    //   renderCell: ({ row }: ICellType<IFactoClient>) => (
    //     <input
    //       type='color'
    //       value={colorChange[row.id] ?? row.colorCode}
    //       style={{
    //         width: 50,
    //         height: 30,
    //         border: 'none',
    //         borderRadius: 4,
    //         background: 'none',
    //         cursor: 'pointer',
    //         verticalAlign: 'middle'
    //       }}
    //       onChange={e => handleColorChange(row.id, e.target.value)}
    //       title={row.colorCode}
    //     />
    //   )
    // }
  ]
}

type Props = {
  factoClients: IFactoClient[]
  totalItems: number
  isLoading: boolean
  paginationModel: GridPaginationModel
  setPaginationModel: (model: GridPaginationModel) => void
  searchValue: string
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearSearch: () => void
  handleColorChange: (clientId: string, color: string) => void
  handleSave: () => void
  colorChange: Record<string, string>
}

const FactoClientview = (props: Props) => {
  const {
    factoClients,
    totalItems,
    isLoading,
    setPaginationModel,
    paginationModel,
    searchValue,
    handleSearchChange,
    clearSearch,
    handleColorChange,
    handleSave,
    colorChange
  } = props

  const CustomToolbar = (toolbarProps: any) => {
    return (
      <QuickSearchToolbar
        showAddButton={false}
        {...toolbarProps}
        value={searchValue}
        onChange={handleSearchChange}
        clearSearch={clearSearch}
        title='Facto-clients'
        data={factoClients}
        savedButton={true}
        handleSave={handleSave}
      />
    )
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
  }

  return (
    <Card sx={{ boxShadow: 'none' }}>
      <DataGrid
        getRowHeight={() => 'auto'}
        sx={{
          boxShadow: 'none',
          border: 'none',
          backgroundColor: 'transparent'
        }}
        columns={columns({ handleColorChange, colorChange })}
        paginationModel={paginationModel}
        paginationMode='server'
        onPaginationModelChange={handlePaginationChange}
        loading={isLoading}
        autoHeight
        rowCount={totalItems}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        rows={factoClients}
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

export default FactoClientview
