<script lang="ts" setup>
import type { useView } from '../composables/useView'
import { Tag, theme } from 'ant-design-vue'

defineOptions({ name: 'LayoutViewTab' })
defineProps<{ use: ReturnType<typeof useView> }>()

const { token } = theme.useToken()
</script>

<template>
  <div class="view-tab" :style="{ backgroundColor: token.colorBgContainer }">
    <Tag
      v-for="item in use.list.value"
      :key="item.path"
      class="cursor-pointer"
      :color="item.name === use.activity.value?.name ? token.colorPrimary : void 0"
      :closable="use.list.value.length !== 0"
      @close="() => use.handleClose(item)"
      @click="() => use.handleTo(item)"
    >
      {{ item.title }}
    </Tag>
  </div>
</template>

<style scoped>
.view-tab {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3;
  @apply flex items-center p-1 text-xs overflow-hidden;
}
</style>
