<script setup lang="ts">
import ModalSearch from './components/ModalSearch.vue'
import ModalTranslate from './components/ModalTranslate.vue'
import { useModalSearch } from './composables/useModalSearch'
import { useModalTranslate } from './composables/useModalTranslate'

defineOptions({ name: 'App' })

const modalTranslate = useModalTranslate()
const disabledSearch = computed(() => modalTranslate.state.open)
const modalSearch = useModalSearch(disabledSearch)
</script>

<template>
  <ModalTranslate
    v-model:text="modalTranslate.state.text"
    v-model:pin="modalTranslate.state.pin"
    :open="modalTranslate.state.open"
    :left="modalTranslate.state.left"
    :top="modalTranslate.state.top"
    :result="modalTranslate.state.result"
    :loading="modalTranslate.state.loading"
    :favorite="modalTranslate.favorite.value"
    @search="modalTranslate.handleSearch"
    @close="modalTranslate.handleHidden"
    @add="modalTranslate.handleAdd"
    @remove="modalTranslate.handleRemove"
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
