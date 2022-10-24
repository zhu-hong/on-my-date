import { isLeapYear, month30day, month31day, verifyDate } from './util'
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
  let initialDay: number = new Date(`${year}-${month}-1`).getDay()

  for (let date = 1; date <= totalDay; date++) {
    let curDateDay = initialDay

    if(monday_first) {
      curDateDay = [6, 0, 1, 2, 3, 4, 5][initialDay]
    }

    const dateStr: string = `${year}-${month}-${date}`
    daysArr[curDayLevel][curDateDay] = {
      dateStr,
      year,
      month,
      date,
      day: initialDay,
      inOtherMonth: false,
      timestamp: new Date(dateStr).setHours(0,0,0,0),
    }

    if(curDateDay === 6) {
      curDayLevel++
    }

    if(initialDay + 1 > 6) {
      initialDay = 0
    } else {
      initialDay++
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
