'use client'

import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import { Card, CardContent, Grid } from '@mui/material'
import React, { useState } from 'react'

import { useGetAllProjectForClientsQuery } from '@/store/features/project/projectApi'
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'

export const ClientContainer = () => {
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const [searchValue, setSearchValue] = useState<string>('')

  const { data, isLoading } = useGetAllProjectForClientsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchValue
  })

  const clients = data?.projects ?? []
  const totalItems = data?.total ?? 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  const columns = (): GridColDef[] => {
    return [
      {
        field: 'projectCode',
        headerName: 'Code projet',
        flex: 1
      },
      {
        field: 'refProject',
        headerName: 'Référence projet',
        flex: 1
      },
      {
        field: 'piloteFullName',
        headerName: 'Responsable projet',
        flex: 1
      }
    ]
  }

  const CustomToolbar = (toolbarProps: any) => {
    return (
      <QuickSearchToolbar
        {...toolbarProps}
        value={searchValue}
        onChange={handleSearchChange}
        clearSearch={clearSearch}
        title='Clients'
        data={clients}
        showAddButton={false}
      />
    )
  }

  const handlePaginationChange = (model: GridPaginationModel) => {
    setPaginationModel(model)
  }

  return (
    <Grid>
      <CardContent sx={{ p: '0' }}>
        <Card sx={{ boxShadow: 'none', padding: 2 }}>
          <Card sx={{ boxShadow: 'none' }}>
            <DataGrid
              sx={{
                boxShadow: 'none',
                border: 'none',
                backgroundColor: 'transparent'
              }}
              columns={columns()}
              paginationModel={paginationModel}
              paginationMode='server'
              onPaginationModelChange={handlePaginationChange}
              loading={isLoading}
              autoHeight
              rowHeight={35}
              rowCount={totalItems}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
              rows={clients}
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
        </Card>
      </CardContent>
    </Grid>
  )
}
