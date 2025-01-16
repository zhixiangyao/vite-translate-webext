<script lang="ts" setup>
import type { useView } from '../composables/useView'
import { Tag, theme } from 'ant-design-vue'
import { views } from '~/options/router'

defineOptions({ name: 'LayoutViewTab' })
defineProps<{ use: ReturnType<typeof useView> }>()

interface ViewsMap {
  [name: string]: (typeof views)[0] | undefined
}

const { token } = theme.useToken()
const viewsMap = views.reduce<ViewsMap>((acc, cur) => {
  acc[cur.name] = cur
  return acc
}, {})
</script>

<template>
  <div class="view-tab" :style="{ backgroundColor: token.colorBgContainer }">
    <Tag
      v-for="item in use.list.value"
      :key="item.path"
      class="cursor-pointer select-none"
      :color="item.name === use.activity.value?.name ? token.colorPrimary : void 0"
      :closable="use.list.value.length !== 1"
      :bordered="false"
      @close="() => use.handleClose(item)"
      @click="() => use.handleTo(item)"
    >
      <template #icon>
        <component :is="viewsMap[item.name]?.icon" />
      </template>

      {{ viewsMap[item.name]?.title }}
    </Tag>
  </div>
</template>

<style scoped>
.view-tab {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3;
  @apply flex items-center p-1 text-xs overflow-hidden;
}
</style>
