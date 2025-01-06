<script setup lang="ts">
import ModalSearch from '~/components/ModalSearch/index.vue'
import ModalTranslate from '~/components/ModalTranslate/index.vue'

defineProps<{ root?: HTMLElement }>()

const ref = useTemplateRef('modal-translate')

function search(text: string, left: number, top: number) {
  ref.value?.show(text, left, top)
}
</script>

<template>
  <ModalTranslate ref="modal-translate" :root="root" />

  <ModalSearch :disabled="!!ref?.state.open" @search="search" />
</template>
