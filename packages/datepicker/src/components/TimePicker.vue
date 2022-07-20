<script>
import { Popover } from 'element-ui'

let _HourThrottle = 0
let _MinuteThrottle = 0

export default {
  props: {
    hour: {
      type: Number,
      default: 0,
    },
    minute: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 112,
    },
    placement: {
      type: String,
      default: 'bottom-end',
    },
  },
  data() {
    return {
      hours: Object.freeze(Array.from(({ length: 24 }), (_, hour) => hour.toString().padStart(2, 0))),
      minutes: Object.freeze(Array.from(({ length: 60 }), (_, minute) => minute.toString().padStart(2, 0))),
      visible: false,
      curtHour: this.hour,
      curtMinute: this.minute,
    }
  },
  components: {
    Popover,
  },
  methods: {
    /**
     * 
     * @param { WheelEvent } e 
     */
    handleHourWheel(e) {
      if(e.ctrlKey || e.metaKey) return

      _HourThrottle += Math.abs(e.deltaY)

      if(_HourThrottle < 250) return

      const forward = e.deltaY > 0 ? 1 : -1

      const incedHour = this.curtHour + forward

      if(incedHour > 23 || incedHour < 0) return

      this.curtHour = incedHour
      _HourThrottle = 0
    },
    handleMinuteWheel(e) {
      if(e.ctrlKey || e.metaKey) return

      _MinuteThrottle += Math.abs(e.deltaY)

      if(_MinuteThrottle < 250) return

      const forward = e.deltaY > 0 ? 1 : -1

      const incedMinute = this.curtMinute + forward

      if(incedMinute > 59 || incedMinute < 0) return

      this.curtMinute = incedMinute
      _MinuteThrottle = 0
    },
    useEmit() {
      this.$emit('update:hour', this.curtHour)
      this.$emit('update:minute', this.curtMinute)

      this.$emit('select', {
        hour: this.curtHour,
        minute: this.curtMinute,
      })

      this.visible = false
    },
    useNow() {
      const d = new Date()
      this.curtHour = d.getHours()
      this.curtMinute = d.getMinutes()

      this.useEmit()
    },
    useSelectHour(hour) {
      this.curtHour = Number(hour)
    },
    useSelectMinute(minute) {
      this.curtMinute = Number(minute)
    },
  },
  watch: {
    hour(hour) {
      this.curtHour = hour
    },
    minute(minute) {
      this.curtMinute = minute
    },
  },
}
</script>

<template>
  <popover :visible-arrow="false" popper-class="z-datepicker-popover" v-model="visible" :placement="placement">
    <template #reference>
      <slot></slot>
    </template>
    <div :style="{ width: `${width}px` }" class="h-304px flex flex-col justify-between">
      <div class="flex-none h-40px border-b border-[#DFE3E9] flex items-center px-12px">
        {{ `${curtHour.toString().padStart(2, 0)}:${curtMinute.toString().padStart(2, 0)}` }}
      </div>
      <div class="flex-1 flex justify-between items-center overflow-hidden">
        <div @wheel="handleHourWheel" class="flex-1 h-full flex flex-col justify-center items-center border-r border-[#DFE3E9]">
          <div class="w-full h-32px bg-[#E6EEFA]">
            <div class="flex flex-col overflow-visible transition" :style="{ transform: `translateY(-${curtHour * 32}px)` }">
              <span @click="useSelectHour(h)" v-for="h of hours" class="flex-none w-full h-32px flex justify-center items-center cursor-pointer">{{ h }}</span>
            </div>
          </div>
        </div>
        <div @wheel="handleMinuteWheel" class="flex-1 h-full flex flex-col justify-center items-center overflow-hidden">
          <div class="w-full h-32px bg-[#E6EEFA]">
            <div class="flex flex-col overflow-visible transition" :style="{ transform: `translateY(-${curtMinute * 32}px)` }">
              <span @click="useSelectMinute(m)" v-for="m of minutes" class="flex-none w-full h-32px flex justify-center items-center cursor-pointer">{{ m }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-none h-40px border-t border-[#DFE3E9] flex justify-between items-center px-12px">
        <span class="cursor-pointer text-[#0c58d2] hover:opacity-80" @click="useNow">此刻</span>
        <span class="cursor-pointer text-[#0c58d2] hover:opacity-80" @click="useEmit">确定</span>
      </div>
    </div>
  </popover>
</template>
