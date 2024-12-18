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
  <ModalTranslate
    v-model:text="modalTranslate.state.text"
    v-model:pin="modalTranslate.state.pin"
    :open="modalTranslate.state.open"
    :left="modalTranslate.state.left"
    :top="modalTranslate.state.top"
    @close="modalTranslate.handleHidden"
  />
  <ModalSearch
    :open="modalSearch.state.open"
    :text="modalSearch.state.text"
    :left="modalSearch.state.left"
    :top="modalSearch.state.top"
    @search="
      () => {
        modalSearch.handleHidden()
        modalTranslate.handleShow(modalSearch.state.text, modalSearch.state.left, modalSearch.state.top)
      }
    "
  />
</template>
