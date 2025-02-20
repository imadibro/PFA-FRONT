import dayjs from 'dayjs'

import { FR_DATE_TIME_FORMAT } from "./constants"

// Format Date FR
export const formatDateFR = (date: Date, isForExcel = false) => {
  const newDate = new Date(date)
  let month = '' + (newDate.getMonth() + 1)
  let day = '' + newDate.getDate()
  const year = newDate.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [day, month, year].join(isForExcel ? '-' : '/')
}

export const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export function formatDate(date: number | Date | string) {
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0') // getMonth() is 0-based
  const year = d.getFullYear()

  return `${day}/${month}/${year}`
}

export const formatToFrDate = (date: Date | string) => {
  return date ? dayjs(new Date(date)).format(FR_DATE_TIME_FORMAT) : ''
}
