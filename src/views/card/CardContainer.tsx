'use client'

import { useToastComponante } from '@/components/common/ToastComponante'
import {
  useCreateCardMutation,
  useDeletCardMutation,
  useGetCardQuery,
  useUpdateCardMutation
} from '@/store/features/card/cardApi'
import { isRTKQueryError } from '@/utils/functions'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import {
  // eslint-disable-next-line import/named
  CARD_CONSTRAINT_ERROR,
  GENERAL_ERROR,
  TOAST_ACTIONS,
  TOAST_COMPONENTS,
  toastMessageSuccess
} from '@core/utils/toast-message'
import type { ICard, ICardRequest } from '@core/utils/types'
import { Card, CardContent, Grid } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import CardView from './Card.view'
import CardForm from './CardForm'

export const CardCont = ({ type }: { type: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [cardToEdit, setCardToEdit] = useState<ICard | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [activeTab] = useState(type)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const { confirmUpdate, confirmAdd, showDeletToast, showUnauthorizedToast } = useToastComponante()

  const [searchValue, setSearchValue] = useState<string>('')

  const { data, isLoading, refetch } = useGetCardQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    filterByMatricule: searchValue,
    filterByType: type
  })

  const [createCard, { isLoading: isCreating }] = useCreateCardMutation()
  const [updateCard, { isLoading: isUpdating }] = useUpdateCardMutation()
  const [deleteCard, { isLoading: isDeleting }] = useDeletCardMutation()
  const isAnyLoading = isLoading || isCreating || isDeleting || isUpdating

  const cards = data?.data || []
  const totalItems = data?.total || 0

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const clearSearch = () => {
    setSearchValue('')
  }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (cardToEdit: ICard) => {
    setIsEditMode(!isEditMode)
    setCardToEdit(cardToEdit)
    toggleForm()
  }

  const handleCancelEditMode = () => {
    setIsEditMode(false)
    setCardToEdit(null)
    toggleForm()
  }

  const cancleEditMode = () => {
    setIsEditMode(false)
    setCardToEdit(null)
  }

  const handleAdd = async (newCard: ICardRequest) => {
    try {
      await createCard(newCard).unwrap()
      if (!newCard) {
        toast.error(GENERAL_ERROR)
        return
      }
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.CARD, TOAST_ACTIONS.ADD))

      toggleForm()
      await confirmAdd('Carte')
      refetch()
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error('Failed to create card')
      }
    }
  }

  const handleEdit = async (editedCard: ICardRequest) => {
    try {
      await updateCard({ id: editedCard.id!, card: editedCard }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.CARD, TOAST_ACTIONS.EDIT))
      refetch()
      handleCancelEditMode()
      await confirmUpdate('Carte')
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error('Failed to update card')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!id) return

    try {
      await deleteCard({ id }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.CARD, TOAST_ACTIONS.DELETE))
      showDeletToast('Carte')
      refetch() // Recharge seulement la page courante
    } catch (err) {
      if (isRTKQueryError(err) && err.status === 403) {
        await showUnauthorizedToast()
      } else {
        toast.error(CARD_CONSTRAINT_ERROR)
      }
    }
  }

  return (
    <Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: '0' }}>
            <Card sx={{ boxShadow: 'none', padding: 2 }}>
              <CardView
                totalItems={totalItems}
                cards={cards}
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
        <CardForm
          isOpen={isOpen}
          toggleForm={toggleForm}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          cardToEdit={cardToEdit}
          isEditMode={isEditMode}
          cancleEditMode={cancleEditMode}
          activeTab={activeTab}
        />
      )}
    </Grid>
  )
}
