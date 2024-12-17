<script setup lang="ts">
import { Button, Form, FormItem, Input, Space, Table } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'

import { columns, rules } from './constant'
import { storageWordList } from '~/logic'

defineOptions({ name: 'BookList' })

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }
const formRef = ref<FormInstance | null>(null)
const formState = reactive({
  dataSource: storageWordList,
})

async function handleAdd(i: number) {
  await formRef.value?.validate()
  formState.dataSource?.splice(i + 1, 0, {
    word: '',
  })
}

function handleDelete(i: number) {
  formState.dataSource?.splice(i, 1)
  formRef.value?.clearValidate()
}
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
      bordered
      class="container"
      :columns="columns"
      :data-source="formState.dataSource"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, index: i }: { column: ColumnsType[number], index: number }">
        <template v-if="column.key === 'word'">
          <FormItem :name="['dataSource', i, 'word']" :rules="rules['dataSource[i].word']">
            <Input
              v-model:value.trim="formState.dataSource![i].word"
              :maxlength="100"
              placeholder="请输入"
              show-count
              size="small"
            />
          </FormItem>
        </template>

        <template v-if="column.key === 'operation'">
          <Space>
            <Button class="!px-0" size="small" type="link" @click="() => handleAdd(i)">
              新增
            </Button>

            <Button
              v-if="!(formState.dataSource?.length === 1 && i === 0)"
              class="!px-0"
              danger
              size="small"
              type="link"
              @click="() => handleDelete(i)"
            >
              删除
            </Button>
          </Space>
        </template>
      </template>
    </Table>
  </Form>
</template>

<style scoped>
.container :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
