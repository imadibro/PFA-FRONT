import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { ICard, ICardRequest, ITableItems } from '../utils/types'

class CardService {
  getCard(page: number, limit: number, filterByMatricule: string, filterByType: string) {
    return new Promise<ITableItems<ICard[]>>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/carte`, {
          params: {
            page,
            limit,
            filterByMatricule,
            filterByType
          }
        })
        .then((response: AxiosResponse<{ data: ICard[]; total: number; page: number; pages: number }>) => {
          if (response.data) {
            const result: ITableItems<ICard[]> = {
              items: response.data.data,
              totalItems: response.data.total
            }

            resolve(result)
          } else {
            reject('Something went wrong.')
          }
        })
        .catch(error => {
          if (error?.response?.data?.message) {
            reject(error.response.data.message)
          } else {
            reject('Something went wrong.')
          }
        })
    })
  }

  postCard(card: ICardRequest) {
    return new Promise<ICard>((resolve, reject) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/carte`, card)
        .then(response => {
          if (response?.data) {
            resolve(response.data)
          } else {
            reject('Something went wrong.')
          }
        })
        .catch(error => {
          if (error?.response?.data?.message) {
            reject(error.response.data.message)
          } else {
            reject('Something went wrong.')
          }
        })
    })
  }

  patchCard(id: string, card: ICardRequest) {
    return new Promise<ICard>((resolve, reject) => {
      axios
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/carte/${id}`, card)
        .then(response => {
          if (response?.data) {
            resolve(response.data)
          } else {
            reject('Something went wrong.')
          }
        })
        .catch(error => {
          if (error?.response?.data?.message) {
            reject(error.response.data.message)
          } else {
            reject('Something went wrong.')
          }
        })
    })
  }

  deleteCard(id: string) {
    return new Promise<number>((resolve, reject) => {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/carte/${id}`)
        .then(response => {
          if (response?.data === 1) {
            resolve(1)
          } else {
            reject('Something went wrong.')
          }
        })
        .catch(error => {
          if (error?.response?.data?.message) {
            reject(error.response.data.message)
          } else {
            reject('Something went wrong.')
          }
        })
    })
  }
}

export const cardService = new CardService()
