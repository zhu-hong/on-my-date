<script setup>
import { DatePicker } from './components/index'

const handleSelect = (time) => {
  console.log(time)
}

const shortcut = [
  { desc: '2007-7-7', time: new Date('2007-7-7').getTime() },
  { desc: '2008-8-8', time: new Date('2008-8-8').getTime() },
]
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <DatePicker :max-time="'2030-7-1'" :min-time="'2008-8-8'" @select="handleSelect" :shortcut="shortcut" />
  </div>
</template>
