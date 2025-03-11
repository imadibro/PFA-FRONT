'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import toast from 'react-hot-toast'
import {
  GENERAL_ERROR,
  CAR_CONSTRAINT_ERROR,
  TOAST_ACTIONS,
  TOAST_COMPONENTS,
  toastMessageSuccess
} from '@core/utils/toast-message'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import type { IVehiculeOwner, IVehiculeOwnerRequest } from '@core/utils/types'
import VehiculeOwnerView from './VehiculeOwner.view'
import VehiculeOwnerForm from './VehiculeOwner.Form'
import { vehiculeOwnerService } from '@/@core/services'

export const VehiculeOwnerContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [vehiculeOwner, setVehiculeOwner] = useState<IVehiculeOwner[]>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [vehiculeOwnerToEdit, setVehiculeOwnerToEdit] = useState<IVehiculeOwner | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    vehiculeOwnerService
      .getVehiculeOwner(paginationModel.page + 1, paginationModel.pageSize, searchValue)
      .then(data => {
        setVehiculeOwner(data.items)
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
    if (!newOwner) return

    try {
      setIsLoading(true)
      const owner = await vehiculeOwnerService.postVehiculeOwner(newOwner)

      setVehiculeOwner(prevOwners => [owner, ...prevOwners])
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_OWNER, TOAST_ACTIONS.ADD))

      toggleForm()
    } catch (error) {
      console.error('Error adding owner:', error)
      toast.error('Failed to add owner')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (editedVehicule: IVehiculeOwnerRequest) => {
    if (editedVehicule) {
      setIsLoading(true)
      vehiculeOwnerService.patchVehiculeOwner(editedVehicule.id!, editedVehicule).then(result => {
        const newOwner = vehiculeOwner.map(owner => {
          if (result.id === owner.id) return result

          return owner
        })

        setVehiculeOwner(newOwner)
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_OWNER, TOAST_ACTIONS.EDIT))
        setIsLoading(false)
        handleCancelEditMode()
      })
    }
  }

  const handleDelete = (id: string) => {
    if (id) {
      setIsLoading(true)
      vehiculeOwnerService
        .deleteVehiculeOwner(id)
        .then(result => {
          if (result === 1) {
            const newOwners = vehiculeOwner.filter(owner => owner.id !== id)

            setVehiculeOwner(newOwners)
            toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_OWNER, TOAST_ACTIONS.DELETE))
          } else {
            toast.error(result === -1 ? CAR_CONSTRAINT_ERROR : GENERAL_ERROR)
          }

          setIsLoading(false)
        })
        .catch(err => {
          console.log(err)
          toast.error(CAR_CONSTRAINT_ERROR)
          setIsLoading(false)
        })
    }
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Propriétaire du véhicule`} />
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <VehiculeOwnerView
                totalItems={totalItems}
                vehiculeOwner={vehiculeOwner}
                isLoading={isLoading}
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
