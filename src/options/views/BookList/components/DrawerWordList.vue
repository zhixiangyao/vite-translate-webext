<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table'
import type { useDrawerWordList } from '../composables/useDrawerWordList'
import { useElementSize } from '@vueuse/core'
import { Button, Drawer, Form, FormItem, Input, Table } from 'ant-design-vue'

interface Props {
  use: ReturnType<typeof useDrawerWordList>
}

defineOptions({ name: 'DrawerWordList' })
const props = defineProps<Props>()

const labelCol = { span: 3 }
const wrapperCol = { span: 24 - labelCol.span }
const formRef = toRef(props.use, 'formRef')
const open = toRef(props.use, 'open')
const containerRef = ref<HTMLDivElement>()
const containerSize = useElementSize(containerRef)
const tableScroll = computed(() => ({ y: containerSize.height.value - 40 }))
</script>

<template>
  <Drawer v-model:open="open" destroy-on-close title="编辑单词列表" placement="right" width="70%">
    <div ref="containerRef" class="h-full">
      <Form
        ref="formRef"
        autocomplete="off"
        :label-col="labelCol"
        :model="props.use.formState"
        :rules="props.use.rules"
        :wrapper-col="wrapperCol"
      >
        <Table
          class="drawer-word-list-table"
          bordered
          :columns="props.use.columns"
          :data-source="props.use.formState.wordList"
          :pagination="false"
          size="small"
          :scroll="tableScroll"
        >
          <template #bodyCell="{ column, index }: { column: ColumnsType[number], index: number }">
            <template v-if="column.key === 'word'">
              <FormItem :name="['wordList', index, 'word']" :rules="props.use.rules['wordList[i].word']">
                <Input
                  v-model:value.trim="props.use.formState.wordList![index].word"
                  :maxlength="100"
                  placeholder="请输入"
                  show-count
                  size="small"
                />
              </FormItem>
            </template>

            <template v-if="column.key === 'operation'">
              <div class="flex gap-2">
                <Button class="!px-0" danger size="small" type="link" @click="() => props.use.handleDelete(index)">
                  删除
                </Button>
              </div>
            </template>
          </template>
        </Table>
      </Form>
    </div>

    <template #footer>
      <div class="flex gap-2">
        <Button type="primary" :disabled="props.use.disabledAdd.value" @click="props.use.handleSave">
          保存
        </Button>

        <Button @click="() => props.use.handleAdd(props.use.formState.wordList.length)">
          新增
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
