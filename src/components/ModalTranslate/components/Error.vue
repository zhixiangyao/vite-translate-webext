<script setup lang="ts">
import { EnumResponseCode } from '~/constant/enum'

interface Props {
  code: EnumResponseCode
}

defineOptions({ name: 'Error' })
defineProps<Props>()
</script>

<template>
  <span v-if="code === EnumResponseCode.Error">糟糕! API 接口异常! 请重新尝试!</span>
  <span v-if="code === EnumResponseCode.AbortError">糟糕! API 请求超时! 请重新尝试!</span>
</template>
