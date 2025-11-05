'use client'

import { vehiculeTypeService } from '@/@core/services'
import { useToastComponante } from '@/components/common/ToastComponante'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import {
  CAR_CONSTRAINT_ERROR,
  GENERAL_ERROR,
  TOAST_ACTIONS,
  TOAST_COMPONENTS,
  toastMessageSuccess
} from '@core/utils/toast-message'
import type { IVehiculeType, IVehiculeTypeRequest } from '@core/utils/types'
import { Card, CardContent, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import VehiculeTypeForm from './VehiculeType.Form'
import VehiculeTypeView from './VehiculeType.view'

export const VehiculeTypeContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [vehiculeType, setVehiculeType] = useState<IVehiculeType[]>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [vehiculeTypeToEdit, setVehiculeTypeToEdit] = useState<IVehiculeType | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const { confirmUpdate, confirmAdd, showDeletToast } = useToastComponante()

  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    vehiculeTypeService.getVehiculeType(paginationModel.page + 1, paginationModel.pageSize, searchValue).then(data => {
      setVehiculeType(data.items)
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
    if (!newType) return

    try {
      setIsLoading(true)
      const type = await vehiculeTypeService.postVehiculeType(newType)

      setVehiculeType(prevType => [type, ...prevType])
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_TYPE, TOAST_ACTIONS.ADD))

      toggleForm()
      await confirmAdd('Type de vehicule')
    } catch (error) {
      console.error('Error adding type:', error)
      toast.error('Failed to add type')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (editedType: IVehiculeTypeRequest) => {
    if (editedType) {
      setIsLoading(true)
      vehiculeTypeService.patchVehiculeType(editedType.id!, editedType).then(async result => {
        const newType = vehiculeType.map(type => {
          if (result.id === type.id) return result

          return type
        })

        setVehiculeType(newType)
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_TYPE, TOAST_ACTIONS.EDIT))
        setIsLoading(false)
        handleCancelEditMode()
        await confirmUpdate('Type de vehicule')
      })
    }
  }

  const handleDelete = (id: string) => {
    if (id) {
      setIsLoading(true)
      vehiculeTypeService
        .deleteVehiculeType(id)
        .then(async result => {
          if (result === 1) {
            const newOwners = vehiculeType.filter(owner => owner.id !== id)

            setVehiculeType(newOwners)
            toast.success(toastMessageSuccess(TOAST_COMPONENTS.VEHICUL_TYPE, TOAST_ACTIONS.DELETE))
            await showDeletToast('Type de vehicule')
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
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <VehiculeTypeView
                totalItems={totalItems}
                vehiculeType={vehiculeType}
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
