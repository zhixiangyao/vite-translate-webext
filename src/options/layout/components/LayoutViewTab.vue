<script lang="ts" setup>
import type { TView, useView } from '../composables/useView'
import { Tag, theme } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import { views } from '~/options/router'
import LayoutViewTabContextMenu from './LayoutViewTabContextMenu.vue'

interface Props {
  use: ReturnType<typeof useView>
}

defineOptions({ name: 'LayoutViewTab' })
const props = defineProps<Props>()

const viewsMap = Object.fromEntries(views.map(({ name, title, icon }) => [name, { title, icon }]))
const list = toRef(props.use, 'list')
const { token } = theme.useToken()
const contextState = reactive({ open: false, view: null as TView | null, x: 0, y: 0 })
const itemRefs = useTemplateRef<HTMLLIElement[]>('items')

function handleContextMenu(event: MouseEvent, view: TView, index: number) {
  event.preventDefault()
  event.stopPropagation()
  const elementLi = itemRefs.value?.[index]
  if (elementLi) {
    const elementLiRect = elementLi.getClientRects()[0]
    contextState.open = true
    contextState.view = view
    contextState.x = elementLiRect.left
    contextState.y = elementLiRect.top + elementLiRect.height + 4
  }
}
</script>

<template>
  <ul :style="{ backgroundColor: token.colorBgContainer }">
    <VueDraggable v-model="list" :animation="150" class="flex gap-2">
      <li
        v-for="(item, index) in list"
        :key="item.path"
        ref="items"
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

          <div :class="list.length !== 1 ? 'w-[56px]' : 'w-[73px]'">
            {{ viewsMap[item.name]?.title ?? '-' }}
          </div>
        </Tag>
      </li>
    </VueDraggable>
  </ul>

  <LayoutViewTabContextMenu
    v-model:open="contextState.open"
    :x="contextState.x"
    :y="contextState.y"
    :use="use"
    :view="contextState.view"
  />
</template>

<style scoped>
ul {
  @apply grid-col-start-2 grid-col-end-3 grid-row-start-2 grid-row-end-3;
  @apply flex items-center p-1 text-xs overflow-hidden;
}
</style>
