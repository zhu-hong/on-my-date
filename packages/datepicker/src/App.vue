<script setup>
import { ref } from 'vue';
import { DatePicker } from './components/index'

const shortcut = [
  { desc: '今天', time: new Date().getTime() },
  { desc: '2007-7-7', time: new Date('2007-7-7').getTime() },
  { desc: '2018-8-8', time: new Date('2018-8-8 8:30').getTime() },
]

const withTime = ref(true)

const time1 = ref(new Date().getTime())

const time2 = ref(new Date().getTime())

const handleSelectTime1 = (time) => {
  if(time > time2.value) {
    time2.value = time
  }
}
</script>

<template>
  <div class="w-full h-full flex flex-col justify-start items-center pt-20 box-border">
    <div class="flex gap-6">
      <span>withTime</span>
      <el-switch v-model="withTime">withTime</el-switch>
    </div>
    <date-picker
      :time.sync="time1"
      :max-time="'2030-7-1 8:30'"
      :min-time="'2018-8-8 8:30'"
      :shortcut="shortcut"
      :with-time="withTime"
      @select="handleSelectTime1"
    >
      <template v-slot:default="SlotProps">
        <pre>{{ SlotProps.about }}</pre>
      </template>
    </date-picker>
    <date-picker
      :time.sync="time2"
      :min-time="time1"
      :with-time="withTime"
    >
      <template v-slot:default="SlotProps">
        <pre>{{ SlotProps.about }}</pre>
      </template>
    </date-picker>
  </div>
</template>
