import type { AxiosResponse } from 'axios';
import axios from 'axios'

import type { ITableItems, ICard, ICardRequest } from '../utils/types'

class CardService {
  getCard(page: number, limit: number) {
    return new Promise<ITableItems<ICard[]>>((resolve, reject) => {
      axios
        .get('http://localhost:5000/api/carte', {
          params: {
            page,
            itemsPerPage: limit
          }
        })
        .then( (response: AxiosResponse<{data:ICard[], total:number, page : number,pages : number}>) => {
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
        .post('http://localhost:5000/api/carte', card)
        .then(response => {
          console.log(response)

          if (response?.data?.data) {
            resolve(response.data.data)
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
        .patch(`http://localhost:5000/api/carte/${id}`, card)
        .then(response => {
          if (response?.data.data) {
            resolve(response.data.data)
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
        .delete(`http://localhost:5000/api/carte/${id}`)
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
