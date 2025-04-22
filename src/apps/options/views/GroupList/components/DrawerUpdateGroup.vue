<script lang="ts" setup>
import type { useDrawerUpdateGroup } from '../composables/useDrawerUpdateGroup'
import { Button, Drawer, Form, FormItem, Input } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'

interface Props {
  use: ReturnType<typeof useDrawerUpdateGroup>
}

defineOptions({ name: 'DrawerUpdateGroup' })
const props = defineProps<Props>()

const labelCol = { span: 4 }
const wrapperCol = { span: 26 - labelCol.span }
const { open, formRef, formState } = props.use

const lang = useLang()
const title = computed(() => (props.use.type.value === 'add' ? lang('Add Group') : lang('Edit Group')))
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
      <FormItem label="uuid" name="uuid">
        <Input readonly :value="formState.uuid" :bordered="false" />
      </FormItem>
      <FormItem :label="lang('Group Name')" name="name" :rules="use.rules.name">
        <Input v-model:value.trim="formState.name" :maxlength="20" :placeholder="lang('Please enter')" show-count />
      </FormItem>
    </Form>

    <template #footer>
      <div class="flex gap-2">
        <Button type="primary" @click="use.handleSave">
          {{ lang('Save') }}
        </Button>
      </div>
    </template>
  </Drawer>
</template>
