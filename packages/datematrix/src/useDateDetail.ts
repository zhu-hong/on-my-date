import type { IDateDetail } from './types'

export function useDateDetail(time: number | string): IDateDetail {
  const d = new Date(time)

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = d.getDay()
  const hour = d.getHours()
  const minute = d.getMinutes()

  return {
    dateStr: `${year}-${month}-${date}`,
    year,
    month, 
    date,
    day,
    hour, 
    minute,
  }
}
