import { useDateMatrix, useLunar } from './src'

const date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
let use_monday_start = (document.getElementById('start_monday') as HTMLInputElement).checked

const yearHost = document.getElementById('year') as HTMLInputElement

yearHost.value = year

yearHost.addEventListener('change', (e) => {
  const value = Number(e.target.value)
  if(isNaN(value) || value > 2100 || value < 1990) {
    e.target.value = year
    return
  }

  year = value

  useCalendar(year, month, use_monday_start)
})

const monthHost = document.getElementById('month') as HTMLInputElement

monthHost.value = month

monthHost.addEventListener('change', (e) => {
  const value = Number(e.target.value)
  if(isNaN(value) || value > 12 || value < 1) {
    e.target.value = month
    return
  }

  if(year === 1990 && value < 3) {
    e.target.value = month
    return
  }

  month = value

  useCalendar(year, month, use_monday_start)
})

const container = document.querySelector('main')

const useCalendar = (year: number, month: number, use_monday_start: boolean) => {
  document.getElementById('year')!.textContent = year.toString() + '年'
  document.getElementById('month')!.textContent = month.toString() + '月'

  container!.innerHTML = ''

  useDateMatrix(year, month, use_monday_start).map((week) => {
    week = week.map((day) => {
      day.lunar = useLunar(day.year, day.month, day.date)
  
      return day
    })
  
    return week
  }).forEach((week) => {
    const weekHost = document.createElement('div')
  
    weekHost.style.display = 'flex'
    weekHost.style.justifyContent = 'space-between'
  
    week.forEach((day) => {
      const dayHost = document.createElement('pre')
  
      dayHost.textContent = JSON.stringify(day, null, 2)
  
      weekHost.append(dayHost)
    })
  
    container!.append(weekHost)
  })
}

useCalendar(year, month, use_monday_start)

document.getElementById('minus')?.addEventListener('click', () => {
  if(year === 1990 && month === 3) return

  month--

  if(month === 0) {
    year--
    month = 12
  }

  yearHost.value = year
  monthHost.value = month

  useCalendar(year, month, use_monday_start)
})

document.getElementById('add')?.addEventListener('click', () => {
  if(year === 2100 && month === 11) return

  month++

  if(month > 12) {
    year++
    month = 1
  }

  yearHost.value = year
  monthHost.value = month

  useCalendar(year, month, use_monday_start)
})

document.getElementById('start_monday')?.addEventListener('change', (e) => {
  use_monday_start = (e.currentTarget as HTMLInputElement).checked

  useCalendar(year, month, use_monday_start)
})
