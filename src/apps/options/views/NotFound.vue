<script lang="ts" setup>
import { Button } from 'ant-design-vue'
import { useLang } from '~/composables/useLang'

defineOptions({ name: 'NotFound' })

const lang = useLang()
</script>

<template>
  <div class="flex justify-center items-center flex-col gap-5 pt-20 text-4xl">
    <span>404</span>
    <Button>
      <RouterLink :to="{ name: 'Home' }">
        {{ lang('Back Home') }}
      </RouterLink>
    </Button>
  </div>
</template>
