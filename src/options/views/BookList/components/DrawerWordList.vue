<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { useDrawerWordList } from '../composables/useDrawerWordList'
import { useElementSize } from '@vueuse/core'
import { Button, Drawer, Form, FormItem, Input, Select, Table } from 'ant-design-vue'

interface Props {
  use: ReturnType<typeof useDrawerWordList>
}

defineOptions({ name: 'DrawerWordList' })
const props = defineProps<Props>()

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }
const { open, formRef, formState } = props.use
const containerRef = ref<HTMLDivElement>()
const containerSize = useElementSize(containerRef)
const tableScroll = computed(() => ({ y: containerSize.height.value - 40 }))
</script>

<template>
  <Drawer v-model:open="open" destroy-on-close title="Edit Book List" placement="right" width="600px">
    <div ref="containerRef" class="h-full">
      <Form
        ref="formRef"
        autocomplete="off"
        :label-col="labelCol"
        :model="formState"
        :rules="use.rules"
        :wrapper-col="wrapperCol"
      >
        <Table
          class="drawer-word-list-table"
          bordered
          :columns="use.columns"
          :data-source="formState.wordList"
          :pagination="false"
          size="small"
          :scroll="tableScroll"
        >
          <template #bodyCell="{ column, index }: { column: ColumnsType[number], index: number }">
            <template v-if="column.key === 'word'">
              <FormItem :name="['wordList', index, 'word']" :rules="use.rules['wordList[i].word']">
                <Input
                  v-model:value.trim="formState.wordList![index].word"
                  :maxlength="100"
                  placeholder="Please enter"
                  show-count
                  size="small"
                />
              </FormItem>
            </template>

            <template v-if="column.key === 'groupUUID'">
              <FormItem :name="['wordList', index, 'groupUUID']">
                <Select
                  v-model:value="formState.wordList![index].groupUUID"
                  placeholder="Please select group"
                  size="small"
                  :options="use.options.value"
                />
              </FormItem>
            </template>

            <template v-if="column.key === 'operation'">
              <div class="flex gap-2">
                <Button class="!px-0" danger size="small" type="link" @click="() => use.handleDelete(index)">
                  Delete
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Form>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <Button type="primary" :disabled="use.disabledSave.value" @click="use.handleSave">
          Save
        </Button>

        <Button @click="() => use.handleAdd(formState.wordList.length)">
          Add
        </Button>
      </div>
    </template>
  </Drawer>
</template>

<style scoped>
.drawer-word-list-table :deep(.ant-form-item) {
  margin-bottom: 0;
}
</style>
