import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { ITableItems, IVehiculeType, IVehiculeTypeRequest } from '../utils/types'

class VehiculeTypeService {
  getVehiculeType(page: number, limit: number, filterByName: string) {
    return new Promise<ITableItems<IVehiculeType[]>>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeType`, {
          params: {
            page,
            itemsPerPage: limit,
            filterByName
          }
        })
        .then((response: AxiosResponse<{ data: IVehiculeType[]; total: number; page: number; pages: number }>) => {
          if (response.data) {
            const result: ITableItems<IVehiculeType[]> = {
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

  getAllType() {
    return new Promise<IVehiculeType[]>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeType/All`)
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

  postVehiculeType(vehiculeType: IVehiculeTypeRequest) {
    return new Promise<IVehiculeType>((resolve, reject) => {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeType`, vehiculeType)
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

  patchVehiculeType(id: string, vehiculeType: IVehiculeTypeRequest) {
    return new Promise<IVehiculeType>((resolve, reject) => {
      axios
        .patch(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeType/${id}`, vehiculeType)
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

  deleteVehiculeType(id: string) {
    return new Promise<number>((resolve, reject) => {
      axios
        .delete(`${process.env.NEXT_PUBLIC_API_URL}/vehiculeType/${id}`)
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

export const vehiculeTypeService = new VehiculeTypeService()
