<script setup lang="ts">
import ModalSearch from './components/ModalSearch.vue'
import ModalTranslate from './components/ModalTranslate.vue'
import { useModalSearch } from './composables/useModalSearch'
import { useModalTranslate } from './composables/useModalTranslate'

defineOptions({ name: 'App' })

const modalTranslate = useModalTranslate()
const modalSearch = useModalSearch()
</script>

<template>
  <ModalTranslate v-bind="modalTranslate.state" />
  <ModalSearch
    v-bind="modalSearch.state"
    @search="() => {
      modalSearch.hidden()
      modalTranslate.show(modalSearch.state.text, modalSearch.state.left, modalSearch.state.top)
    }"
  />
</template>
