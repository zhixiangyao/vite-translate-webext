<script lang="ts" setup>
import type { TFormTypeKeys } from './composables/useSettings'
import { Button, Form, FormItem, Input, InputNumber, Select, Skeleton, TabPane, Tabs } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { layoutHeaderRightSlotRef } from '~/options/layout/components/LayoutHeader.vue'
import ToolbarWebdav from './components/ToolbarWebdav/index.vue'
import { useSettings } from './composables/useSettings'

defineOptions({ name: 'Settings' })

enum EnumActiveKey {
  Basic = 'Basic',
  Cloud = 'Cloud',
}

const CodeEditor = defineAsyncComponent({ loader: () => import('~/options/components/CodeEditor.vue') })

const activeKey = ref<EnumActiveKey>(EnumActiveKey.Basic)
const route = useRoute()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'Settings')
const { rules, options, formRef, formState, disabledSave, disabledReset, handleSave, handleReset } = useSettings()
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" type="primary" :disabled="disabledSave" @click="handleSave">
      Save
    </Button>

    <Button size="small" :disabled="disabledReset" @click="handleReset">
      Restore Defaults
    </Button>
  </Teleport>

  <Form ref="formRef" class="w-200" label-align="left" :model="formState" :label-col="{ span: 4 }">
    <Tabs v-model:active-key="activeKey" size="small" type="card">
      <!-- Basic -->
      <TabPane :key="EnumActiveKey.Basic" tab="Basic">
        <FormItem label="Request URL" :name="('apiUrl' satisfies TFormTypeKeys)" :rules="rules.apiUrl">
          <Input v-model:value="formState.apiUrl" />
        </FormItem>

        <FormItem label="Request Token" :name="('apiToken' satisfies TFormTypeKeys)" :rules="rules.apiToken">
          <Input v-model:value="formState.apiToken" />
        </FormItem>

        <FormItem label="Request Timeout" :name="('apiTimeout' satisfies TFormTypeKeys)" :rules="rules.apiTimeout">
          <InputNumber v-model:value="formState.apiTimeout" :min="1" :max="60" :precision="0" />
        </FormItem>

        <FormItem
          label="Highlight Style"
          :name="('highlightStyle' satisfies TFormTypeKeys)"
          :rules="rules.highlightStyle"
        >
          <Suspense>
            <CodeEditor v-model:code="formState.highlightStyle" language="css" />

            <template #fallback>
              <Skeleton active class="h-[210px]" />
            </template>
          </Suspense>
        </FormItem>

        <FormItem label="Theme Color" :name="('themeColor' satisfies TFormTypeKeys)" :rules="rules.themeColor">
          <Input v-model:value="formState.themeColor" type="color" class="w-22" />
        </FormItem>
      </TabPane>

      <!-- Cloud -->
      <TabPane :key="EnumActiveKey.Cloud" tab="Cloud" force-render>
        <FormItem label="Cloud Type" :name="('cloudType' satisfies TFormTypeKeys)" :rules="rules.cloudType">
          <Select
            v-model:value="formState.cloudType"
            size="small"
            :options="options.cloudType"
            class="!w-44"
            allow-clear
          />
        </FormItem>

        <FormItem label="Cloud URL" :name="('cloudUrl' satisfies TFormTypeKeys)" :rules="rules.cloudUrl">
          <Input v-model:value="formState.cloudUrl" />
        </FormItem>

        <FormItem label="Cloud Login" :name="('cloudUsername' satisfies TFormTypeKeys)" :rules="rules.cloudUsername">
          <Input v-model:value="formState.cloudUsername" />
        </FormItem>

        <FormItem label="Cloud Password" :name="('cloudPassword' satisfies TFormTypeKeys)" :rules="rules.cloudPassword">
          <Input v-model:value="formState.cloudPassword" type="password" />
        </FormItem>

        <!-- 只有 webdav 时才显示 -->
        <FormItem v-if="formState.cloudType === 'webdav'">
          <ToolbarWebdav
            :disabled="disabledSave"
            :url="formState.cloudUrl"
            :username="formState.cloudUsername"
            :password="formState.cloudPassword"
          />
        </FormItem>
      </TabPane>
    </Tabs>
  </Form>
</template>
