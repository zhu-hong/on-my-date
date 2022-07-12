<script>
import { useDateMatrix, useDateDetail } from '@zhu-hong/usedate'
import { Popover } from 'element-ui'

const todayDate = new Date()

export default {
  props: {
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
  },
  components: {
    Popover,
  },
  data() {
    return {
      curDate: this.time === null ? null : new Date(this.time),
      viewYear: this.curDateInfo == null ? todayDate.getFullYear() : this.curDateInfo.year,
      viewMonth: this.curDateInfo == null ? todayDate.getMonth() + 1 : this.curDateInfo.month,
      visible: false,
      mode: 'date',
      viewYearInc: 0,
    }
  },
  computed: {
    todayDateStr() {
      return `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`
    },
    curDateInfo() {
      return useDateDetail(this.curDate)
    },
    minTimeInfo() {
      return useDateDetail(this.minTime)
    },
    maxTimeInfo() {
      return useDateDetail(this.maxTime)
    },
    shortcutOptions() {
      return this.shortcut.map((s) => {
        let disable = false

        if(s.time === null) {
          disable = false
        } else if(s.time > this.maxTimeInfo.timestamp || s.time < this.minTimeInfo.timestamp) {
          disable = true
        }

        return {
          ...s,
          disable,
        }
      })
    },
    viewYearMonth() {
      return Array.from({ length: 12 }, (_, num) => {
        let disable = false
        const month = num + 1

        if(this.viewYear === this.maxTimeInfo.year && month > this.maxTimeInfo.month) {
          disable = true
        }

        if(this.viewYear === this.minTimeInfo.year && month < this.minTimeInfo.month) {
          disable = true
        }

        return {
          disable,
          month,
          isSelectMonth: this.viewMonth === month
        }
      })
    },
    viewYears() {
      return Array.from({ length: 12 }, (_, num) => {
        const year = this.viewYear + num + this.viewYearInc * 12

        return {
          year,
          disable: year > this.maxTimeInfo.year || year < this.minTimeInfo.year,
          isSelectYear: year === this.viewYear
        }
      })
    },
    hourSet() {
      return Array.from({ length: 24 }, (_, hour) => {
        let disable = false

        if(this.curDateInfo !== null) {
          const curDate = new Date(this.curDateInfo.dateStr)
          const { timestamp: minTime } = this.minTimeInfo
          const { timestamp: maxTime } = this.maxTimeInfo
      
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
    },
    minuteSet() {
      return Array.from({ length: 60 }, (_, minute) => {
        let disable = false

        if(this.curDateInfo !== null) {
          const { dateStr, hour } = this.curDateInfo
          const { timestamp: minTime } = this.minTimeInfo
          const { timestamp: maxTime } = this.maxTimeInfo
      
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
    },
    dateMartix() {
      return useDateMatrix(this.viewYear, this.viewMonth).map((week) => {
        week = week.map((day) => {
          if(new Date(day.timestamp).setHours(23,59,59) < this.minTimeInfo.timestamp || day.timestamp > this.maxTimeInfo.timestamp) {
            day.disable = true
          } else {
            day.disable = false
          }

          return day
        })

        return week
      })
    },
    timeDetail() {
      return useDateDetail(this.time)
    },
  },
  methods: {
    useSelectDate(day) {
      if(day.disable) return

      const { year, month } = day

      if(this.viewYear !== year || this.viewMonth !== month) {
        this.viewYear = year
        this.viewMonth = month
      }

      if(!this.withTime) {
        this.curDate = new Date(day.dateStr)
      } else {
        if(this.curDateInfo !== null) {
          const { hour: curtHour, minute: curtMinute } = this.curDateInfo
          const { year: minYear, month: minMonth, date: minDate, hour: minHour, minute: minMinute } = this.minTimeInfo
          const { year: maxYear, month: maxMonth, date: maxDate, hour: maxHour, minute: maxMinute } = this.maxTimeInfo
      
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

          this.curDate = new Date(`${day.dateStr} ${incedHour}:${incedMinute}`)
        } else {
          this.curDate = new Date(day.dateStr)
        }

      }

      if(this.withTime) return

      this.useEimtUpdate()
    },
    incrementMonth(count) {
      const forward = count < 0 ? -1 : 1

      count = Math.abs(count)

      const incYear = Math.floor(count / 12)

      const incMonth = count % 12

      let incedYear = this.viewYear + forward * incYear

      let incedMonth = this.viewMonth + forward * incMonth

      if(incedMonth > 12) {
        incedYear++
        incedMonth = 1
      } else if(incedMonth < 1) {
        incedYear--
        incedMonth = 12
      }

      const { year: minYear } = this.minTimeInfo
      const { year: maxYear } = this.maxTimeInfo

      if(forward < 0 && incedYear < minYear) return
      if(forward > 0 && incedYear > maxYear) return

      if(forward > 0 && incedYear < minYear) {
        incedYear = minYear
      }

      if(forward < 0 && incedYear > maxYear) {
        incedYear = maxYear
      }

      this.viewYear = incedYear

      if(this.viewYear === minYear && this.viewMonth < this.minTimeInfo.month) {
        this.viewMonth = this.minTimeInfo.month
      }
      if(this.viewYear === maxYear && this.viewMonth > this.maxTimeInfo.month) {
        this.viewMonth = this.maxTimeInfo.month
      }

      if(this.viewYear === minYear && incedMonth < this.minTimeInfo.month) return
      if(this.viewYear === maxYear && incedMonth > this.maxTimeInfo.month) return

      this.viewMonth = incedMonth
    },
    useSelectMode(mode) {
      this.mode = mode
    },
    useIncViewYear(count) {
      if(count < 0 && this.viewYears.map(({ year }) => year).includes(this.minTimeInfo.year)) return
      if(count > 0 && this.viewYears.map(({ year }) => year).includes(this.maxTimeInfo.year)) return

      this.viewYearInc += count
    },
    useSelectViewYear(year) {
      if(year.disable) return

      this.viewYear = year.year
      this.viewYearInc = 0

      this.useSelectMode('month')
    },
    useSelectViewMonth(month) {
      if(month.disable) return

      this.viewMonth = month.month
      this.useSelectMode('date')
    },
    useSelectShortcut(shortcut) {
      if(shortcut.disable) return

      if(shortcut.time === null) {
        this.curDate = null
      } else {
        const { year, month, timestamp } = useDateDetail(shortcut.time)
        this.viewYear = year
        this.viewMonth = month
        this.curDate = new Date(timestamp)
      }

      this.useEimtUpdate()
    },
    useEimtUpdate() {
      if(this.curDate !== null) {
        const time = this.curDate.getTime()
        this.$emit('update:time', time)
        this.$emit('select', time)
      } else {
        this.$emit('update:time', null)
        this.$emit('select', null)

        this.viewYear = todayDate.getFullYear()
        this.viewMonth = todayDate.getMonth() + 1
      }

      this.visible = false
    },
    handleHourWhell(e) {
      if(e.ctrlKey || e.metaKey) return

      if(this.curDateInfo !== null) {
        const inc = e.deltaY > 0 ? 1 : -1

        const { year: curtYear, month: curtMonth, date: curtDate, dateStr, hour, minute: curtMinute } = this.curDateInfo
      
        const incedHour = hour + inc
        let incedMinute = curtMinute
      
        if(incedHour > 23 || incedHour < 0) return
      
        const { disable } = this.hourSet.find((h) => h.hour === incedHour)
      
        if(disable) return
      
        const { year: minYear, month: minMonth, date: minDate, hour: minHour, minute: minMinute } = this.minTimeInfo
        const { year: maxYear, month: maxMonth, date: maxDate, hour: maxHour, minute: maxMinute } = this.maxTimeInfo
      
        if(curtYear === minYear && curtMonth === minMonth && curtDate === minDate && incedHour === minHour && curtMinute < minMinute) {
          incedMinute = minMinute
        }
      
        if(curtYear === maxYear && curtMonth === maxMonth && curtDate === maxDate && incedHour === maxHour && curtMinute > maxMinute) {
          incedMinute = maxMinute
        }

        this.curDate = new Date(`${dateStr} ${incedHour}:${incedMinute}`)
      }
    },
    handleMinuteWhell(e) {
      if(this.curDateInfo !== null) {
        if(e.ctrlKey || e.metaKey) return
        const inc = e.deltaY > 0 ? 1 : -1
      
        const { dateStr, hour: curtHour,  minute } = this.curDateInfo
      
        const incedMinute = minute + inc
      
        if(incedMinute > 59 || incedMinute < 0) return
        
        const { disable } = this.minuteSet.find((m) => m.minute === incedMinute)
      
        if(disable) return
      
        this.curDate = new Date(`${dateStr} ${curtHour}:${incedMinute}`)
      }
    },
  },
  watch: {
    time(time) {
      if(time !== null) {
        const { year, month } = useDateDetail(time)
        this.curDate = new Date(time)
    
        this.mode = 'date'
        this.viewYear = year
        this.viewMonth = month
      } else {
        this.mode = 'date'
        this.viewYear = todayDate.getFullYear()
        this.viewMonth = todayDate.getMonth() + 1
      }
    },
  },
}
</script>

<template>
  <popover :visible-arrow="false" popper-class="z-datepicker-popover" v-model="visible">
    <template slot="reference">
      <slot v-bind:about="timeDetail"></slot>
    </template>
    <div :class="['flex flex-col justify-between items-center rounded bg-white text-14px', withTime ? 'h-320px' : 'h-280px']">
      <div class="flex justify-between items-center">
        <div v-show="shortcutOptions.length > 0" class="w-100px h-full border-r border-[#DFE3E9] flex flex-col gap-14px overflow-auto items-center p-14px">
          <span
            v-for="s of shortcutOptions"
            :class="[
              'w-full truncate flex-none text-[#0c58d2] text-center cursor-pointer',
              { 'disable': s.disable },
            ]"
            @click="useSelectShortcut(s)"
          >
            {{ s.desc }}
          </span>
        </div>
        <div class="w-280px flex flex-col">
          <div class="h-40px border-b border-[#DFE3E9] flex justify-between items-center gap-12px px-18px">
            <template v-if="mode === 'date'">
              <svg :class="['cursor-pointer', { 'disable': viewYear <= minTimeInfo.year }]" @click="incrementMonth(-12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M9.134 2.2c.266.267.266.7 0 .967L4.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L2.866 8.483a.685.685 0 0 1 0-.966L8.17 2.2a.68.68 0 0 1 .965 0Zm4 0c.266.267.266.7 0 .967L8.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L6.866 8.483a.685.685 0 0 1 0-.966L12.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <svg :class="['cursor-pointer', { 'disable': (viewYear < minTimeInfo.year) || (viewYear === minTimeInfo.year && viewMonth <= minTimeInfo.month) }]" @click="incrementMonth(-1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M11.134 2.2c.266.267.266.7 0 .967L6.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L4.866 8.483a.685.685 0 0 1 0-.966L10.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <div class="flex-1 flex justify-center items-center gap-8px">
                <span @click="useSelectMode('year')" class="cursor-pointer hover:text-[#0c58d2]">{{ viewYear }}</span>
                年
                <span @click="useSelectMode('month')" class="cursor-pointer hover:text-[#0c58d2]">{{ viewMonth }}</span>
                月
              </div>
              <svg :class="['cursor-pointer', { 'disable': viewYear >= maxTimeInfo.year && viewMonth >= maxTimeInfo.month }]" @click="incrementMonth(1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M4.866 2.2a.685.685 0 0 0 0 .967L9.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L5.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <svg :class="['cursor-pointer', { 'disable': viewYear >= maxTimeInfo.year }]" @click="incrementMonth(12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M6.866 2.2a.685.685 0 0 0 0 .967L11.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L7.83 2.2a.68.68 0 0 0-.965 0Zm-4 0a.685.685 0 0 0 0 .967L7.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L3.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
            </template>
            <template v-else-if="mode === 'month'">
              <svg :class="['cursor-pointer', { 'disable': viewYear <= minTimeInfo.year }]" @click="incrementMonth(-12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M9.134 2.2c.266.267.266.7 0 .967L4.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L2.866 8.483a.685.685 0 0 1 0-.966L8.17 2.2a.68.68 0 0 1 .965 0Zm4 0c.266.267.266.7 0 .967L8.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L6.866 8.483a.685.685 0 0 1 0-.966L12.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <div class="flex-1 flex justify-center items-center gap-8px">
                <span @click="useSelectMode('year')" class="cursor-pointer hover:text-[#0c58d2]">{{ viewYear }}</span>
                年
              </div>
              <svg :class="['cursor-pointer', { 'disable': viewYear >= maxTimeInfo.year }]" @click="incrementMonth(12)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M6.866 2.2a.685.685 0 0 0 0 .967L11.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L7.83 2.2a.68.68 0 0 0-.965 0Zm-4 0a.685.685 0 0 0 0 .967L7.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L3.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
            </template>
            <template v-else>
              <svg :class="['cursor-pointer', { 'disable': viewYears.map(({ year }) => year).includes(minTimeInfo.year) }]" @click="useIncViewYear(-1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M9.134 2.2c.266.267.266.7 0 .967L4.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L2.866 8.483a.685.685 0 0 1 0-.966L8.17 2.2a.68.68 0 0 1 .965 0Zm4 0c.266.267.266.7 0 .967L8.313 8l4.82 4.833c.267.267.267.7 0 .967a.68.68 0 0 1-.964 0L6.866 8.483a.685.685 0 0 1 0-.966L12.17 2.2a.68.68 0 0 1 .965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
              <div class="flex-1 flex justify-center items-center gap-8px">
                {{ viewYears[0].year }}
                <span>-</span>
                {{ viewYears[viewYears.length - 1].year }}
              </div>
              <svg :class="['cursor-pointer', { 'disable':  viewYears.map(({ year }) => year).includes(maxTimeInfo.year) }]" @click="useIncViewYear(1)" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px"><path d="M6.866 2.2a.685.685 0 0 0 0 .967L11.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L7.83 2.2a.68.68 0 0 0-.965 0Zm-4 0a.685.685 0 0 0 0 .967L7.687 8l-4.82 4.833a.685.685 0 0 0 0 .967.68.68 0 0 0 .964 0l5.303-5.317a.685.685 0 0 0 0-.966L3.83 2.2a.68.68 0 0 0-.965 0Z" fill="#646A73" fill-rule="evenodd"/></svg>
            </template>
          </div>
    
          <div class="h-240px flex flex-col px-18px py-12px justify-between text-[#000c25]" v-if="mode === 'date'">
            <div class="flex justify-between items-center">
              <span class="w-24px h-24px rounded flex justify-center flex-none leading-24px cursor-default px-4px" v-for="d of ['日', '一', '二', '三', '四', '五', '六']">{{ d }}</span>
            </div>
            <div v-for="w of dateMartix" class="flex justify-between items-center">
              <span
                v-for="d of w"
                :class="[
                  'day w-24px h-24px rounded flex justify-center cursor-pointer flex-none leading-24px transition',
                  { 'border border-[#0c58d2] text-[#0c58d2]': d.dateStr === todayDateStr },
                  { 'opacity-50': d.inOtherMonth },
                  { 'bg-[#0c58d2] text-white': curDateInfo !== null && d.dateStr === curDateInfo.dateStr },
                  { 'disable': d.disable },
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
                { 'bg-[#0c58d2] text-white': m.isSelectMonth },
                { 'disable': m.disable },
              ]"
              @click="useSelectViewMonth(m)"
            >
              <span>{{ m.month }}</span>月
            </span>
          </div>
          <div class="h-240px px-32px py-18px flex flex-wrap justify-between items-center gap-y-22px gap-x-34px" v-else-if="mode === 'year'">
            <span
              v-for="y of viewYears"
              :class="[
                'w-48px h-32px flex-none flex justify-center items-center gap-4px cursor-pointer rounded transition',
                { 'bg-[#0c58d2] text-white': y.isSelectYear },
                { 'disable': y.disable },
              ]"
              @click="useSelectViewYear(y)"
            >
              <span>{{ y.year }}</span>
            </span>
          </div>
        </div>
        <div v-if="withTime && curDateInfo !== null" class="w-112px h-full border-l border-[#DFE3E9] flex flex-col">
          <div class="h-40px border-b border-[#DFE3E9] flex items-center px-12px">
            {{ `${curDateInfo.hour.toString().padStart(2, '0')}:${curDateInfo.minute.toString().padStart(2, '0')}` }}
          </div>
          <div class="flex-1 flex">
            <div @wheel="handleHourWhell" class="flex-1 h-full overflow-hidden flex justify-center items-center border-r border-[#DFE3E9]">
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
      <div v-show="withTime" class="w-full h-40px border-t border-[#DFE3E9] flex justify-end items-center px-14px cursor-pointer transition text-[#0c58d2] hover:opacity-80">
        <span @click="useEimtUpdate">确定</span>
      </div>
    </div>
  </popover>
</template>

<style lang="postcss">
.z-datepicker-popover {
  padding: 0 !important;

  *, *::before, *::after {
    box-sizing: border-box;
    user-select: none;
  }

  .day {
    &:hover {
      background-color: #eef1f5;
    }
  }

  .disable {
    cursor: not-allowed;
    opacity: .5;
  }
}
</style>
