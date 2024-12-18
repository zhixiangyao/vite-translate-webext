<script setup lang="ts">
import { useDebounce, useEventListener } from '@vueuse/core'

defineOptions({ name: 'Tooltip' })

const tooltip = useTemplateRef<HTMLDivElement>('tooltip')
const tooltipStyle = ref({
  top: '',
  left: '',
})
const highlightedText = ref('')
const isVisible = ref(false)
const debounceIsVisible = useDebounce(isVisible, 300)

function showTooltip(rect: DOMRect) {
  const { x, y, height } = rect
  tooltipStyle.value = {
    top: `${y + height + window.scrollY}px`,
    left: `${x + window.scrollX}px`,
  }
  isVisible.value = true
}

function handleMouseOver(event: MouseEvent) {
  const target = event!.target as HTMLElement

  if (target.tagName === 'SPAN' && target.dataset.highlightedWord && target.textContent) {
    highlightedText.value = target.textContent
    showTooltip(target.getBoundingClientRect())
    return
  }

  if (tooltip.value === target || tooltip.value?.contains(target)) {
    isVisible.value = true
    return
  }

  isVisible.value = false
}

useEventListener(document.body, 'mouseover', handleMouseOver)
useEventListener(document.querySelector(`#${__NAME__}`)?.shadowRoot, 'mouseover', handleMouseOver)
</script>

<template>
  <div
    v-show="debounceIsVisible"
    ref="tooltip"
    class="absolute z-999 w-200px bg-white color-black rounded-md p-2"
    :style="tooltipStyle"
  >
    <p>单词: {{ highlightedText }}</p>
  </div>
</template>
