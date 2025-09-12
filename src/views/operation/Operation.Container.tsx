'use client'

import React, { useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import toast from 'react-hot-toast'
import { GENERAL_ERROR, TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@core/utils/toast-message'
import type { IOperation, IOperationRequest } from '@core/utils/types'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/@core/utils/constants'
import OperationForm from './Operation.form'
import OperationView from './Operation.view'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import {
  useCreateOperationMutation,
  useDeleteOperationMutation,
  useGetOperationsQuery,
  useUpdateOperationMutation
} from '@/store/features/operation/operationApi'
import { useToastComponante } from '@/components/common/DeletedComponante'

const OperationContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [operationToEdit, setoperationToEdit] = useState<IOperation | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const { confirmUpdate, confirmAdd, showDeletToast, showErrorToast } = useToastComponante()

  const [searchValue, setSearchValue] = useState<string>('')

  const { data, isLoading } = useGetOperationsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: searchValue
  })

  const [createOperation, { isLoading: isCreating }] = useCreateOperationMutation()
  const [updateOperation, { isLoading: isUpdating }] = useUpdateOperationMutation()
  const [deleteOperation, { isLoading: isDeleting }] = useDeleteOperationMutation()
  const isAnyLoading = isLoading || isCreating || isDeleting || isUpdating

  const operation = data?.data || []
  const totalItems = data?.total || 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (operationToEdit: IOperation) => {
    setIsEditMode(!isEditMode)
    setoperationToEdit(operationToEdit)
    toggleForm()
  }

  const handleCancelEditMode = () => {
    setIsEditMode(false)
    setoperationToEdit(null)
    toggleForm()
  }

  const cancleEditMode = () => {
    setIsEditMode(false)
    setoperationToEdit(null)
  }

  const handleAdd = async (newOperation: IOperationRequest) => {
    if (!newOperation) {
      toast.error(GENERAL_ERROR)
      return
    }

    try {
      await createOperation(newOperation).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.ADD))
      confirmAdd('Operation')
      toggleForm()
    } catch (error) {
      console.error('Error adding operation:', error)
      toast.error('Failed to add operation')
    }
  }

  const handleEdit = async (editedOperation: IOperationRequest) => {
    if (!editedOperation) {
      toast.error(GENERAL_ERROR)
      return
    }
    try {
      await updateOperation({ id: editedOperation.id!, operation: editedOperation }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.EDIT))
      handleCancelEditMode()
      confirmUpdate('Operation')
    } catch (error) {
      console.error('Error updating operation:', error)
      toast.error('Failed to update operation')
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    try {
      await deleteOperation({ id }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.DELETE))
      showDeletToast('Operation')
    } catch (error) {
      showErrorToast(error)
      // toast.error('Failed to delete operation')
    }
  }

  const toggle = () => {
    if (isEditMode) {
      cancleEditMode()
    }
    toggleForm()
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <OperationView
                totalItems={totalItems}
                operation={operation}
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
        <SidebarDrawerForm
          headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} operation`}
          open={isOpen}
          toggle={toggle}
          customWidth='50%'
        >
          <OperationForm
            isOpen={isOpen}
            // toggleForm={toggleForm}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            operationToEdit={operationToEdit}
            isEditMode={isEditMode}
            cancleEditMode={cancleEditMode}
            toggle={toggle}
          />
        </SidebarDrawerForm>
      )}
    </Grid>
  )
}

export default OperationContainer
