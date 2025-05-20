'use client'

import React, { useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import toast from 'react-hot-toast'
import { GENERAL_ERROR, TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@core/utils/toast-message'
import type { IEquipe, IEquipeRequest } from '@core/utils/types'
import EquipeView from './Equipe.view'
import EquipeForm from './Equipe.form'
import {
  useCreateEquipeMutation,
  useDeleteEquipeMutation,
  useGetEquipeQuery,
  useUpdateEquipeMutation
} from '@/store/features/equipe/equipeApi'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/@core/utils/constants'

const EquipeContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [equipeToEdit, setEquipeToEdit] = useState<IEquipe | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const [searchValue, setSearchValue] = useState<string>('')

  const { data, isLoading } = useGetEquipeQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchValue
  })

  const [createEquipe, { isLoading: isCreating }] = useCreateEquipeMutation()
  const [updateEquipe, { isLoading: isUpdating }] = useUpdateEquipeMutation()
  const [deleteEquipe, { isLoading: isDeleting }] = useDeleteEquipeMutation()
  const isAnyLoading = isLoading || isCreating || isDeleting || isUpdating

  const equipes = data?.data || []
  const totalItems = data?.total || 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (equipeToEdit: IEquipe) => {
    console.log('Équipe à modifier', JSON.stringify(equipeToEdit, null, 2))

    setIsEditMode(!isEditMode)
    setEquipeToEdit(equipeToEdit)
    toggleForm()
  }

  const handleCancelEditMode = () => {
    setIsEditMode(false)
    setEquipeToEdit(null)
    toggleForm()
  }

  const cancleEditMode = () => {
    setIsEditMode(false)
    setEquipeToEdit(null)
  }

  const handleAdd = async (newEquipe: IEquipeRequest) => {
    if (!newEquipe) {
      toast.error(GENERAL_ERROR)
      return
    }

    try {
      await createEquipe(newEquipe).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.ADD))
      toggleForm()
    } catch (error) {
      console.error('Error adding vehicule:', error)
      toast.error('Failed to add vehicule')
    }
  }

  const handleEdit = async (editedEquipe: IEquipeRequest) => {
    if (!editedEquipe) {
      toast.error(GENERAL_ERROR)
      return
    }
    try {
      await updateEquipe({ id: editedEquipe.id!, equipe: editedEquipe }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.EDIT))
      handleCancelEditMode()
    } catch (error) {
      console.error('Error updating vehicule:', error)
      toast.error('Failed to update vehicule')
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    try {
      await deleteEquipe({ id }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.DELETE))
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete vehicule')
    }
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <EquipeView
                totalItems={totalItems}
                equipes={equipes}
                isLoading={isAnyLoading}
                toggleEditMode={toggleEditMode}
                handleDelete={handleDelete}
                toggleForm={toggleForm}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                searchValue={searchValue}
                handleSearchChange={handleSearchChange}
                clearSearch={clearSearch}
              />
            </Card>
          </CardContent>
        </Card>
      </Grid>
      {isOpen && (
        <EquipeForm
          isOpen={isOpen}
          toggleForm={toggleForm}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          equipeToEdit={equipeToEdit}
          isEditMode={isEditMode}
          cancleEditMode={cancleEditMode}
        />
      )}
    </Grid>
  )
}

export default EquipeContainer
