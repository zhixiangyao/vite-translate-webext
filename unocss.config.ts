import presetRemToPx from '@unocss/preset-rem-to-px'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'
import { defineConfig } from 'unocss/vite'

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
        .ant-switch {
          background: rgba(0, 0, 0, 0.25);
        }
        .ant-btn-primary {
          background-color: #1677ff;
        }
      `,
    },
  ],
  presets: [presetRemToPx(), presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()],
})
