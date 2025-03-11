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
import type { IVehicule, IVehiculeRequest } from '@core/utils/types'
import { vehiculeService } from '@/@core/services/vehicule.service'
import VehiculeView from './vehicule.view'
import VehiculeForm from './vehicule.Form'

export const VehiculeContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [vehicules, setVehicules] = useState<IVehicule[]>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [vehiculeToEdit, setVehiculeToEdit] = useState<IVehicule | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    vehiculeService.getVehicule(paginationModel.page + 1, paginationModel.pageSize, searchValue).then(data => {
      setVehicules(data.items)
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
    if (!newVehicule) return

    try {
      setIsLoading(true)
      const vehicule = await vehiculeService.postVehicule(newVehicule)

      setVehicules(prevVehicule => [vehicule, ...prevVehicule])
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.ADD))

      toggleForm()
    } catch (error) {
      console.error('Error adding vehicule:', error)
      toast.error('Failed to add vehicule')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (editedVehicule: IVehiculeRequest) => {
    if (editedVehicule) {
      setIsLoading(true)
      vehiculeService.patchVehicule(editedVehicule.id!, editedVehicule).then(result => {
        const newVehicule = vehicules.map(vehicule => {
          if (result.id === vehicule.id) return result

          return vehicule
        })

        setVehicules(newVehicule)
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.EDIT))
        setIsLoading(false)
        handleCancelEditMode()
      })
    }
  }

  const handleDelete = (id: string) => {
    if (id) {
      setIsLoading(true)
      vehiculeService
        .deleteVehicule(id)
        .then(result => {
          if (result === 1) {
            const newOwners = vehicules.filter(owner => owner.id !== id)

            setVehicules(newOwners)
            toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL, TOAST_ACTIONS.DELETE))
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
          <CardHeader title={`Véhicules`} />
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <VehiculeView
                totalItems={totalItems}
                vehicules={vehicules}
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
