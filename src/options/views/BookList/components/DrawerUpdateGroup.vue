<script lang="ts" setup>
import type { useDrawerUpdateGroup } from '../composables/useDrawerUpdateGroup'
import { Button, Drawer, Form, FormItem, Input } from 'ant-design-vue'

interface Props {
  use: ReturnType<typeof useDrawerUpdateGroup>
}

defineOptions({ name: 'DrawerUpdateGroup' })
const props = defineProps<Props>()

const labelCol = { span: 4 }
const wrapperCol = { span: 24 - labelCol.span }
const formRef = toRef(props.use, 'formRef')
const open = toRef(props.use, 'open')
const formState = toRef(props.use, 'formState')
const title = computed(() => `${props.use.type.value === 'add' ? '添加' : '编辑'}组`)
</script>

<template>
  <Drawer v-model:open="open" destroy-on-close :title="title" placement="right" width="500px">
    <Form
      ref="formRef"
      autocomplete="off"
      :label-col="labelCol"
      :model="formState"
      :rules="use.rules"
      :wrapper-col="wrapperCol"
    >
      <FormItem label="组名" name="name" :rules="use.rules.name">
        <Input
          v-model:value.trim="formState.name"
          :maxlength="20"
          placeholder="请输入"
          show-count
          size="small"
        />
      </FormItem>
    </Form>
    <template #footer>
      <div class="flex gap-2">
        <Button type="primary" @click="use.handleSave">
          保存
        </Button>
      </div>
    </template>
  </Drawer>
</template>
