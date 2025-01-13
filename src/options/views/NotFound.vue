<script lang="ts" setup>
import { Button } from 'ant-design-vue'

defineOptions({ name: 'NotFound' })
</script>

<template>
  <div class="flex justify-center items-center flex-col gap-5 pt-20 text-4xl">
    <span>404</span>
    <Button>
      <RouterLink :to="{ name: 'Home' }">
        返回首页
      </RouterLink>
    </Button>
  </div>
</template>
