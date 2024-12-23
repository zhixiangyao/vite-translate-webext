import { useDraggable, useElementSize, useWindowSize } from '@vueuse/core'

interface Params {
  x: Ref<number>
  y: Ref<number>
  open: Ref<boolean>
}

export function useModalTranslateDraggable(params: Params) {
  const { x, y, open } = params

  const refHeader = ref<HTMLElement | null>(null)
  const refContainer = ref<HTMLElement | null>(null)

  const { position, isDragging } = useDraggable(refHeader)
  const sizeWindow = useWindowSize()
  const sizeContainer = useElementSize(refContainer)
  const top = computed<number>(() => {
    const containerTop = position.value.y || y.value

    const maxHeight = sizeWindow.height.value - sizeContainer.height.value

    if (containerTop < 0)
      return 0

    if (containerTop <= maxHeight)
      return containerTop

    return maxHeight
  })
  const left = computed<number>(() => {
    const containerLeft = position.value.x || x.value

    const maxWidth = sizeWindow.width.value - sizeContainer.width.value

    if (containerLeft < 0)
      return 0

    if (containerLeft <= maxWidth)
      return containerLeft

    return maxWidth
  })

  watch(open, (open) => {
    if (open === false) {
      position.value.x = 0
      position.value.y = 0
    }
  })

  return {
    top,
    left,
    isDragging,
    refHeader,
    refContainer,
  }
}
