import type { IClients, ITableItems } from '../utils/types'
// import type { AxiosResponse } from 'axios';
import axios from 'axios'

class ClientService {
  getClient(page: number, limit: number, search: string) {
    return new Promise<ITableItems<IClients[]>>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/project/clients/projects`, {
          params: {
            page,
            limit,
            search
          }
        })
        .then(response => {
          console.log(response.data)
          if (response.data) {
            const result: ITableItems<IClients[]> = {
              items: response.data.projects,
              totalItems: response.data.totalItems
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
}

export const clientService = new ClientService()
