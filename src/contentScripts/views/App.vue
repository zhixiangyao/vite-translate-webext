<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'

import { highlight, unhighlight } from '~/logic/hightlight'
import { storageWordList } from '~/logic/storage'

const [show, toggle] = useToggle(false)

function handle() {
  toggle()
  const words = storageWordList.value.map(value => value.word)
  if (show.value)
    highlight(words, 'color: red; font-weight: bold')
  else unhighlight()
}
</script>

<template>
  <div class="fixed right-0 bottom-0 m-5 z-100 flex items-end font-sans select-none leading-1em">
    <button
      class="flex w-10 h-10 rounded-full shadow cursor-pointer border-none justify-center items-center"
      :bg="show ? 'green-600 hover:green-700' : 'gray-600 hover:gray-700'"
      @click="handle"
    >
      {{ show ? 'OFF' : 'ON' }}
    </button>
  </div>
</template>
