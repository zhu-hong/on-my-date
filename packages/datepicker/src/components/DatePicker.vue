<script setup>
import { computed, ref, watch } from 'vue'
import { useDateMatrix, useDateDetail } from '@zhu-hong/usedate'
import { Popover } from 'element-ui'

const todayDate = new Date()

const todayDateStr = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`

const props = defineProps({
  time: {
    type: Number,
    default: () => new Date().getTime(),
  },
  minTime: {
    default: () => new Date('1990-1-31').getTime()
  },
  maxTime: {
    default: () => new Date('2100-12-31').getTime()
  },
  withTime: {
    type: Boolean,
    default: false,
  },
  shortcut: {
    type: Array,
    default: () => [],
  },
})

const curDateInfo = computed(() => {
  return useDateDetail(curDate.value)
})

/**
 * @type {{
    time: number
    desc: string
    disable: boolean
  }[]}
 */
const shortcutOptions = computed(() => {
  return props.shortcut.map((s) => {
    let disable = false

    if(s.time > maxTimeInfo.value.timestamp || s.time < minTimeInfo.value.timestamp) {
      disable = true
    }

    if(s.time === null) {
      disable = false
    }

    return {
      ...s,
      disable,
    }
  })
})

const emits = defineEmits(['select', 'update:time'])

const minTimeInfo = computed(() => {
  return useDateDetail(props.minTime)
})
const maxTimeInfo = computed(() => {
  return useDateDetail(props.maxTime)
})

let curDate = ref(props.time === null ? null : new Date(props.time))
let viewYear = ref(curDateInfo.value === null ? todayDate.getFullYear() : curDateInfo.value.year)
let viewMonth = ref(curDateInfo.value === null ? todayDate.getMonth() + 1 : curDateInfo.value.month)
let visible = ref(false)

let mode = ref('date')
let viewYearInc = ref(0)

/**
 * @type {{
    month: number
    disable: boolean
    isSelectMonth: boolean
  }[]}
 */
const viewYearMonth = computed(() => {
  return Array.from({ length: 12 }, (_, num) => {
    let disable = false
    const month = num + 1

    if(viewYear.value === maxTimeInfo.value.year && month > maxTimeInfo.value.month) {
      disable = true
    }

    if(viewYear.value === minTimeInfo.value.year && month < minTimeInfo.value.month) {
      disable = true
    }

    return {
      disable,
      month,
      isSelectMonth: viewMonth.value === month
    }
  })
})

/**
 * @type {{
    year: number
    disable: boolean
    isSelectYear: boolean
  }[]}
 */
const viewYears = computed(() => {
  return Array.from({ length: 12 }, (_, num) => {
    const year = viewYear.value + num + viewYearInc.value * 12

    return {
      year,
      disable: year > maxTimeInfo.value.year || year < minTimeInfo.value.year,
      isSelectYear: year === viewYear.value
    }
  })
})

/**
 * @type {{
    hour: number
    disable: boolean
  }[]}
 */
const hourSet = computed(() => {
  return Array.from({ length: 24 }, (_, hour) => {
    let disable = false

    if(curDateInfo.value !== null) {
      const curDate = new Date(curDateInfo.value.dateStr)
      const { timestamp: minTime } = minTimeInfo.value
      const { timestamp: maxTime } = maxTimeInfo.value
  
      const incedMinHourTime = curDate.setHours(hour, 59)
      const incedMaxHourTime = curDate.setHours(hour, 0)
  
      if(incedMinHourTime < minTime) {
        disable = true
      }
  
      if(incedMaxHourTime > maxTime) {
        disable = true
      }
    }

    return {
      hour,
      disable,
    }
  })
})

/**
 * @type {{
    minute: number
    disable: boolean
  }[]}
 */
const minuteSet = computed(() => {
  return Array.from({ length: 60 }, (_, minute) => {
    let disable = false

    if(curDateInfo.value !== null) {
      const { dateStr, hour } = curDateInfo.value
      const { timestamp: minTime } = minTimeInfo.value
      const { timestamp: maxTime } = maxTimeInfo.value
  
      const incedMinute = new Date(`${dateStr} ${hour}:${minute}`)
  
      if(incedMinute < minTime || incedMinute > maxTime) {
        disable = true
      }
    }

    return {
      minute,
      disable,
    }
  })
})

/**
 * @type {{
    year: number
    month: number
    date: number
    day: number
    inOtherMonth: boolean
    dateStr: string
    timestamp: number
    disable: boolean
  }[][]}
 */
const dateMartix = computed(() => {
  return useDateMatrix(viewYear.value, viewMonth.value).map((week) => {
    week = week.map((day) => {
      if(new Date(day.timestamp).setHours(23,59,59) < minTimeInfo.value.timestamp || day.timestamp > maxTimeInfo.value.timestamp) {
        day.disable = true
      } else {
        day.disable = false
      }

      return day
    })

    return week
  })
})

/**
 * @param {{
    year: number
    month: number
    date: number
    day: number
    inOtherMonth: boolean
    dateStr: string
    timestamp: number
    disable: boolean
  }} day 
 */
const useSelectDate = (day) => {
  if(day.disable) return

  const { year, month } = day

  if(viewYear.value !== year || viewMonth.value !== month) {
    viewYear.value = year
    viewMonth.value = month
  }

  if(!props.withTime) {
    curDate.value = new Date(day.dateStr)
  } else {
    if(curDateInfo.value !== null) {
      const { hour: curtHour, minute: curtMinute } = curDateInfo.value
      const { year: minYear, month: minMonth, date: minDate, hour: minHour, minute: minMinute } = minTimeInfo.value
      const { year: maxYear, month: maxMonth, date: maxDate, hour: maxHour, minute: maxMinute } = maxTimeInfo.value
  
      const newDate = new Date(`${day.dateStr} ${curtHour}:${curtMinute}`)
      const { year: curtYear, month: curtMonth, date: curtDate } = useDateDetail(newDate.getTime())
  
      let incedHour = curtHour
      let incedMinute = curtMinute
  
      if(curtYear === minYear && curtMonth === minMonth && curtDate === minDate && curtHour < minHour) {
        incedHour = minHour
  
        if(incedMinute < minMinute) {
          incedMinute === minMinute
        }
      }
  
      if(curtYear === minYear && curtMonth === minMonth && curtDate === minDate && incedHour === minHour && curtMinute < minMinute) {
        incedMinute = minMinute
      }
  
      if(curtYear === maxYear && curtMonth === maxMonth && curtDate === maxDate && curtHour > maxHour) {
        incedHour = maxHour
  
        if(incedMinute > maxMinute) {
          incedMinute === maxMinute
        }
      }
  
      if(curtYear === maxYear && curtMonth === maxMonth && curtDate === maxDate && incedHour === maxHour && curtMinute > maxMinute) {
        incedMinute = maxMinute
      }

      curDate.value = new Date(`${day.dateStr} ${incedHour}:${incedMinute}`)
    } else {
      curDate.value = new Date(day.dateStr)
    }

  }

  if(props.withTime) return

  useEimtUpdate()
}

/**
 * 
 * @param { number } count
 */
const incrementMonth = (count) => {
  const forward = count < 0 ? -1 : 1

  count = Math.abs(count)

  const incYear = Math.floor(count / 12)

  const incMonth = count % 12

  let incedYear = viewYear.value + forward * incYear

  let incedMonth = viewMonth.value + forward * incMonth

  if(incedMonth > 12) {
    incedYear++
    incedMonth = 1
  } else if(incedMonth < 1) {
    incedYear--
    incedMonth = 12
  }

  const { year: minYear } = minTimeInfo.value
  const { year: maxYear } = maxTimeInfo.value

  if(forward < 0 && incedYear < minYear) return
  if(forward > 0 && incedYear > maxYear) return

  if(forward > 0 && incedYear < minYear) {
    incedYear = minYear
  }

  if(forward < 0 && incedYear > maxYear) {
    incedYear = maxYear
  }

  viewYear.value = incedYear

  if(viewYear.value === minYear && viewMonth.value < minTimeInfo.value.month) {
    viewMonth.value = minTimeInfo.value.month
  }
  if(viewYear.value === maxYear && viewMonth.value > maxTimeInfo.value.month) {
    viewMonth.value = maxTimeInfo.value.month
  }

  if(viewYear.value === minYear && incedMonth < minTimeInfo.value.month) return
  if(viewYear.value === maxYear && incedMonth > maxTimeInfo.value.month) return

  viewMonth.value = incedMonth
}

/**
 * @param { 'date' | 'month' | 'year'} nowMode 
 */
const selectMode = (nowMode) => {
  mode.value = nowMode
}

/**
 * @param {{
    month: number
    disable: boolean
    isSelectMonth: boolean
  }} month 
 */
const selectViewMonth = (month) => {
  if(month.disable) return

  viewMonth.value = month.month
  selectMode('date')
}

const incrementViewYearInc = (count) => {

  if(count < 0 && viewYears.value.map(({ year }) => year).includes(minTimeInfo.value.year)) return
  if(count > 0 && viewYears.value.map(({ year }) => year).includes(maxTimeInfo.value.year)) return

  viewYearInc.value += count
}

/**
 * @param {{
    year: number
    disable: boolean
    isSelectYear: boolean
  }} year 
 */
const selectViewYear = (year) => {
  if(year.disable) return

  viewYear.value = year.year
  viewYearInc.value = 0

  selectMode('month')
}

/**
 * @param {{
    time: number
    desc: string
    disable: boolean
  }} shortcut
 */
const useSelectShortcut = (shortcut) => {
  if(shortcut.disable) return

  if(shortcut.time === null) {
    curDate.value = null
  } else {
    const { year, month, timestamp } = useDateDetail(shortcut.time)
    viewYear.value = year
    viewMonth.value = month
    curDate.value = new Date(timestamp)
  }

  useEimtUpdate()
}

const useEimtUpdate = () => {
  visible.value = false

  if(curDate.value !== null) {
    const time = curDate.value.getTime()
    emits('update:time', time)
    emits('select', time)
  } else {
    emits('update:time', null)
    emits('select', null)

    viewYear.value = todayDate.getFullYear()
    viewMonth.value = todayDate.getMonth() + 1
  }

}

/**
 * 
 * @param { WheelEvent } e 
 */
const handleHourWhell = (e) => {
  if(e.ctrlKey || e.metaKey) return

  if(curDateInfo.value !== null) {
    const inc = e.deltaY > 0 ? 1 : -1

    const { year: curtYear, month: curtMonth, date: curtDate, dateStr, hour, minute: curtMinute } = curDateInfo.value
  
    const incedHour = hour + inc
    let incedMinute = curtMinute
  
    if(incedHour > 23 || incedHour < 0) return
  
    const { disable } = hourSet.value.find((h) => h.hour === incedHour)
  
    if(disable) return
  
    const { year: minYear, month: minMonth, date: minDate, hour: minHour, minute: minMinute } = minTimeInfo.value
    const { year: maxYear, month: maxMonth, date: maxDate, hour: maxHour, minute: maxMinute } = maxTimeInfo.value
  
    if(curtYear === minYear && curtMonth === minMonth && curtDate === minDate && incedHour === minHour && curtMinute < minMinute) {
      incedMinute = minMinute
    }
  
    if(curtYear === maxYear && curtMonth === maxMonth && curtDate === maxDate && incedHour === maxHour && curtMinute > maxMinute) {
      incedMinute = maxMinute
    }

    curDate.value = new Date(`${dateStr} ${incedHour}:${incedMinute}`)
  }
}

/**
 * 
 * @param { WheelEvent } e 
 */
const handleMinuteWhell = (e) => {
  if(curDateInfo.value !== null) {
    if(e.ctrlKey || e.metaKey) return
    const inc = e.deltaY > 0 ? 1 : -1
  
    const { dateStr, hour: curtHour,  minute } = curDateInfo.value
  
    const incedMinute = minute + inc
  
    if(incedMinute > 59 || incedMinute < 0) return
    
    const { disable } = minuteSet.value.find((m) => m.minute === incedMinute)
  
    if(disable) return
  
    curDate.value = new Date(`${dateStr} ${curtHour}:${incedMinute}`)
  }
}

watch(
  () => props.time,
  (time) => {
    if(time !== null) {
      const { year, month } = useDateDetail(time)
      curDate.value = new Date(time)
  
      mode.value = 'date'
      viewYear.value = year
      viewMonth.value = month
    } else {
      mode.value = 'date'
      viewYear.value = todayDate.getFullYear()
      viewMonth.value = todayDate.getMonth() + 1
    }
  }
)
</script>

<template>
  <popover :visible-arrow="false" :popper-class="$style['datepicker-popover']" v-model="visible">
    <template slot="reference">
      <slot v-bind:about="useDateDetail(time)"></slot>
    </template>
    <div :class="[$style.container,'flex flex-col justify-between items-center rounded bg-white box-border', withTime ? 'h-320px' : 'h-280px']">
      <div class="flex justify-between items-center">
        <div v-show="shortcutOptions.length > 0" class="w-100px h-full border-r flex flex-col gap-14px overflow-auto items-center p-14px">
          <span
            v-for="o of shortcutOptions"
            :class="[
              'w-full truncate flex-none text-[#0c58d2] text-center cursor-pointer',
              o.disable && $style.disable,
            ]"
            @click="useSelectShortcut(o)"
          >
            {{ o.desc }}
          </span>
        </div>
        <div class="w-280px flex flex-col">
          <div :class="[$style.header, 'h-40px border-b border-[#DFE3E9] flex justify-between items-center gap-12px px-18px']">
            <template v-if="mode === 'date'">
              <svg :class="['cursor-pointer', viewYear <= minTimeInfo.year && $style.disable]" @click="incrementMonth(-12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M9.134 2.2c.266.267.266.7 0 .967L4.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L2.866 8.483a.685.685 0 0 1 0-.966L8.17 2.2a.68.68 0 0 1 .965 0Zm4 0c.266.267.266.7 0 .967L8.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L6.866 8.483a.685.685 0 0 1 0-.966L12.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <svg :class="['cursor-pointer', ((viewYear < minTimeInfo.year) || (viewYear === minTimeInfo.year && viewMonth <= minTimeInfo.month)) && $style.disable]" @click="incrementMonth(-1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M11.134 2.2c.266.267.266.7 0 .967L6.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L4.866 8.483a.685.685 0 0 1 0-.966L10.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <div class="flex-1 flex justify-center items-center gap-8px">
                <span @click="selectMode('year')" class="cursor-pointer hover:text-[#0c58d2]">{{ viewYear }}</span>
                年
                <span @click="selectMode('month')" class="cursor-pointer hover:text-[#0c58d2]">{{ viewMonth }}</span>
                月
              </div>
              <svg :class="['cursor-pointer', viewYear >= maxTimeInfo.year && viewMonth >= maxTimeInfo.month && $style.disable]" @click="incrementMonth(1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M4.866 2.2a.685.685 0 0 0 0 .967L9.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L5.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <svg :class="['cursor-pointer', viewYear >= maxTimeInfo.year && $style.disable]" @click="incrementMonth(12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M6.866 2.2a.685.685 0 0 0 0 .967L11.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L7.83 2.2a.68.68 0 0 0-.965 0Zm-4 0a.685.685 0 0 0 0 .967L7.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L3.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
            </template>
            <template v-else-if="mode === 'month'">
              <svg :class="['cursor-pointer', viewYear <= minTimeInfo.year && $style.disable]" @click="incrementMonth(-12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M9.134 2.2c.266.267.266.7 0 .967L4.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L2.866 8.483a.685.685 0 0 1 0-.966L8.17 2.2a.68.68 0 0 1 .965 0Zm4 0c.266.267.266.7 0 .967L8.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L6.866 8.483a.685.685 0 0 1 0-.966L12.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <div class="flex-1 flex justify-center items-center gap-8px">
                <span @click="selectMode('year')" class="cursor-pointer hover:text-[#0c58d2]">{{ viewYear }}</span>
                年
              </div>
              <svg :class="['cursor-pointer', viewYear >= maxTimeInfo.year && $style.disable]" @click="incrementMonth(12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M6.866 2.2a.685.685 0 0 0 0 .967L11.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L7.83 2.2a.68.68 0 0 0-.965 0Zm-4 0a.685.685 0 0 0 0 .967L7.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L3.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
            </template>
            <template v-else>
              <svg :class="['cursor-pointer', viewYears.map(({ year }) => year).includes(minTimeInfo.year) && $style.disable]" @click="incrementViewYearInc(-1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M9.134 2.2c.266.267.266.7 0 .967L4.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L2.866 8.483a.685.685 0 0 1 0-.966L8.17 2.2a.68.68 0 0 1 .965 0Zm4 0c.266.267.266.7 0 .967L8.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L6.866 8.483a.685.685 0 0 1 0-.966L12.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <div class="flex-1 flex justify-center items-center gap-8px">
                {{ viewYears[0].year }}
                <span>-</span>
                {{ viewYears[viewYears.length - 1].year }}
              </div>
              <svg :class="['cursor-pointer', viewYears.map(({ year }) => year).includes(maxTimeInfo.year) && $style.disable]" @click="incrementViewYearInc(1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M6.866 2.2a.685.685 0 0 0 0 .967L11.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L7.83 2.2a.68.68 0 0 0-.965 0Zm-4 0a.685.685 0 0 0 0 .967L7.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L3.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
            </template>
          </div>
    
          <div class="h-240px flex flex-col px-18px py-12px justify-between text-[#000c25]" v-if="mode === 'date'">
            <div class="flex justify-between items-center">
              <span :class="[$style.day, 'cursor-default px-4px']" v-for="d of ['日', '一', '二', '三', '四', '五', '六']">{{ d }}</span>
            </div>
            <div v-for="w of dateMartix" :class="$style.week">
              <span
                v-for="d of w"
                :class="[
                  $style.day,
                  d.dateStr === todayDateStr && $style.today,
                  d.inOtherMonth && $style['other-month'],
                   curDateInfo !== null && d.dateStr === curDateInfo.dateStr && $style.curdate,
                  d.disable && $style.disable,
                ]"
                @click="useSelectDate(d)"
              >
                {{ d.date }}
              </span>
            </div>
          </div>
          <div class="h-240px px-32px py-18px flex flex-wrap justify-between items-center gap-y-22px gap-x-34px" v-else-if="mode === 'month'">
            <span
              v-for="m of viewYearMonth"
              :class="[
                'w-48px h-32px flex-none flex justify-center items-center gap-4px cursor-pointer rounded transition',
                m.disable && $style.disable,
                m.isSelectMonth && $style.curmonthyear,
              ]"
              @click="selectViewMonth(m)"
            >
              <span>{{ m.month }}</span>月
            </span>
          </div>
          <div class="h-240px px-32px py-18px flex flex-wrap justify-between items-center gap-y-22px gap-x-34px" v-else-if="mode === 'year'">
            <span
              v-for="y of viewYears"
              :class="[
                'w-48px h-32px flex-none flex justify-center items-center gap-4px cursor-pointer rounded transition',
                y.disable && $style.disable,
                y.isSelectYear && $style.curmonthyear,
              ]"
              @click="selectViewYear(y)"
            >
              <span>{{ y.year }}</span>
            </span>
          </div>
        </div>
        <div v-if="withTime && curDateInfo !== null" class="w-112px h-full border-l flex flex-col">
          <div class="h-40px border-b flex items-center px-12px">
            {{ `${curDateInfo.hour.toString().padStart(2, '0')}:${curDateInfo.minute.toString().padStart(2, '0')}` }}
          </div>
          <div class="flex-1 flex">
            <div @wheel="handleHourWhell" class="flex-1 h-full overflow-hidden flex justify-center items-center border-r">
              <div class="w-full h-32px overflow-visible bg-[#E6EEFA]">
                <div class="w-full h-full flex flex-col transition" :style="{ transform: `translateY(-${curDateInfo.hour*32}px)` }">
                  <span v-for="h of hourSet" :class="['h-full flex-none text-center leading-33px', { 'opacity-50': h.disable }]">{{ h.hour.toString().padStart(2, 0) }}</span>
                </div>
              </div>
            </div>
            <div @wheel="handleMinuteWhell" class="flex-1 h-full overflow-hidden flex justify-center items-center">
              <div class="w-full h-32px overflow-visible bg-[#E6EEFA]">
                <div class="w-full h-full flex flex-col transition" :style="{ transform: `translateY(-${curDateInfo.minute*32}px)` }">
                  <span v-for="m of minuteSet" :class="['h-full flex-none text-center leading-33px', { 'opacity-50': m.disable }]">{{ m.minute.toString().padStart(2, 0) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="withTime" class="w-full h-40px border-t flex justify-end items-center px-14px cursor-pointer transition text-[#0c58d2] hover:opacity-80">
        <span @click="useEimtUpdate">确定</span>
      </div>
    </div>
  </popover>
</template>

<style module lang="postcss">
.container {
  *, *::before, *::after {
    box-sizing: border-box;
    border-width: 0;
    border-style: solid;
    border-color: #DFE3E9;
    user-select: none;
  }

  font-size: 14px;
  box-sizing: border-box;

  .disable {
    cursor: not-allowed;
    opacity: .5;
  }

  .week {
    @apply flex justify-between items-center;

    .day {
      @apply w-24px h-24px rounded flex justify-center cursor-pointer flex-none leading-24px transition;

      &:hover {
        background-color: #EEF1F5;
      }

      &.today {
        @apply border border-[#0c58d2] text-[#0c58d2]
      }

      &.other-month {
        opacity: .5;
      }

      &.curdate {
        background-color: #0c58d2;
        color: #ffffff;
      }

      &.disable {
        opacity: .5;
        cursor: not-allowed;
      }
    }
  }

  .curmonthyear {
    background-color: #0c58d2;
    color: #ffffff;
  }
}

.datepicker-popover {
  padding: 0 !important;
}
</style>
