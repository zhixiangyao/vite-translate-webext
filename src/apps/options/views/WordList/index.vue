<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import { Button, Form, FormItem, Input, Select, Table } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { layoutHeaderRightSlotRef } from '~/apps/options/layout/components/LayoutHeader.vue'
import { useLang } from '~/composables/useLang'
import { useWordList } from './composables/useWordList'

defineOptions({ name: 'WordList' })

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }

const lang = useLang()
const route = useRoute()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'WordList')
const wordList = useWordList()
const { formRef, genIndex } = wordList
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" type="primary" :disabled="wordList.disabledSave.value" @click="wordList.handleSave">
      {{ lang('Save') }}
    </Button>

    <Button size="small" @click="wordList.handleAdd">
      {{ lang('Add') }}
    </Button>
  </Teleport>

  <Form
    ref="formRef"
    autocomplete="off"
    :label-col="labelCol"
    :model="wordList.formState"
    :rules="wordList.rules"
    :wrapper-col="wrapperCol"
  >
    <Table
      class="word-list-table"
      bordered
      :columns="wordList.columns.value"
      :data-source="wordList.formState.list"
      :pagination="wordList.pagination.value"
      size="small"
    >
      <template #bodyCell="{ column, index }: { column: ColumnsType[number], index: number }">
        <template v-if="column.key === 'word'">
          <FormItem :name="['list', genIndex(index), 'word']" :rules="wordList.rules['list[i].word']">
            <Input
              v-model:value.trim="wordList.formState.list![genIndex(index)].word"
              :maxlength="100"
              :placeholder="lang('Please enter')"
              show-count
              size="small"
            />
          </FormItem>
        </template>

        <template v-if="column.key === 'groupUUID'">
          <FormItem :name="['list', genIndex(index), 'groupUUID']">
            <Select
              v-model:value="wordList.formState.list![genIndex(index)].groupUUID"
              :placeholder="lang('Please select group')"
              size="small"
              :options="wordList.options.value"
            />
          </FormItem>
        </template>

        <template v-if="column.key === 'operation'">
          <div class="flex gap-2">
            <Button class="!px-0" danger size="small" type="link" @click="() => wordList.handleDelete(genIndex(index))">
              {{ lang('Delete') }}
            </Button>
          </div>
        </template>
      </template>
    </Table>
  </Form>
</template>

<style scoped>
.word-list-table :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
