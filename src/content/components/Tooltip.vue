<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import Translate from './Translate.vue'

defineOptions({ name: 'Tooltip' })

const tooltip = useTemplateRef<HTMLDivElement>('tooltip')
const state = reactive({
  top: '',
  left: '',
  text: '',
  open: false,
})

function showTooltip(rect: DOMRect, text: string) {
  state.text = text
  state.open = true
  state.left = `${rect.x + window.scrollX}px`
  state.top = `${rect.y + rect.height + window.scrollY + 8}px`
}

function handleClickDown(event: Event) {
  event.stopPropagation()
  event.preventDefault()
  const target = event!.target as HTMLElement

  if (target.id.includes(__NAME__))
    return

  if (window.getSelection()?.toString())
    return

  if (target.tagName === 'SPAN' && target.dataset.highlightedWord && target.textContent) {
    const rect = target.getBoundingClientRect()
    showTooltip(rect, target.textContent)
    return
  }

  state.open = false
}

function handleClickUp(event: Event) {
  event.stopPropagation()
  event.preventDefault()
  const target = event!.target as HTMLElement

  if (target.id.includes(__NAME__))
    return

  const selection = window.getSelection()

  if (selection && selection.toString().trim().length > 0) {
    const rect = selection.getRangeAt(0).getBoundingClientRect()
    showTooltip(rect, selection.toString())
  }
}

useEventListener(document, 'click', handleClickDown)
useEventListener(document, 'mouseup', handleClickUp)
</script>

<template>
  <div
    v-show="state.open"
    ref="tooltip"
    class="absolute z-999 min-w-200px max-w-500px bg-white color-black rounded-sm px-2"
    :style="{ left: state.left, top: state.top }"
  >
    <Translate :value="state.text" />
  </div>
</template>
