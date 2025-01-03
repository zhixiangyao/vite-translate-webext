<script setup lang="ts">
import { useModalSearch } from './components/ModalSearch/composables/useModalSearch'
import ModalSearch from './components/ModalSearch/index.vue'
import { useModalTranslate } from './components/ModalTranslate/composables/useModalTranslate'
import ModalTranslate from './components/ModalTranslate/index.vue'

const props = defineProps<{ root?: HTMLElement }>()

const modalTranslate = useModalTranslate(props.root)
const modalSearch = useModalSearch(computed(() => modalTranslate.state.open))

function search() {
  modalSearch.handleHidden()
  modalTranslate.handleShow(modalSearch.state.text, modalSearch.state.left, modalSearch.state.top)
}
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
    :root="root"
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
    @search="search"
  />
</template>
