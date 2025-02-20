'use client'

import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, Grid } from '@mui/material'
import toast from 'react-hot-toast'

import { cardService } from '@core/services/card.service'
import {
  GENERAL_ERROR,
  CAR_CONSTRAINT_ERROR,
  TOAST_ACTIONS,
  TOAST_COMPONENTS,
  toastMessageSuccess
} from '@core/utils/toast-message'

import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@core/utils/constants'
import type { ICard, ICardRequest } from '@core/utils/types'

import CardForm from './CardForm'
import CardView from './Card.view'

export const CardCont = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [cards, setCards] = useState<ICard[]>([])
  const [totalItems, setTotalItems] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [cardToEdit, setCardToEdit] = useState<ICard | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })

  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    setIsLoading(true)
    cardService.getCard(paginationModel.page + 1, paginationModel.pageSize).then(data => {
      setCards(data.items)
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
    if (!newCard) return
  
    try {
      setIsLoading(true) 
      const card = await cardService.postCard(newCard)
  
      setCards(prevCards => [card, ...prevCards]) 
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.CARD, TOAST_ACTIONS.ADD))
      
      toggleForm()
    } catch (error) {
      console.error('Error adding card:', error)
      toast.error('Failed to add card')
    } finally {
      setIsLoading(false) 
    }
  }

  const handleEdit = (editedCard: ICardRequest) => {
    if (editedCard) {
      setIsLoading(true)
      cardService.patchCard(editedCard.id!, editedCard).then(result => {
        const newCard = cards.map(card => {
          if (result.id === card.id) return result

          return card
        })

        setCards(newCard)
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.CARD, TOAST_ACTIONS.EDIT))
        setIsLoading(false)
        handleCancelEditMode()
      })
    }
  }

  const handleDelete = (id: string) => {
    if (id) {
      setIsLoading(true)
      cardService
        .deleteCard(id)
        .then(result => {
          if (result === 1) {
            const newCards = cards.filter(card => card.id !== id)

            setCards(newCards)
            toast.success(toastMessageSuccess(TOAST_COMPONENTS.CARD, TOAST_ACTIONS.DELETE))
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
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Cartes`} />
          <CardContent sx={{ p: '1.5rem 0' }}>
            <Card sx={{ padding: 2 }}>
              <CardView
                totalItems={totalItems}
                cards={cards}
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
        <CardForm
          isOpen={isOpen}
          toggleForm={toggleForm}
          handleAdd={handleAdd}
          handleEdit={handleEdit}
          cardToEdit={cardToEdit}
          isEditMode={isEditMode}
          cancleEditMode={cancleEditMode}
        />
      )}
    </Grid>
  )
}
