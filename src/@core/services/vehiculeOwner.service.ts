import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { ITableItems, IVehiculeOwner, IVehiculeOwnerRequest } from '../utils/types'

class VehiculeOwnerService {
  getVehiculeOwner(page: number, limit: number, filterByName: string) {
    return new Promise<ITableItems<IVehiculeOwner[]>>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeOwner`, {
          params: {
            page,
            limit,
            filterByName
          }
        })
        .then((response: AxiosResponse<{ data: IVehiculeOwner[]; total: number; page: number; pages: number }>) => {
          if (response.data) {
            const result: ITableItems<IVehiculeOwner[]> = {
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

  getAllOwners() {
    return new Promise<IVehiculeOwner[]>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeOwner/All`)
        .then(response => {
          if (response?.data?.data) {
            resolve(response.data.data)
          } else {
            reject('Something went wrong.')
          }
        })
        .catch(error => console.log(error))
    })
  }

  postVehiculeOwner(vehiculeOwner: IVehiculeOwnerRequest) {
    return new Promise<IVehiculeOwner>((resolve, reject) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeOwner`, vehiculeOwner)
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

  patchVehiculeOwner(id: string, vehiculeOwner: IVehiculeOwnerRequest) {
    return new Promise<IVehiculeOwner>((resolve, reject) => {
      axios
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeOwner/${id}`, vehiculeOwner)
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

  deleteVehiculeOwner(id: string) {
    return new Promise<number>((resolve, reject) => {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeOwner/${id}`)
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

export const vehiculeOwnerService = new VehiculeOwnerService()
