'use client'

import { useToastComponante } from '@/components/common/ToastComponante'
import {
  useCreateVehiculeTypeMutation,
  useDeleteVehiculeTypeMutation,
  useGetVehiculeTypeQuery,
  useUpdateVehiculeTypeMutation
} from '@/store/features/vehicule-type/vehiculeTypeApi'
import { isRTKQueryError } from '@/utils/functions'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import { GENERAL_ERROR, TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@core/utils/toast-message'
import type { IVehiculeType, IVehiculeTypeRequest } from '@core/utils/types'
import { Card, CardContent, Grid } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import VehiculeTypeForm from './VehiculeType.Form'
import VehiculeTypeView from './VehiculeType.view'

export const VehiculeTypeContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [vehiculeTypeToEdit, setVehiculeTypeToEdit] = useState<IVehiculeType | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })
  const { confirmUpdate, confirmAdd, showDeletToast, showUnauthorizedToast } = useToastComponante()

  const [searchValue, setSearchValue] = useState<string>('')

  const { data, isLoading, refetch } = useGetVehiculeTypeQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchValue
  })
  const [createVehiculeType, { isLoading: isCreateLoading }] = useCreateVehiculeTypeMutation()
  const [updateVehiculeType, { isLoading: isUpdateLoading }] = useUpdateVehiculeTypeMutation()
  const [deleteVehiculeType, { isLoading: isDeleteLoading }] = useDeleteVehiculeTypeMutation()
  const isAnyLoading = isLoading || isCreateLoading || isDeleteLoading || isUpdateLoading

  const vehiculeType = data?.data || []
  const totalItems = data?.total || 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (vehiculeTypeToEdit: IVehiculeType) => {
    setIsEditMode(!isEditMode)
    setVehiculeTypeToEdit(vehiculeTypeToEdit)
    toggleForm()
  }

  const handleCancelEditMode = () => {
    setIsEditMode(false)
    setVehiculeTypeToEdit(null)
    toggleForm()
  }

  const cancleEditMode = () => {
    setIsEditMode(false)
    setVehiculeTypeToEdit(null)
  }

  const handleAdd = async (newType: IVehiculeTypeRequest) => {
    if (!newType) {
      toast.error(GENERAL_ERROR)
      return
    }
    try {
      await createVehiculeType(newType).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_TYPE, TOAST_ACTIONS.ADD))

      toggleForm()
      await confirmAdd('Type de vehicule')
      refetch()
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error('Failed to add vehicule type')
      }
    }
  }

  const handleEdit = async (editedType: IVehiculeTypeRequest) => {
    try {
      if (editedType) {
        await updateVehiculeType({ id: editedType.id!, vehicule: editedType }).unwrap()
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_TYPE, TOAST_ACTIONS.EDIT))
        refetch()
        handleCancelEditMode()
        await confirmUpdate('Type de vehicule')
      }
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error('Failed to update vehicule type')
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (id) {
        await deleteVehiculeType({ id }).unwrap()
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_TYPE, TOAST_ACTIONS.DELETE))
        refetch()
        await showDeletToast('Type de vehicule')
      }
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error('Failed to delete propriétaire')
      }
    }
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <VehiculeTypeView
                totalItems={totalItems}
                vehiculeType={vehiculeType}
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
        <VehiculeTypeForm
          isOpen={isOpen}
          toggleForm={toggleForm}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          vehiculeTypeToEdit={vehiculeTypeToEdit}
          isEditMode={isEditMode}
          cancleEditMode={cancleEditMode}
        />
      )}
    </Grid>
  )
}
