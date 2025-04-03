/// <reference types="vitest" />

import type { PluginOption, UserConfig } from 'vite'
import { dirname, relative } from 'node:path'
import packageJson from '#/package.json'
import Vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import fs from 'fs-extra'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { isDev, port, r } from './scripts/utils'

/** Perform file changes after the Vite build is complete */
function ChangeFiles(options?: { moves?: { from: string, to: string }[], deletes?: string[] }): PluginOption {
  return {
    name: 'change-files',
    apply: 'build',
    closeBundle: async () => {
      const moves = options?.moves ?? []
      const deletes = options?.deletes ?? []

      for (const move of moves) {
        const fromPath = r(move.from)
        const toPath = r(move.to)

        if (!fs.existsSync(fromPath)) {
          continue
        }

        await fs.ensureDir(dirname(toPath))
        await fs.move(fromPath, toPath, { overwrite: true })
      }

      for (const del of deletes) {
        const delPath = r(del)

        if (!fs.existsSync(delPath)) {
          continue
        }

        await fs.remove(delPath)
      }
    },
  }
}

export const sharedConfig: UserConfig = {
  root: r('src'),
  resolve: {
    alias: {
      '~/': `${r('src')}/`,
      '#/': `${r()}/`,
    },
  },
  define: {
    __DEV__: isDev,
    __NAME__: JSON.stringify(packageJson.name),
  },
  plugins: [
    Vue(),

    vueJsx({
      /**
       * options are passed on to @vue/babel-plugin-jsx
       * https://github.com/vuejs/jsx-next/blob/dev/packages/babel-plugin-jsx/README-zh_CN.md
       */
      optimize: true,
      enableObjectSlots: true,
    }),

    AutoImport({
      imports: ['vue', { 'webextension-polyfill': [['=', 'browser']] }],
      dts: r('src/auto-imports.d.ts'),
      resolvers: [],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dirs: [r('src/components/ui')],
      // generate `components.d.ts` for ts support with Volar
      dts: r('src/components.d.ts'),
      resolvers: [],
    }),

    // https://github.com/unocss/unocss
    UnoCSS(),

    // rewrite assets to use relative path
    {
      name: 'assets-rewrite',
      enforce: 'post',
      apply: 'build',
      transformIndexHtml(html, { path }) {
        return html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
      },
    },
  ],
}

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  plugins: [
    ...(sharedConfig.plugins ?? []),
    ChangeFiles({
      moves: [
        {
          from: 'extension/dist/apps/options',
          to: 'extension/dist/options',
        },
        {
          from: 'extension/dist/apps/popup',
          to: 'extension/dist/popup',
        },
      ],
      deletes: ['extension/dist/apps'],
    }),
  ],
  base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
  server: {
    port,
    hmr: {
      host: 'localhost',
    },
    origin: `http://localhost:${port}`,
  },
  build: {
    watch: isDev ? {} : undefined,
    outDir: r('extension/dist'),
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        options: r('src/apps/options/index.html'),
        popup: r('src/apps/popup/index.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
}))
