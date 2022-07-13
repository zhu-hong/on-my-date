<script>
import { TimeTiny } from '@zhu-hong/usedate'
import { DateTimePicker, TimePicker } from './components/index'

export default {
  components: {
    DateTimePicker,
    TimePicker,
  },
  data() {
    return {
      shortcut: [
        { desc: '今天', time: new Date().getTime() },
        { desc: '不选', time: null },
        { desc: '2007-7-7', time: new Date('2007-7-7').getTime() },
        { desc: '2018-8-8', time: new Date('2018-8-8 8:30').getTime() },
      ],
      withTime: false,
      time1: new Date().getTime(),
      time2: new Date().getTime(),
      hour: 12,
      minute: 12,
    }
  },
  methods: {
    handleSelectTime1(time) {
      if(time > this.time2) {
        this.time2 = time + TimeTiny.Hour
      }
    }
  },
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-start items-center pt-20 box-border">
    <div class="flex gap-6">
      <span>withTime</span>
      <el-switch v-model="withTime">withTime</el-switch>
    </div>
    <date-time-picker
      :time.sync="time1"
      :max-time="'2030-7-1 8:30'"
      :min-time="'2018-8-8 8:30'"
      :shortcut="shortcut"
      :with-time="withTime"
      @select="handleSelectTime1"
    >
      <template v-slot:default="SlotProps">
        <pre>{{ SlotProps }}</pre>
      </template>
    </date-time-picker>

    <div>
      <span>{{ hour }}</span>:<span>{{ minute }}</span>
    </div>
    
    <time-picker :hour.sync="hour" :minute.sync="minute">
      <template v-slot:default>
        <span>!!!!!!!!!!!!!!!!</span>
      </template>
    </time-picker>
    
    <date-time-picker
      :time.sync="time2"
      :min-time="time1 ?? new Date('2000-11-22')"
      :with-time="withTime"
    >
      <template v-slot:default="SlotProps">
        <pre>{{ SlotProps.about }}</pre>
      </template>
    </date-time-picker>
  </div>
</template>
