<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { Button, Form, FormItem, Input, InputNumber, message, Space } from 'ant-design-vue'
import { defaultStorageSetting, storageSetting } from '~/logic'

const formRef = ref<FormInstance | null>(null)
const formState = reactive({
  apiUrl: storageSetting.value.api.url,
  apiToken: storageSetting.value.api.token,
  apiTimeout: storageSetting.value.api.timeout / 1000,
})

async function handleSave() {
  await formRef.value?.validate()
  const data = toRaw(formState)
  storageSetting.value.api.url = data.apiUrl
  storageSetting.value.api.token = data.apiToken
  storageSetting.value.api.timeout = data.apiTimeout * 1000
  message.success('保存成功')
}

async function handleReset() {
  formState.apiUrl = defaultStorageSetting.api.url
  formState.apiToken = defaultStorageSetting.api.token
  formState.apiTimeout = defaultStorageSetting.api.timeout / 1000

  storageSetting.value.api.url = defaultStorageSetting.api.url
  storageSetting.value.api.token = defaultStorageSetting.api.token
  storageSetting.value.api.timeout = defaultStorageSetting.api.timeout
  message.success('恢复默认成功')
}
</script>

<template>
  <div class="p-4">
    <Form ref="formRef" label-align="left" :model="formState">
      <FormItem label="Url" name="apiUrl" required>
        <Input v-model:value="formState.apiUrl" />
      </FormItem>

      <FormItem label="Token" name="apiToken" required>
        <Input v-model:value="formState.apiToken" />
      </FormItem>

      <FormItem label="Timeout" name="apiTimeout" required>
        <InputNumber v-model:value="formState.apiTimeout" :min="1" :max="60" :precision="0" />
      </FormItem>

      <FormItem>
        <Space>
          <Button type="primary" @click="handleSave">
            保存
          </Button>

          <Button @click="handleReset">
            恢复默认
          </Button>
        </Space>
      </FormItem>
    </Form>
  </div>
</template>
