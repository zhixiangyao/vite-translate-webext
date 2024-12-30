<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { RecordType } from './type'
import { App, Button, Form, FormItem, Input, Table } from 'ant-design-vue'
import { storageWordList } from '~/logic'
import { columns, rules } from './constant'

defineOptions({ name: 'BookList' })

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }
const formRef = ref<FormInstance | null>(null)
const formState = reactive({
  wordList: [] as RecordType[],
})
const { message } = App.useApp()

async function handleAdd(i: number) {
  await formRef.value?.validate()
  formState.wordList?.splice(i + 1, 0, {
    word: '',
  })
}

function handleDelete(i: number) {
  formState.wordList?.splice(i, 1)
  formRef.value?.clearValidate()
}

async function handleSave() {
  await formRef.value?.validate()
  storageWordList.value = formState.wordList
  message.success('保存成功')
}

watch(
  storageWordList,
  (wordList) => {
    formState.wordList = JSON.parse(JSON.stringify(wordList))
  },
  { immediate: true },
)
</script>

<template>
  <div class="book-list">
    <Form
      ref="formRef"
      autocomplete="off"
      :label-col="labelCol"
      :model="formState"
      :rules="rules"
      :wrapper-col="wrapperCol"
    >
      <Table bordered :columns="columns" :data-source="formState.wordList" :pagination="false" size="small">
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
              <Button class="!px-0" size="small" type="link" @click="() => handleAdd(i)">
                新增
              </Button>

              <Button
                v-if="!(formState.wordList?.length === 1 && i === 0)"
                class="!px-0"
                danger
                size="small"
                type="link"
                @click="() => handleDelete(i)"
              >
                删除
              </Button>
            </div>
          </template>
        </template>
      </Table>

      <Button class="mt-2" type="primary" @click="handleSave">
        保存
      </Button>
    </Form>
  </div>
</template>

<style scoped>
.book-list :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
