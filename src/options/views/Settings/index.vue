<script lang="ts" setup>
import { Button, Form, FormItem, Input, InputNumber, Skeleton } from 'ant-design-vue'
import { useSettings } from './composables/useSettings'

defineOptions({ name: 'Settings' })

const CodeEditor = defineAsyncComponent({
  loader: () => import('~/options/components/CodeEditor.vue'),
})

const { rules, formRef, formState, disabledSave, disabledReset, handleSave, handleReset } = useSettings()
</script>

<template>
  <Form ref="formRef" class="w-200" label-align="left" :model="formState" :label-col="{ span: 4 }">
    <FormItem label="请求 URL" name="apiUrl" :rules="rules.apiUrl">
      <Input v-model:value="formState.apiUrl" />
    </FormItem>

    <FormItem label="请求 Token" name="apiToken" :rules="rules.apiToken">
      <Input v-model:value="formState.apiToken" />
    </FormItem>

    <FormItem label="请求 Timeout" name="apiTimeout" :rules="rules.apiTimeout">
      <InputNumber v-model:value="formState.apiTimeout" :min="1" :max="60" :precision="0" />
    </FormItem>

    <FormItem label="Highlight Style" name="highlightStyle" :rules="rules.highlightStyle">
      <Suspense>
        <CodeEditor v-model:code="formState.highlightStyle" language="css" />

        <template #fallback>
          <Skeleton active class="h-[210px]" />
        </template>
      </Suspense>
    </FormItem>

    <FormItem label="Theme Color" name="themeColor" :rules="rules.themeColor">
      <Input v-model:value="formState.themeColor" type="color" class="w-22" />
    </FormItem>

    <FormItem>
      <div class="flex gap-2">
        <Button type="primary" :disabled="disabledSave" @click="handleSave">
          Save
        </Button>

        <Button :disabled="disabledReset" @click="handleReset">
          Restore Defaults
        </Button>
      </div>
    </FormItem>
  </Form>
</template>
