<script lang="ts" setup>
import { useLang } from '~/composables/useLang'

defineOptions({ name: 'LangWrap' })
defineProps<{ value: string }>()

const lang = useLang()
</script>

<template>
  <span>{{ lang(value ?? '') }}</span>
</template>
