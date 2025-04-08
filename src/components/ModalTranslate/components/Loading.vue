<script setup lang="ts">
import { useLang } from '~/composables/useLang'

defineOptions({ name: 'Loading' })

const lang = useLang()
</script>

<template>
  <span>{{ lang('Loading') }}...</span>
</template>
