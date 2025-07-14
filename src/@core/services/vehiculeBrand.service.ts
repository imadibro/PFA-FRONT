//import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { IVehiculeBrand } from '../utils/types'

class VehiculeBrandService {
  getAllBrands() {
    return new Promise<IVehiculeBrand[]>((resolve, reject) => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/brand`)
        .then(response => {
          if (response?.data) {
            resolve(response.data)
          } else {
            reject('Something went wrong.')
          }
        })
        .catch(error => console.log(error))
    })
  }
}

export const vehiculeBrandService = new VehiculeBrandService()
