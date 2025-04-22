<script setup lang="ts">
import { useLang } from '~/composables/useLang'
import { EnumResponseCode } from '~/constant/enum'

interface Props {
  code: EnumResponseCode
}

defineOptions({ name: 'Error' })
defineProps<Props>()

const lang = useLang()
</script>

<template>
  <span v-if="code === EnumResponseCode.ERROR">{{ lang('Oops! API interface exception! Please try again!') }}</span>
  <span v-if="code === EnumResponseCode.ABORT_ERROR">{{ lang('Oops! API request timed out! Please try again!') }}</span>
</template>
