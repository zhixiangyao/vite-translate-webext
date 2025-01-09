<script setup lang="ts">
import type { ColumnsType } from 'ant-design-vue/es/table'
import { Button, Form, FormItem, Switch, Table } from 'ant-design-vue'
import { useAllowList } from './composables/useAllowList'

defineOptions({ name: 'AllowList' })

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }

const { columns, formRef, formState, disabledCancel, handleDelete, handleSave, handleCancel } = useAllowList()
</script>

<template>
  <Form ref="formRef" autocomplete="off" :label-col="labelCol" :model="formState" :wrapper-col="wrapperCol">
    <Table
      class="allow-list-table"
      bordered
      :columns="columns"
      :data-source="formState.websiteList"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, index: i }: { column: ColumnsType[number], index: number }">
        <template v-if="column.key === 'enable'">
          <FormItem :name="['websiteList', i, 'enable']">
            <Switch v-model:checked="formState.websiteList![i].enable" size="small" />
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
      <Button type="primary" @click="handleSave">
        保存
      </Button>

      <Button :disabled="disabledCancel" @click="handleCancel">
        取消
      </Button>
    </div>
  </Form>
</template>

<style scoped>
.allow-list-table :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
