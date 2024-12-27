<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { useStyleTag } from '@vueuse/core'
import { App, Button, Col, Form, FormItem, Input, InputNumber, Row, Space } from 'ant-design-vue'
import { css as cssBeautify } from 'js-beautify'
import { defaultStorageSetting, storageSetting } from '~/logic'
import Preview from './components/Preview.vue'

defineOptions({ name: 'Settings' })

const CodeEditor = defineAsyncComponent({
  loader: () => import('~/options/components/CodeEditor.vue'),
})

const formRef = ref<FormInstance | null>(null)
const formState = reactive({
  apiUrl: storageSetting.value.api.url,
  apiToken: storageSetting.value.api.token,
  apiTimeout: storageSetting.value.api.timeout / 1000,
  highlightStyle: cssBeautify(defaultStorageSetting.highlight.style),
})
const disabledSave = computed(() => {
  return (
    defaultStorageSetting.api.url === formState.apiUrl
    && defaultStorageSetting.api.token === formState.apiToken
    && defaultStorageSetting.api.timeout === formState.apiTimeout * 1000
    && cssBeautify(defaultStorageSetting.highlight.style) === formState.highlightStyle
  )
})
const { message } = App.useApp()
const { css } = useStyleTag(defaultStorageSetting.highlight.style)

async function handleSave() {
  await formRef.value?.validate()
  const data = toRaw(formState)
  storageSetting.value.api.url = data.apiUrl
  storageSetting.value.api.token = data.apiToken
  storageSetting.value.api.timeout = data.apiTimeout * 1000
  storageSetting.value.highlight.style = data.highlightStyle
  message.success('保存成功')
}

async function handleReset() {
  formState.apiUrl = defaultStorageSetting.api.url
  formState.apiToken = defaultStorageSetting.api.token
  formState.apiTimeout = defaultStorageSetting.api.timeout / 1000
  formState.highlightStyle = cssBeautify(defaultStorageSetting.highlight.style)

  storageSetting.value.api.url = defaultStorageSetting.api.url
  storageSetting.value.api.token = defaultStorageSetting.api.token
  storageSetting.value.api.timeout = defaultStorageSetting.api.timeout
  storageSetting.value.highlight.style = defaultStorageSetting.highlight.style
  message.success('恢复默认成功')
}

watch(
  () => formState.highlightStyle,
  value => (css.value = value),
)
</script>

<template>
  <Row>
    <Col :span="14">
      <Form ref="formRef" label-align="left" :model="formState" :label-col="{ span: 4 }">
        <FormItem label="请求 URL" name="apiUrl" required>
          <Input v-model:value="formState.apiUrl" />
        </FormItem>

        <FormItem label="请求 Token" name="apiToken" required>
          <Input v-model:value="formState.apiToken" />
        </FormItem>

        <FormItem label="请求 Timeout" name="apiTimeout" required>
          <InputNumber v-model:value="formState.apiTimeout" :min="1" :max="60" :precision="0" />
        </FormItem>

        <FormItem label="Highlight Style" name="highlightStyle" required>
          <Suspense>
            <CodeEditor v-model:code="formState.highlightStyle" language="css" />

            <template #fallback>
              <WLoading />
            </template>
          </Suspense>
        </FormItem>

        <FormItem>
          <Space>
            <Button type="primary" @click="handleSave">
              保存
            </Button>

            <Button :disabled="disabledSave" @click="handleReset">
              恢复默认
            </Button>
          </Space>
        </FormItem>
      </Form>
    </Col>

    <Col :span="10">
      <Preview />
    </Col>
  </Row>
</template>
