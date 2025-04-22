<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { TRecordWord } from '~/storage'
import { Button, Table } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { layoutHeaderRightSlotRef } from '~/apps/options/layout/components/LayoutHeader.vue'
import { useLang } from '~/composables/useLang'
import DrawerUpdateWord from './components/DrawerUpdateWord.vue'
import { useDrawerUpdateWord } from './composables/useDrawerUpdateWord'
import { useWordList } from './composables/useWordList'

defineOptions({ name: 'WordList' })

const lang = useLang()
const route = useRoute()
const drawerUpdateWord = useDrawerUpdateWord()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'WordList')
const wordList = useWordList()
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" @click="() => drawerUpdateWord.handleOpen()">
      {{ lang('Add Word') }}
    </Button>
  </Teleport>

  <Table
    class="word-list-table"
    bordered
    :columns="wordList.columns.value"
    :data-source="wordList.dataSource.value"
    :pagination="wordList.pagination.value"
    size="small"
  >
    <template #bodyCell="params: { column: ColumnsType<TRecordWord>[number], index: number, record: unknown }">
      <template v-if="params.column.key === 'operation'">
        <div class="flex gap-2">
          <Button
            class="!px-0"
            danger
            size="small"
            type="link"
            @click="() => wordList.handleDelete(params.record as TRecordWord)"
          >
            {{ lang('Delete') }}
          </Button>

          <Button
            class="!px-0"
            size="small"
            type="link"
            @click="() => drawerUpdateWord.handleOpen(params.record as TRecordWord)"
          >
            {{ lang('Edit') }}
          </Button>
        </div>
      </template>
    </template>
  </Table>

  <DrawerUpdateWord :use="drawerUpdateWord" />
</template>

<style scoped>
.word-list-table :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
