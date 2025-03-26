<script lang="ts" setup>
import type { useView } from '../composables/useView'
import { Tag, theme } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import { views } from '~/options/router'
import { useContextMenu } from '../composables/useContextMenu'
import LayoutViewTabContextMenu from './LayoutViewTabContextMenu.vue'

interface Props {
  use: ReturnType<typeof useView>
}

defineOptions({ name: 'LayoutViewTab' })
const props = defineProps<Props>()

const viewsMap = Object.fromEntries(views.map(({ name, title, icon }) => [name, { title, icon }]))
const { list } = props.use
const { token } = theme.useToken()
const { state, itemsRef, handleContextMenu } = useContextMenu()
</script>

<template>
  <ul :style="{ backgroundColor: token.colorBgContainer }">
    <VueDraggable v-model="list" :animation="150" class="flex gap-2">
      <li
        v-for="(item, index) in list"
        :key="item.path"
        ref="itemsRef"
        @contextmenu="handleContextMenu($event, item, index)"
      >
        <Tag
          class="cursor-pointer select-none m-0 flex"
          :color="item.name === use.activity.value?.name ? token.colorPrimary : void 0"
          :closable="list.length !== 1"
          :bordered="false"
          @close="() => use.handleClose(item)"
          @click="() => use.handleTo(item)"
        >
          <template #icon>
            <component :is="viewsMap[item.name]?.icon" />
          </template>

          <div :class="list.length !== 1 ? 'w-[63px]' : 'w-[80px]'">
            {{ viewsMap[item.name]?.title ?? '-' }}
          </div>
        </Tag>
      </li>
    </VueDraggable>
  </ul>

  <LayoutViewTabContextMenu
    v-model:open="state.open"
    :x="state.x"
    :y="state.y"
    @close="() => use.handleClose(state.view)"
    @close-other="() => use.handleCloseOther(state.view)"
  />
</template>

<style scoped>
ul {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3;
  @apply flex items-center p-1 text-xs overflow-hidden;
}
</style>
