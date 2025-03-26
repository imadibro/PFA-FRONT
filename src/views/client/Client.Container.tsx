'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import type { IClients } from '@core/utils/types'
import QuickSearchToolbar from '@core/components/quicksearch/QuickSearchToolbar'

import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { clientService } from '@/@core/services/client.service'

export const ClientContainer = () => {
  const [clients, setClients] = useState<IClients[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [totalItems, setTotalItems] = useState<number>(0)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    clientService.getClient(paginationModel.page + 1, paginationModel.pageSize, searchValue).then(data => {
      setClients(data.items)
      setTotalItems(data.totalItems)
      setIsLoading(false)
    })
  }, [paginationModel, searchValue])

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
        field: 'activityLabel',
        headerName: 'Activites',
        flex: 1
      },
      {
        field: 'clientAgencyLabel',
        headerName: 'Client',
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
