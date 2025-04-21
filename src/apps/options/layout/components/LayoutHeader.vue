<script lang="ts" setup>
import type { useView } from '../composables/useView'
import { Tag, theme } from 'ant-design-vue'
import { VueDraggable } from 'vue-draggable-plus'
import { views } from '~/apps/options/router'
import SwitchTheme from '~/components/SwitchTheme/index.vue'
import { useLang } from '~/composables/useLang'
import { useContextMenu } from '../composables/useContextMenu'
import LayoutViewTabContextMenu from './LayoutViewTabContextMenu.vue'

interface Props {
  use: ReturnType<typeof useView>
}

defineOptions({ name: 'LayoutHeader' })
const props = defineProps<Props>()

const { token } = theme.useToken()
const viewsMap = Object.fromEntries(views.map(({ name, title, icon }) => [name, { title, icon }]))
const { list } = props.use
const lang = useLang()
const { state, itemsRef, handleContextMenu } = useContextMenu()
</script>

<script lang="ts">
export const layoutHeaderRightSlotRef = ref<HTMLDivElement>()
</script>

<template>
  <header class="flex items-center justify-between font-500 p-1" :style="{ backgroundColor: token.colorBgContainer }">
    <ul class="flex items-center text-xs overflow-hidden" :style="{ backgroundColor: token.colorBgContainer }">
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

            <div class="min-w-[80px]">
              {{ viewsMap[item.name]?.title ? lang(viewsMap[item.name]?.title) : '-' }}
            </div>
          </Tag>
        </li>
      </VueDraggable>
    </ul>

    <div class="flex gap-2 items-center">
      <div ref="layoutHeaderRightSlotRef" class="flex gap-2 items-center" />

      <SwitchTheme />
    </div>
  </header>

  <LayoutViewTabContextMenu
    v-model:open="state.open"
    :x="state.x"
    :y="state.y"
    @close="() => use.handleClose(state.view)"
    @close-other="() => use.handleCloseOther(state.view)"
  />
</template>
