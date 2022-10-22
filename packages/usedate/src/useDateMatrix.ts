import { isLeapYear, month30day, month31day } from './util'
import type { IMatrixItem } from './types'

function getMonthTotalDay(year: number, month: number): number {
  if (month31day.includes(month)) {
    return 31
  } else if (month30day.includes(month)) {
    return 30
  } else {
    if (isLeapYear(year)) {
      return 29
    } else {
      return 28
    }
  }
}

function getMonthDaysArr(year: number, month: number, monday_first: boolean): IMatrixItem[][] {
  let totalDay = getMonthTotalDay(year, month)

  let daysArr: IMatrixItem[][] = [
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
    // @ts-ignore
    Array.from({ length: 7 }, () => null),
  ]

  let curDayLevel: number = 0

  for (let date = 1; date <= totalDay; date++) {
    const dateStr = `${year}-${month}-${date}`

    const curDate = new Date(dateStr)

    let curDateDay = curDate.getDay()

    if(monday_first) {
      curDateDay = [6, 0, 1, 2, 3, 4, 5][curDateDay]
    }


    daysArr[curDayLevel][curDateDay] = {
      dateStr,
      year,
      month,
      date,
      day: curDate.getDay(),
      inOtherMonth: false,
      timestamp: curDate.setHours(0,0,0,0),
    }

    if (curDateDay === 6) {
      curDayLevel++
    }
  }

  return daysArr
}

function getPrevMonthFillDays(year: number, month: number, length: number, monday_first: boolean): IMatrixItem[] {
  let prevMonth = month - 1
  if (prevMonth === 0) {
    prevMonth = 12
    year--
  }

  const prevMonthDaysArr = getMonthDaysArr(year, prevMonth, monday_first).flat().filter((d) => d !== null)
  return prevMonthDaysArr.map((date) => {
    date.inOtherMonth = true
    return date
  }).slice(prevMonthDaysArr.length - length)
}

function getNextMonthFillDays(year: number, month: number, length: number, monday_first: boolean): IMatrixItem[] {
  let nextMonth = month + 1
  if (nextMonth > 12) {
    nextMonth = 1
    year++
  }

  const nextMonthDaysArr = getMonthDaysArr(year, nextMonth, monday_first).flat().filter((d) => d !== null)
  return nextMonthDaysArr.map((date) => {
    date.inOtherMonth = true
    return date
  }).slice(0, length).reverse()
}

function verifyDate(year: number, month: number): boolean {
  if (year < 1990 || year > 2100) return false
  if (month < 1 || month > 12) return false

  return true
}

export function useDateMatrix(year: number = new Date().getFullYear(), month: number = new Date().getMonth() + 1, monday_first: boolean = false): IMatrixItem[][] {
  if(!verifyDate(year, month)) throw Error('this date is not validate')

  const daysArr = getMonthDaysArr(year, month, monday_first)

  let beforeEmptyLength = -1
  daysArr.flat().find((d) => {
    beforeEmptyLength++
    return d !== null
  })

  const prevMonthFillDays = getPrevMonthFillDays(year, month, beforeEmptyLength, monday_first)
  for (let index = 0; index < beforeEmptyLength; index++) {
    daysArr[0][index] = prevMonthFillDays[index]
  }

  let afterEmptyLength = 0
  daysArr.flat().forEach((d) => {
    if (d !== null) {
      afterEmptyLength = 0
    } else {
      afterEmptyLength++
    }
  })

  const nextMonthFillDays = getNextMonthFillDays(year, month, afterEmptyLength, monday_first)
  let fillNextMonthDaysLevel = daysArr.length - 1
  let fillNextMonthDaysIndex = 6
  for (let index = 0; index < afterEmptyLength; index++) {
    daysArr[fillNextMonthDaysLevel][fillNextMonthDaysIndex] = nextMonthFillDays[index]
    fillNextMonthDaysIndex--
    if (index === 6) {
      fillNextMonthDaysLevel--
      fillNextMonthDaysIndex = 6
    }
  }

  return daysArr
}
