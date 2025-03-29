<script lang="ts" setup>
import type { TFormTypeKeys } from './composables/useSettings'
import { Button, Form, FormItem, Input, InputNumber, Skeleton, TabPane, Tabs } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { layoutHeaderRightSlotRef } from '~/options/layout/components/LayoutHeader.vue'
import ToolbarWebdav from './components/ToolbarWebdav/index.vue'
import { useSettings } from './composables/useSettings'

defineOptions({ name: 'Settings' })

enum EnumActiveKey {
  Basic = 'Basic',
  Webdav = 'Webdav',
}

const CodeEditor = defineAsyncComponent({ loader: () => import('~/options/components/CodeEditor.vue') })

const activeKey = ref<EnumActiveKey>(EnumActiveKey.Basic)
const route = useRoute()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'Settings')
const { rules, formRef, formState, disabledSave, disabledReset, handleSave, handleReset } = useSettings()
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

      <!-- Webdav -->
      <TabPane :key="EnumActiveKey.Webdav" tab="Webdav" force-render>
        <FormItem label="Webdav URL" :name="('WebdavUrl' satisfies TFormTypeKeys)" :rules="rules.WebdavUrl">
          <Input v-model:value="formState.WebdavUrl" />
        </FormItem>

        <FormItem label="Webdav Login" :name="('WebdavUsername' satisfies TFormTypeKeys)" :rules="rules.WebdavUsername">
          <Input v-model:value="formState.WebdavUsername" />
        </FormItem>

        <FormItem label="Webdav Password" :name="('WebdavPassword' satisfies TFormTypeKeys)" :rules="rules.WebdavPassword">
          <Input v-model:value="formState.WebdavPassword" type="password" />
        </FormItem>

        <FormItem label="Webdav Path" :name="('WebdavPath' satisfies TFormTypeKeys)" :rules="rules.WebdavPath">
          <Input v-model:value="formState.WebdavPath" />
        </FormItem>

        <FormItem>
          <ToolbarWebdav
            :disabled="disabledSave"
            :url="formState.WebdavUrl"
            :username="formState.WebdavUsername"
            :password="formState.WebdavPassword"
            :path="formState.WebdavPath"
          />
        </FormItem>
      </TabPane>
    </Tabs>
  </Form>
</template>
