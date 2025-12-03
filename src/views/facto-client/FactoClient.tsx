import { useToastComponante } from '@/components/common/ToastComponante'
import { useGetFactoClientsQuery, useUpdateFactoClientColorMutation } from '@/store/features/factoClient/factoClientApi'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import { Card, CardContent, Grid } from '@mui/material'
import React, { useState } from 'react'
import FactoClientview from './FactoClient.view'

const FactoClient = () => {
  const [colorChange, setColorChange] = useState<Record<string, string>>({})
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })
  const [searchValue, setSearchValue] = useState<string>('')
  const { data, isLoading: isFetching } = useGetFactoClientsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchValue
  })
  const [updateClientColor] = useUpdateFactoClientColorMutation()

  const { confirmSave, showErrorToast } = useToastComponante()

  const factoClients = data?.data || []
  const totalItems = data?.total || 0

  const clearSearch = () => {
    setSearchValue('')
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleColorChange = (clientId: string, color: string) => {
    setColorChange(prev => ({
      ...prev,
      [clientId]: color
    }))
  }

  const handleSave = async () => {
    try {
      // Envoie tous les changements accumulés
      await Promise.all(
        Object.entries(colorChange).map(([clientId, color]) =>
          updateClientColor({ id: clientId, colorCode: color }).unwrap()
        )
      )
      setColorChange({})
      confirmSave('Les couleurs')
    } catch (err) {
      showErrorToast(err)
    }
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent sx={{ p: '0' }}>
          <Card sx={{ boxShadow: 'none', padding: 2 }}>
            <FactoClientview
              colorChange={colorChange}
              totalItems={totalItems}
              factoClients={factoClients}
              handleColorChange={handleColorChange}
              isLoading={isFetching}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              searchValue={searchValue}
              handleSearchChange={handleSearchChange}
              clearSearch={clearSearch}
              handleSave={handleSave}
            />
          </Card>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default FactoClient
