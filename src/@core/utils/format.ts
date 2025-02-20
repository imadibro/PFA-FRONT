import dayjs from 'dayjs'

import { FR_DATE_TIME_FORMAT } from "./constants"


// Format to french date using Dayjs
export const formatToFrDate = (date: Date | string) => {
  return date ? dayjs(new Date(date)).format(FR_DATE_TIME_FORMAT) : ''
}