'use client'

import React, { useState } from 'react'
import { Card, CardContent, Grid } from '@mui/material'
import toast from 'react-hot-toast'
import { GENERAL_ERROR, TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@core/utils/toast-message'
import type { IOperationTaskRequest, IOperationTask } from '@core/utils/types'
import {
  useCreateOperationTasksMutation,
  useDeleteOperationTasksMutation,
  useGetOperationsTasksQuery,
  useUpdateOperationTasksMutation
} from '@/store/features/operation/operationTasksApi'

const OperationTasksContainer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [operationTaskToEdit, setOperationTaskToEdit] = useState<IOperationTask | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { data, isLoading } = useGetOperationsTasksQuery()

  const [createOperationTask, { isLoading: isCreating }] = useCreateOperationTasksMutation()
  const [updateOperationTask, { isLoading: isUpdating }] = useUpdateOperationTasksMutation()
  const [deleteOperationTask, { isLoading: isDeleting }] = useDeleteOperationTasksMutation()
  const isAnyLoading = isLoading || isCreating || isDeleting || isUpdating

  const operation = data?.data || []
  const totalItems = data?.total || 0

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchValue(e.target.value)
  // }

  // const clearSearch = () => {
  //   setSearchValue('')
  // }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (operationTaskToEdit: IOperationTask) => {
    setIsEditMode(!isEditMode)
    setOperationTaskToEdit(operationTaskToEdit)
    toggleForm()
  }

  const handleCancelEditMode = () => {
    setIsEditMode(false)
    setOperationTaskToEdit(null)
    toggleForm()
  }

  const cancleEditMode = () => {
    setIsEditMode(false)
    setOperationTaskToEdit(null)
  }

  const handleAdd = async (newOperation: IOperationTaskRequest) => {
    if (!newOperation) {
      toast.error(GENERAL_ERROR)
      return
    }

    try {
      await createOperationTask(newOperation).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.ADD))
      toggleForm()
    } catch (error) {
      console.error('Error adding operation:', error)
      toast.error('Failed to add operation')
    }
  }

  const handleEdit = async (editedOperation: IOperationTaskRequest) => {
    if (!editedOperation) {
      toast.error(GENERAL_ERROR)
      return
    }
    try {
      await updateOperationTask({ id: editedOperation.id!, operation: editedOperation }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.EDIT))
      handleCancelEditMode()
    } catch (error) {
      console.error('Error updating operation:', error)
      toast.error('Failed to update operation')
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return
    try {
      await deleteOperationTask({ id }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.DELETE))
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete operation')
    }
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <operationTasksView
                totalItems={totalItems}
                operation={operation}
                isLoading={isAnyLoading}
                toggleEditMode={toggleEditMode}
                handleDelete={handleDelete}
                toggleForm={toggleForm}
              />
            </Card>
          </CardContent>
        </Card>
      </Grid>
      {isOpen && (
        <operationTasksForm
          isOpen={isOpen}
          toggleForm={toggleForm}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          operationTaskToEdit={operationTaskToEdit}
          isEditMode={isEditMode}
          cancleEditMode={cancleEditMode}
        />
      )}
    </Grid>
  )
}

export default OperationTasksContainer
