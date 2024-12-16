import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  preflights: [],
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()],
})
