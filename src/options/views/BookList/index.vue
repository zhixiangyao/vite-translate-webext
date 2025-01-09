<script setup lang="ts">
import type { ColumnsType } from 'ant-design-vue/es/table'
import { Button, Form, FormItem, Input, Table } from 'ant-design-vue'
import { useBookList } from './composables/useBookList'

defineOptions({ name: 'BookList' })

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }

const { columns, rules, formRef, formState, disabledAdd, handleAdd, handleDelete, handleSave } = useBookList()
</script>

<template>
  <Form
    ref="formRef"
    autocomplete="off"
    :label-col="labelCol"
    :model="formState"
    :rules="rules"
    :wrapper-col="wrapperCol"
  >
    <Table
      class="book-list-table"
      bordered
      :columns="columns"
      :data-source="formState.wordList"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, index: i }: { column: ColumnsType[number], index: number }">
        <template v-if="column.key === 'word'">
          <FormItem :name="['wordList', i, 'word']" :rules="rules['wordList[i].word']">
            <Input
              v-model:value.trim="formState.wordList![i].word"
              :maxlength="100"
              placeholder="请输入"
              show-count
              size="small"
            />
          </FormItem>
        </template>

        <template v-if="column.key === 'operation'">
          <div class="flex gap-2">
            <Button class="!px-0" danger size="small" type="link" @click="() => handleDelete(i)">
              删除
            </Button>
          </div>
        </template>
      </template>
    </Table>

    <div class="mt-2 flex gap-2">
      <Button type="primary" :disabled="disabledAdd" @click="handleSave">
        保存
      </Button>

      <Button @click="() => handleAdd(formState.wordList.length)">
        新增
      </Button>
    </div>
  </Form>
</template>

<style scoped>
.book-list-table :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
