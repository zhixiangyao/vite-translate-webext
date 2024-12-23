<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { Button, Form, FormItem, Input, message } from 'ant-design-vue'
import { storageSettingApi } from '~/logic'

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

const formRef = ref<FormInstance | null>(null)
const formState = reactive({
  apiUrl: storageSettingApi.value.url,
  apiToken: storageSettingApi.value.token,
})

async function onSubmit() {
  await formRef.value?.validate()
  const data = toRaw(formState)
  storageSettingApi.value.url = data.apiUrl
  storageSettingApi.value.token = data.apiToken
  message.success('保存成功')
}
</script>

<template>
  <div class="min-w-800px max-w-1280px">
    <Form ref="formRef" :model="formState" v-bind="layout">
      <FormItem label="Api - Url" name="apiUrl" :rules="[{ required: true }]">
        <Input v-model:value="formState.apiUrl" />
      </FormItem>

      <FormItem label="Api - Token" name="apiToken" :rules="[{ required: true }]">
        <Input v-model:value="formState.apiToken" />
      </FormItem>

      <FormItem :wrapper-col="{ offset: 3, span: 21 }">
        <Button type="primary" @click="onSubmit">
          Submit
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
