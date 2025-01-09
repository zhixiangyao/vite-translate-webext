<script setup lang="ts">
import { useAnimate } from '@vueuse/core'
import { theme } from 'ant-design-vue'

defineOptions({ name: 'HeaderTop' })

const { token } = theme.useToken()
const textRef = ref<HTMLElement>()
const { play, playState } = useAnimate(
  textRef,
  [
    { clipPath: 'circle(20% at 0% 30%)' },
    { clipPath: 'circle(20% at 50% 80%)' },
    { clipPath: 'circle(20% at 100% 30%)' },
  ],
  {
    duration: 2000,
    iterations: 2,
    direction: 'alternate',
    easing: 'cubic-bezier(0.46, 0.03, 0.52, 0.96)',
  },
)

function handlePlay() {
  if (playState.value === 'finished') {
    play()
  }
}
</script>

<template>
  <p
    ref="textRef"
    class="text-4xl! font-800 text-center select-none"
    :class="playState === 'finished' && 'cursor-pointer'"
    :style="{ color: token.colorPrimary }"
    @click="handlePlay"
  >
    Translate
  </p>
</template>
