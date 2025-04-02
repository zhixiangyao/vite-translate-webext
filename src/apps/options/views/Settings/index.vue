<script lang="ts" setup>
import type { TFormTypeKeys } from './composables/useSettings'
import { Button, Form, FormItem, Input, InputNumber, Skeleton, TabPane, Tabs } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import { layoutHeaderRightSlotRef } from '~/apps/options/layout/components/LayoutHeader.vue'
import { useLang } from '~/composables/useLang'
import ToolbarWebdav from './components/ToolbarWebdav/index.vue'
import { useSettings } from './composables/useSettings'

defineOptions({ name: 'Settings' })

enum EnumActiveKey {
  Basic = 'Basic',
  Webdav = 'Webdav',
}

const CodeEditor = defineAsyncComponent({ loader: () => import('~/apps/options/components/CodeEditor.vue') })

const lang = useLang()
const activeKey = ref<EnumActiveKey>(EnumActiveKey.Basic)
const route = useRoute()
const showTeleport = computed(() => layoutHeaderRightSlotRef.value && route.name === 'Settings')
const { rules, formRef, formState, disabledSave, disabledReset, handleSave, handleReset } = useSettings()
</script>

<template>
  <Teleport v-if="showTeleport" :to="layoutHeaderRightSlotRef">
    <Button size="small" type="primary" :disabled="disabledSave" @click="handleSave">
      {{ lang('Save') }}
    </Button>

    <Button size="small" :disabled="disabledReset" @click="handleReset">
      {{ lang('Restore Defaults') }}
    </Button>
  </Teleport>

  <Form ref="formRef" class="w-200" label-align="left" :model="formState" :label-col="{ span: 4 }">
    <Tabs v-model:active-key="activeKey" size="small" type="card">
      <!-- Basic -->
      <TabPane :key="EnumActiveKey.Basic" :tab="lang('Basic')">
        <FormItem :label="lang('Request URL')" :name="('apiUrl' satisfies TFormTypeKeys)" :rules="rules.apiUrl">
          <Input v-model:value="formState.apiUrl" />
        </FormItem>

        <FormItem :label="lang('Request Token')" :name="('apiToken' satisfies TFormTypeKeys)" :rules="rules.apiToken">
          <Input v-model:value="formState.apiToken" />
        </FormItem>

        <FormItem
          :label="lang('Request Timeout')"
          :name="('apiTimeout' satisfies TFormTypeKeys)"
          :rules="rules.apiTimeout"
        >
          <InputNumber v-model:value="formState.apiTimeout" :min="1" :max="60" :precision="0" />
        </FormItem>

        <FormItem
          :label="lang('Highlight Style')"
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

        <FormItem :label="lang('Theme Color')" :name="('themeColor' satisfies TFormTypeKeys)" :rules="rules.themeColor">
          <Input v-model:value="formState.themeColor" type="color" class="w-22" />
        </FormItem>
      </TabPane>

      <!-- Webdav -->
      <TabPane :key="EnumActiveKey.Webdav" tab="Webdav" force-render>
        <FormItem label="Webdav URL" :name="('webdavUrl' satisfies TFormTypeKeys)" :rules="rules.webdavUrl">
          <Input v-model:value="formState.webdavUrl" />
        </FormItem>

        <FormItem label="Webdav Login" :name="('webdavUsername' satisfies TFormTypeKeys)" :rules="rules.webdavUsername">
          <Input v-model:value="formState.webdavUsername" />
        </FormItem>

        <FormItem
          label="Webdav Password"
          :name="('webdavPassword' satisfies TFormTypeKeys)"
          :rules="rules.webdavPassword"
        >
          <Input v-model:value="formState.webdavPassword" type="password" />
        </FormItem>

        <FormItem label="Webdav Path" :name="('webdavPath' satisfies TFormTypeKeys)" :rules="rules.webdavPath">
          <Input v-model:value="formState.webdavPath" />
        </FormItem>

        <FormItem>
          <ToolbarWebdav
            :disabled="disabledSave"
            :url="formState.webdavUrl"
            :username="formState.webdavUsername"
            :password="formState.webdavPassword"
            :path="formState.webdavPath"
          />
        </FormItem>
      </TabPane>
    </Tabs>
  </Form>
</template>
