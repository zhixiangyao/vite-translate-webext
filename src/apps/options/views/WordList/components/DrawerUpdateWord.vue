<script lang="ts" setup>
import type { useDrawerUpdateWord } from '../composables/useDrawerUpdateWord'
import { Button, Drawer, Form, FormItem, Input, Select } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'
import { storageGroupList } from '~/storage'

interface Props {
  use: ReturnType<typeof useDrawerUpdateWord>
}

defineOptions({ name: 'DrawerUpdateWord' })
const props = defineProps<Props>()

const labelCol = { span: 4 }
const wrapperCol = { span: 26 - labelCol.span }
const { open, formRef, formState, type } = props.use

const lang = useLang()
const title = computed(() => (type.value === 'add' ? lang('Add Word') : lang('Edit Word')))
const options = computed(() =>
  storageGroupList.value.map(item => ({
    label: item.name,
    value: item.uuid,
  })),
)
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
      <FormItem :label="lang('Word')" name="word" :rules="use.rules.word">
        <Input
          v-model:value.trim="formState.word"
          :maxlength="100"
          :placeholder="lang('Please enter')"
          show-count
          :disabled="type === 'edit'"
        />
      </FormItem>

      <FormItem :label="lang('Group Name')" name="groupUUID">
        <Select
          v-model:value="formState.groupUUID"
          :placeholder="lang('Please select group')"
          size="small"
          :options="options"
          allow-clear
        />
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
