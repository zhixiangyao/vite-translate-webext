<script setup lang="ts">
import { EnumResponseCode } from '~/constant/enum'

interface Props {
  code: EnumResponseCode
}

defineOptions({ name: 'Error' })
defineProps<Props>()
</script>

<template>
  <span v-if="code === EnumResponseCode.Error">Oops! API interface exception! Please try again!</span>
  <span v-if="code === EnumResponseCode.AbortError">Oops! API request timed out! Please try again!</span>
</template>
