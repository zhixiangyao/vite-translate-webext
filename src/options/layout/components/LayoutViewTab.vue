<script lang="ts" setup>
import type { useView } from '../composables/useView'
import { Tag, theme } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import { views } from '~/options/router'

interface ViewsMap {
  [name: string]: (typeof views)[0] | undefined
}

defineOptions({ name: 'LayoutViewTab' })
const props = defineProps<{ use: ReturnType<typeof useView> }>()

const list = toRef(props.use, 'list')
const { token } = theme.useToken()
const viewsMap = views.reduce<ViewsMap>((acc, cur) => {
  acc[cur.name] = cur
  return acc
}, {})
</script>

<template>
  <div class="view-tab" :style="{ backgroundColor: token.colorBgContainer }">
    <VueDraggable v-model="list" :animation="150">
      <Tag
        v-for="item in list"
        :key="item.path"
        class="cursor-pointer select-none"
        :color="item.name === use.activity.value?.name ? token.colorPrimary : void 0"
        :closable="list.length !== 1"
        :bordered="false"
        @close="() => use.handleClose(item)"
        @click="() => use.handleTo(item)"
      >
        <template #icon>
          <component :is="viewsMap[item.name]?.icon" />
        </template>

        {{ viewsMap[item.name]?.title }}
      </Tag>
    </VueDraggable>
  </div>
</template>

<style scoped>
.view-tab {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3;
  @apply flex items-center p-1 text-xs overflow-hidden;
}
</style>
