<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import { Button, Form, FormItem, Switch, Table } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { layoutHeaderRightSlotRef } from '~/apps/options/layout/components/LayoutHeader.vue'
import { useLang } from '~/composables/useLang'
import { useWebsiteList } from './composables/useWebsiteList'

defineOptions({ name: 'WebsiteList' })

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }

const lang = useLang()
const route = useRoute()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'WebsiteList')
const websiteList = useWebsiteList()
const { formRef, genIndex } = websiteList
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" type="primary" :disabled="websiteList.disabledAdd.value" @click="websiteList.handleSave">
      {{ lang('Save') }}
    </Button>

    <Button size="small" type="dashed" :disabled="websiteList.disabledAdd.value" @click="websiteList.handleCancel">
      {{ lang('Cancel') }}
    </Button>
  </Teleport>

  <Form
    ref="formRef"
    autocomplete="off"
    :label-col="labelCol"
    :model="websiteList.formState"
    :rules="void 0"
    :wrapper-col="wrapperCol"
  >
    <Table
      class="website-list-table"
      bordered
      :columns="websiteList.columns.value"
      :data-source="websiteList.formState.list"
      :pagination="websiteList.pagination.value"
      size="small"
    >
      <template #bodyCell="{ column, index }: { column: ColumnsType[number], index: number }">
        <template v-if="column.key === 'enable'">
          <FormItem :name="['list', genIndex(index), 'enable']">
            <Switch v-model:checked="websiteList.formState.list![genIndex(index)].enable" size="small" />
          </FormItem>
        </template>

        <template v-if="column.key === 'operation'">
          <div class="flex gap-2">
            <Button
              class="!px-0"
              danger
              size="small"
              type="link"
              @click="() => websiteList.handleDelete(genIndex(index))"
            >
              {{ lang('Delete') }}
            </Button>
          </div>
        </template>
      </template>
    </Table>
  </Form>
</template>

<style scoped>
.website-list-table :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
