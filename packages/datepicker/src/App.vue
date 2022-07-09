<script setup>
import { DatePicker } from './components/index'

const handleSelect = (time) => {
  console.log(time)
}
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <DatePicker :max-time="'2030-7-1'" :min-time="'2008-8-8'" @select="handleSelect" />
  </div>
</template>
