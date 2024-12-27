import type { RouteRecordRaw } from 'vue-router'
import { EyeOutlined, FileWordOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { createRouter, createWebHashHistory } from 'vue-router'

export const views = [
  {
    path: 'book-list',
    name: 'BookList',
    title: '单词本',
    icon: () => h(FileWordOutlined),
    component: () => import('~/options/views/BookList/index.vue'),
  },
  {
    path: 'preview',
    name: 'Preview',
    title: '预览',
    icon: () => h(EyeOutlined),
    component: () => import('~/options/views/Preview/index.vue'),
  },
  {
    path: 'settings',
    name: 'Settings',
    title: '设置',
    icon: () => h(SettingOutlined),
    component: () => import('~/options/views/Settings/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: () => import('~/options/layout/index.vue'),
      redirect: () => ({ name: 'BookList' }),
      children: views.map<RouteRecordRaw>(view => ({
        path: view.path,
        name: view.name,
        component: view.component,
      })),
    },
  ],
})

export default router
