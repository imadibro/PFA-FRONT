'use client'

import { useToastComponante } from '@/components/common/ToastComponante'
import {
  useCreateVehiculeMutation,
  useDeleteVehiculeMutation,
  useGetVehiculeQuery,
  useUpdateVehiculeMutation
} from '@/store/features/vehicule/vehiculeApi'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import { GENERAL_ERROR, TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@core/utils/toast-message'
import type { IVehicule, IVehiculeRequest } from '@core/utils/types'
import { Card, CardContent, Grid } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import VehiculeForm from './vehicule.Form'
import VehiculeView from './vehicule.view'

export const VehiculeContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [vehiculeToEdit, setVehiculeToEdit] = useState<IVehicule | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const { confirmUpdate, confirmAdd, showDeletToast } = useToastComponante()

  const [searchValue, setSearchValue] = useState<string>('')

  const { data, isLoading } = useGetVehiculeQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchValue
  })

  const [createVehicule, { isLoading: isCreating }] = useCreateVehiculeMutation()
  const [updateVehicule, { isLoading: isUpdating }] = useUpdateVehiculeMutation()
  const [deleteVehicule, { isLoading: isDeleting }] = useDeleteVehiculeMutation()
  const isAnyLoading = isLoading || isCreating || isDeleting || isUpdating

  const vehicules = data?.data || []
  const totalItems = data?.total || 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (vehiculeToEdit: IVehicule) => {
    setIsEditMode(!isEditMode)
    setVehiculeToEdit(vehiculeToEdit)
    toggleForm()
  }

  const handleCancelEditMode = () => {
    setIsEditMode(false)
    setVehiculeToEdit(null)
    toggleForm()
  }

  const cancleEditMode = () => {
    setIsEditMode(false)
    setVehiculeToEdit(null)
  }

  const handleAdd = async (newVehicule: IVehiculeRequest) => {
    if (!newVehicule) {
      toast.error(GENERAL_ERROR)
      return
    }

    try {
      await createVehicule(newVehicule).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.ADD))
      toggleForm()
      await confirmAdd('Véhicule')
    } catch (error) {
      console.error('Error adding vehicule:', error)
      toast.error('Failed to add vehicule')
    }
  }

  const handleEdit = async (editedVehicule: IVehiculeRequest) => {
    if (!editedVehicule) {
      toast.error(GENERAL_ERROR)
      return
    }
    try {
      await updateVehicule({ id: editedVehicule.id!, vehicule: editedVehicule }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.EDIT))
      handleCancelEditMode()
      await confirmUpdate('Véhicule')
    } catch (error) {
      console.error('Error updating vehicule:', error)
      toast.error('Failed to update vehicule')
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    try {
      await deleteVehicule({ id }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.DELETE))
      await showDeletToast('Véhicule')
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
              <VehiculeView
                totalItems={totalItems}
                vehicules={vehicules}
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
        <VehiculeForm
          isOpen={isOpen}
          toggleForm={toggleForm}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          vehiculeToEdit={vehiculeToEdit}
          isEditMode={isEditMode}
          cancleEditMode={cancleEditMode}
        />
      )}
    </Grid>
  )
}
