# Vite Translate WebExt

> 源自 [vitesse-webext](https://github.com/antfu/vitesse-webext)

一个由 [Vite](https://vitejs.dev/) 驱动的 WebExtension ([Chrome](https://developer.chrome.com/docs/extensions/reference/), [FireFox](https://addons.mozilla.org/en-US/developers/), 等等).

<p align="center">
  <sub>Popup</sub>
  <br/>
  <br/>
  <img width="1024" alt="Popup" src="https://raw.githubusercontent.com/zhixiangyao/CDN/refs/heads/master/images/screenshot/vite-translate-webext-popup.png">
  <br/>
  <sub>Options Page</sub>
  <br/>
  <br/>
  <img width="1024" alt="Options Page" src="https://raw.githubusercontent.com/zhixiangyao/CDN/refs/heads/master/images/screenshot/vite-translate-webext-options.png">
  <br/>
  <sub>Inject Vue App into the Content Script</sub>
  <br/>
  <br/>
  <img width="1024" alt="Content Script" src="https://raw.githubusercontent.com/zhixiangyao/CDN/refs/heads/master/images/screenshot/vite-translate-webext-contentScript.png">
</p>

## 功能

- ⚡️ **即时 HMR** - 在开发时使用 **Vite** (无需刷新!)
- 🥝 Vue 3 - Composition API, [`<script setup>` 语法](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md) 等等!
- 💬 无缝通信 - 由 [`webext-bridge`](https://github.com/antfu/webext-bridge) 和 [VueUse](https://github.com/antfu/vueuse) 存储提供支持
- 🌈 [UnoCSS](https://github.com/unocss/unocss) - 即时按需原子 CSS 引擎.
- 🦾 [TypeScript](https://www.typescriptlang.org/) - 类型安全
- 📦 [组件自动导入](./src/components)
- 🖥 内容脚本 - 即使在内容脚本中也可以使用 Vue
- 🌍 WebExtension - 适用于 Chrome, Firefox 等的同构扩展
- 📃 动态 `manifest.json` 并支持完整类型

## 预打包

### WebExtension 库

- [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) - WebExtension 浏览器 API Polyfill 并支持类型
- [`webext-bridge`](https://github.com/antfu/webext-bridge) - 无缝上下文通信

### Vite 插件

- [`unplugin-auto-import`](https://github.com/antfu/unplugin-auto-import) - 直接使用 `browser` 和 Vue Composition API 无需导入
- [`unplugin-vue-components`](https://github.com/antfu/vite-plugin-components) - 组件自动导入

### Vue 插件

- [VueUse](https://github.com/antfu/vueuse) - 有用的 Composition API 集合

### UI 框架

- [UnoCSS](https://github.com/unocss/unocss) - 即时按需原子 CSS 引擎

### 编码风格

- 使用 Composition API 与 [`<script setup>` SFC 语法](https://github.com/vuejs/rfcs/pull/227)
- [ESLint](https://eslint.org/) 配合 [@antfu/eslint-config](https://github.com/antfu/eslint-config), 单引号, 不使用分号

### 开发工具

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.js.org/) - 快速, 磁盘空间高效的包管理器
- [esno](https://github.com/antfu/esno) - 由 esbuild 提供支持的 TypeScript / ESNext node 运行时
- [npm-run-all](https://github.com/mysticatea/npm-run-all) - 并行或顺序运行多个 npm 脚本
- [web-ext](https://github.com/mozilla/web-ext) - 简化的 Web 扩展开发体验

## 使用模板

### 克隆到本地

> 如果你没有安装 pnpm, 请运行: npm install -g pnpm

```bash
git clone https://github.com/zhixiangyao/vite-translate-webext.git
cd vite-translate-webext
pnpm i
```

## 使用

### 文件夹

- `extension` - 插件包根目录.
  - `assets` - 静态资源 (主要用于 `manifest.json`).
  - `dist` - 构建文件.
- `scripts` - 开发和打包辅助脚本.
- `src` - 主要源代码.
  - `apps`
    - `content` - 作为 `content_script` 注入的脚本和组件.
    - `popup`
    - `options`
  - `background` - 背景脚本.
  - `components` - 公共组件.
    - `ui`
  - `composables` - 公共组合函数.
  - `constant` - 公共常量.
  - `storage`
  - `tests`
  - `utils`
  - `env.ts`
  - `global.d.ts`
  - `manifest.ts` - 插件的 manifest 文件.

### 开发

```bash
pnpm dev
```

然后 **在浏览器中加载 `extension/` 文件夹的扩展**.

对于 Firefox 开发者, 你可以运行以下命令:

```bash
pnpm dev-firefox
```

`web-ext` 会在 `extension/` 文件更改时自动重新加载扩展.

> 虽然 Vite 在大多数情况下会自动处理 HMR, 但仍然推荐使用 [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) 进行更干净的硬刷新.

### 构建

要构建扩展, 请运行

```bash
pnpm build
```

然后打包 `extension` 下的文件, 你可以将 `extension.crx` 或 `extension.xpi` 上传到相应的扩展商店.
