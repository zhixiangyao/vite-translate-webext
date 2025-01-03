<script setup lang="ts">
import { useDark } from '@vueuse/core'
import { theme } from 'ant-design-vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { onMounted, onUnmounted, ref, toRaw, watch } from 'vue'
import 'monaco-editor/esm/vs/basic-languages/css/css.contribution'

interface Props {
  language: 'css'
}

defineOptions({ name: 'CodeEditor' })
const props = defineProps<Props>()
const code = defineModel<string>('code', { default: '' })

const { token } = theme.useToken()
const { language } = toRefs(props)
const refContainer = ref<HTMLElement | null>(null)
const editor = ref<monaco.editor.IStandaloneCodeEditor>()
const isDark = useDark()

function init() {
  if (!refContainer.value)
    return

  editor.value = monaco.editor.create(refContainer.value, {
    automaticLayout: true,
    contextmenu: false,
    lineNumbers: 'on', // 启用行号
    lineNumbersMinChars: 1, // 设置行号区域最小宽度为 1 个字符
    lineDecorationsWidth: 0,
    overviewRulerBorder: false,
    minimap: { enabled: false },
    tabSize: 2,
    theme: isDark.value ? 'vs-dark' : 'vs-light',
  })

  editor.value.onDidChangeModelContent(() => {
    const model = toRaw(editor.value)?.getModel()
    code.value = model?.getValue() ?? ''
  })
}

function updateEditorLang() {
  const model = toRaw(editor.value)?.getModel()

  if (model) {
    monaco.editor.setModelLanguage(model, language.value)
  }
}

function updateEditorValue() {
  const model = toRaw(editor.value)?.getModel()

  if (model) {
    const oldValue = model.getValue()

    if (code.value !== oldValue) {
      model?.setValue(code.value)
    }
  }
}

function updateEditorTheme() {
  const model = toRaw(editor.value)?.getModel()

  if (model) {
    monaco.editor.setTheme(isDark.value ? 'vs-dark' : 'vs-light')
  }
}

onMounted(() => init())
onUnmounted(() => toRaw(editor.value)?.dispose())

watch([editor, language], updateEditorLang, { immediate: true })
watch([editor, code], updateEditorValue, { immediate: true })
watch([isDark], updateEditorTheme)
</script>

<template>
  <div class="w-code-editor">
    <div ref="refContainer" class="min-h-[200px] w-full" />
  </div>
</template>

<style scoped>
.w-code-editor {
  @apply border border-solid p-1;
  border-color: v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');

  &:has(.monaco-editor .view-overlays.focused) {
    border-color: v-bind('token.colorPrimary');
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
    border-inline-end-width: 1px;
    outline: 0;
  }
}
</style>
