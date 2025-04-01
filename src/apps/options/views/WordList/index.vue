<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import { Button, Form, FormItem, Input, Select, Table } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { layoutHeaderRightSlotRef } from '~/apps/options/layout/components/LayoutHeader.vue'
import { useWordList } from './composables/useWordList'

defineOptions({ name: 'WordList' })

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }

const route = useRoute()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'WordList')
const wordList = useWordList()
const { formRef } = wordList
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" type="primary" :disabled="wordList.disabledSave.value" @click="wordList.handleSave">
      Save
    </Button>

    <Button size="small" @click="wordList.handleAdd">
      Add
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
      :columns="wordList.columns"
      :data-source="wordList.formState.list"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, index: i }: { column: ColumnsType[number], index: number }">
        <template v-if="column.key === 'word'">
          <FormItem :name="['list', i, 'word']" :rules="wordList.rules['list[i].word']">
            <Input
              v-model:value.trim="wordList.formState.list![i].word"
              :maxlength="100"
              placeholder="Please enter"
              show-count
              size="small"
            />
          </FormItem>
        </template>

        <template v-if="column.key === 'groupUUID'">
          <FormItem :name="['list', i, 'groupUUID']">
            <Select
              v-model:value="wordList.formState.list![i].groupUUID"
              placeholder="Please select group"
              size="small"
              :options="wordList.options.value"
            />
          </FormItem>
        </template>

        <template v-if="column.key === 'operation'">
          <div class="flex gap-2">
            <Button class="!px-0" danger size="small" type="link" @click="() => wordList.handleDelete(i)">
              Delete
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
