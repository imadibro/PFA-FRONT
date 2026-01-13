'use client'

import { useToastComponante } from '@/components/common/ToastComponante'
import {
  useCreateVehiculeOwnerMutation,
  useDeleteVehiculeOwnerMutation,
  useGetVehiculeOwnerQuery,
  useUpdateVehiculeOwnerMutation
} from '@/store/features/vehicule-owner/vehiculeOwnerApi'
import { isRTKQueryError } from '@/utils/functions'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import { GENERAL_ERROR, TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@core/utils/toast-message'
import type { IVehiculeOwner, IVehiculeOwnerRequest } from '@core/utils/types'
import { Card, CardContent, Grid } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import VehiculeOwnerForm from './VehiculeOwner.Form'
import VehiculeOwnerView from './VehiculeOwner.view'

export const VehiculeOwnerContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [vehiculeOwnerToEdit, setVehiculeOwnerToEdit] = useState<IVehiculeOwner | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const { confirmUpdate, confirmAdd, showDeletToast, showUnauthorizedToast } = useToastComponante()
  const [searchValue, setSearchValue] = useState<string>('')
  const { data, isLoading, refetch } = useGetVehiculeOwnerQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchValue
  })

  const [createVehiculeOwner, { isLoading: isCreating }] = useCreateVehiculeOwnerMutation()
  const [updateVehiculeOwner, { isLoading: isUpdating }] = useUpdateVehiculeOwnerMutation()
  const [deleteVehiculeOwner, { isLoading: isDeleting }] = useDeleteVehiculeOwnerMutation()
  const isAnyLoading = isLoading || isCreating || isDeleting || isUpdating

  const vehiculeOwner = data?.data || []
  const totalItems = data?.total || 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (cardToEdit: IVehiculeOwner) => {
    setIsEditMode(!isEditMode)
    setVehiculeOwnerToEdit(cardToEdit)
    toggleForm()
  }

  const handleCancelEditMode = () => {
    setIsEditMode(false)
    setVehiculeOwnerToEdit(null)
    toggleForm()
  }

  const cancleEditMode = () => {
    setIsEditMode(false)
    setVehiculeOwnerToEdit(null)
  }

  const handleAdd = async (newOwner: IVehiculeOwnerRequest) => {
    if (!newOwner) {
      toast.error(GENERAL_ERROR)
      return
    }

    try {
      await createVehiculeOwner(newOwner).unwrap()

      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_OWNER, TOAST_ACTIONS.ADD))

      toggleForm()
      await confirmAdd('Propriétaire')
      refetch()
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error('Failed to add owner')
      }
    }
  }

  const handleEdit = async (editedVehicule: IVehiculeOwnerRequest) => {
    try {
      if (editedVehicule) {
        await updateVehiculeOwner({ id: editedVehicule.id!, vehicule: editedVehicule }).unwrap()
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_OWNER, TOAST_ACTIONS.EDIT))
        refetch()
        handleCancelEditMode()
        await confirmUpdate('Proprietaire')
      }
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error('Failed to update ')
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (id) {
        await deleteVehiculeOwner({ id }).unwrap()
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_OWNER, TOAST_ACTIONS.DELETE))
        refetch()
        showDeletToast('propriétaire')
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
              <VehiculeOwnerView
                totalItems={totalItems}
                vehiculeOwner={vehiculeOwner}
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
        <VehiculeOwnerForm
          isOpen={isOpen}
          toggleForm={toggleForm}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          vehiculeOwnerToEdit={vehiculeOwnerToEdit}
          isEditMode={isEditMode}
          cancleEditMode={cancleEditMode}
        />
      )}
    </Grid>
  )
}
