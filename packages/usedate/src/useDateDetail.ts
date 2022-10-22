import type { IDateDetail } from './types'

export function useDateDetail(time?: number): IDateDetail {
  const d = time === undefined ? new Date() : new Date(time)

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()
  const day = d.getDay()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()

  return {
    dateStr: `${year}-${month}-${date}`,
    year,
    month, 
    date,
    day,
    hour, 
    minute,
    second,
    timestamp: d.getTime(),
  }
}
