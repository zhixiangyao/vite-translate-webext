import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  preflights: [
    {
      getCSS: () => `
        .ant-btn-primary {
          background-color: #1677ff;
        }
      `,
    },
  ],
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives()],
})
