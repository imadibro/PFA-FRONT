import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { ITableItems, IVehicule, IVehiculeRequest } from '../utils/types'

class VehiculeService {
  getVehicule(page: number, limit: number, name: string) {
    return new Promise<ITableItems<IVehicule[]>>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/vehicule`, {
          params: {
            page,
            limit,
            name
          }
        })
        .then((response: AxiosResponse<{ data: IVehicule[]; total: number; page: number; pages: number }>) => {
          if (response.data) {
            const result: ITableItems<IVehicule[]> = {
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

  postVehicule(vehicule: IVehiculeRequest) {
    return new Promise<IVehicule>((resolve, reject) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/vehicule`, vehicule)
        .then(response => {
          console.log(response)

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

  patchVehicule(id: string, vehicule: IVehiculeRequest) {
    return new Promise<IVehicule>((resolve, reject) => {
      axios
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/vehicule/${id}`, vehicule)
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

  deleteVehicule(id: string) {
    return new Promise<number>((resolve, reject) => {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/vehicule/${id}`)
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

export const vehiculeService = new VehiculeService()
