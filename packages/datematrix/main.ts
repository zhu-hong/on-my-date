import { useDateMatrix, useLunar } from './src'

const date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
let use_monday_start = (document.getElementById('start_monday') as HTMLInputElement).checked

const container = document.querySelector('main')

const useCalendar = (year: number, month: number, use_monday_start: boolean) => {
  document.getElementById('year')!.textContent = year.toString() + '年'
  document.getElementById('month')!.textContent = month.toString() + '月'

  container!.innerHTML = ''

  useDateMatrix(year, month, use_monday_start).map((week) => {
    week = week.map((day) => {
      // @ts-ignore
      // day['day'] = '周' + ['日', '一', '二', '三', '四', '五', '六'][new Date(day.dateStr).getDay()]

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
  month--

  if(month === 0) {
    year--
    month = 12
  }

  useCalendar(year, month, use_monday_start)
})

document.getElementById('add')?.addEventListener('click', () => {
  month++

  if(month > 12) {
    year++
    month = 1
  }

  useCalendar(year, month, use_monday_start)
})

document.getElementById('start_monday')?.addEventListener('change', (e) => {
  use_monday_start = (e.currentTarget as HTMLInputElement).checked

  useCalendar(year, month, use_monday_start)
})
