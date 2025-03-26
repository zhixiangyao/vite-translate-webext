import { useDraggable, useElementBounding, useElementSize, useWindowSize } from '@vueuse/core'

interface ParamsDraggable {
  containerTop: ComputedRef<number>
  containerLeft: ComputedRef<number>
  sizeContainer: ReturnType<typeof useElementSize>
  distance: number
}

function useWindowDraggable(params: ParamsDraggable) {
  const sizeWindow = useWindowSize()
  const top = computed<number>(() => {
    const maxHeight = sizeWindow.height.value - params.sizeContainer.height.value - params.distance

    if (params.containerTop.value < 0)
      return 0 + params.distance

    if (params.containerTop.value <= maxHeight)
      return params.containerTop.value

    return maxHeight
  })
  const left = computed<number>(() => {
    const maxWidth = sizeWindow.width.value - params.sizeContainer.width.value - params.distance

    if (params.containerLeft.value < 0)
      return 0 + params.distance

    if (params.containerLeft.value <= maxWidth)
      return params.containerLeft.value

    return maxWidth
  })

  return { top, left }
}

function useRootDraggable(params: ParamsDraggable & { root: HTMLElement }) {
  const sizeRoot = useElementBounding(params.root)
  const top = computed<number>(() => {
    const maxHeight = sizeRoot.height.value + sizeRoot.top.value - params.sizeContainer.height.value - params.distance

    if (params.containerTop.value < sizeRoot.top.value)
      return sizeRoot.top.value + params.distance

    if (params.containerTop.value <= maxHeight)
      return params.containerTop.value

    return maxHeight
  })
  const left = computed<number>(() => {
    const maxWidth = sizeRoot.width.value + sizeRoot.left.value - params.sizeContainer.width.value - params.distance

    if (params.containerLeft.value < sizeRoot.left.value)
      return sizeRoot.left.value + params.distance

    if (params.containerLeft.value <= maxWidth)
      return params.containerLeft.value

    return maxWidth
  })

  return { top, left }
}

interface Params {
  x: ComputedRef<number>
  y: ComputedRef<number>
  open: ComputedRef<boolean>
  root?: HTMLElement
}

export function useModalTranslateDraggable(params: Params) {
  const { x, y, open, root } = params

  const refHeader = ref<HTMLElement | null>(null)
  const refContainer = ref<HTMLElement | null>(null)
  const sizeContainer = useElementSize(refContainer)
  const { position, isDragging } = useDraggable(refHeader)
  const containerTop = computed(() => position.value.y || y.value)
  const containerLeft = computed(() => position.value.x || x.value)
  const basicParams = {
    containerTop,
    containerLeft,
    sizeContainer,
  }
  const { top, left } = root
    ? useRootDraggable({ ...basicParams, distance: 1, root })
    : useWindowDraggable({ ...basicParams, distance: 0 })

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
