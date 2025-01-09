<script setup lang="ts">
defineOptions({ name: 'HeaderBottom' })

const collapsed = defineModel<boolean>('collapsed', { default: false })
</script>

<template>
  <div class="header-bottom" @click="collapsed = !collapsed">
    {{ collapsed ? 'Collapsed' : 'Collapse' }}
  </div>
</template>

<style scoped>
.header-bottom {
  @apply flex justify-center items-center;
  @apply mt-auto px-1 h-10 cursor-pointer select-none;
  @apply border-t-4 border-t-solid;
}

html .header-bottom {
  border-top-color: var(--light-bg-color);
}

html.dark .header-bottom {
  border-top-color: var(--dark-bg-color);
}
</style>
