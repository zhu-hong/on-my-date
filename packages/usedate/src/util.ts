export const month31day = [1, 3, 5, 7, 8, 10, 12]
export const month30day = [4, 6, 9, 11]

export function isLeapYear(year: number): boolean {
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return true
  return false
}

/**
 * 验证日期
 */
export function verifyDate(year: number, month: number, date?: number): boolean {
  if (year < 1990 || year > 2100) return false
  if (month < 1 || month > 12) return false

  if(date === undefined) return true

  if (date < 1 || date > 31) return false
  if (month30day.includes(month) && date > 30) return false
  if (month === 2) {
    if (isLeapYear(year) && date > 29) return false
    if (!isLeapYear(year) && date > 28) return false
  }
  if (year === 1990 && month === 1 && date < 31) return false

  return true
}