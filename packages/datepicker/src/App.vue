<script setup>
import { TimeTiny } from '@zhu-hong/datematrix';
import { ref } from 'vue';
import { DatePicker } from './components/index'

const handleSelect = (time) => {
  console.log(new Date(time).toLocaleString())
}

const shortcut = [
  { desc: '今天', time: new Date().getTime() },
  { desc: '2007-7-7', time: new Date('2007-7-7').getTime() },
  { desc: '2018-8-8', time: new Date('2018-8-8 8:30').getTime() },
]

const withTime = ref(true)

const time = ref(new Date().getTime())

// setInterval(() => {
//   time.value = time.value + TimeTiny.Day
// }, 1000)
</script>

<template>
  <div class="w-full h-full flex flex-col justify-center items-center">
    <el-switch v-model="withTime"></el-switch>
    <DatePicker :time="time" :max-time="'2030-7-1 8:30'" :min-time="'2018-8-8 8:30'" @select="handleSelect" :shortcut="shortcut" :with-time="withTime" />
  </div>
</template>
