import presetRemToPx from '@unocss/preset-rem-to-px'
import { presetAttributify, presetWind3, transformerDirectives } from 'unocss'
import { defineConfig } from 'unocss/vite'

export default defineConfig({
  presets: [presetRemToPx(), presetWind3(), presetAttributify()],
  transformers: [transformerDirectives()],
  theme: {
    breakpoints: {
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
  },
})
