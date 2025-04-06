<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { Switch } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'
import IconDark from './components/IconDark.vue'
import IconLight from './components/IconLight.vue'

defineOptions({ name: 'SwitchTheme' })

const isDark = useDark()
const lang = useLang()
</script>

<template>
  <Switch
    v-model:checked="isDark"
    :title="lang('Switch Theme')"
  >
    <template #checkedChildren>
      <IconDark />
    </template>
    <template #unCheckedChildren>
      <IconLight />
    </template>
  </Switch>
</template>
