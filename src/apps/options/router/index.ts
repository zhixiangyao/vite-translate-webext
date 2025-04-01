import type { RouteRecordRaw } from 'vue-router'
import { EyeOutlined, FileWordOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
import { createRouter, createWebHashHistory } from 'vue-router'

export const views = [
  {
    path: 'word-list',
    name: 'WordList',
    title: 'Word List',
    icon: () => h(FileWordOutlined),
    component: () => import('~/apps/options/views/WordList/index.vue'),
  },
  {
    path: 'book-list',
    name: 'BookList',
    title: 'Book List',
    icon: () => h(FileWordOutlined),
    component: () => import('~/apps/options/views/BookList/index.vue'),
  },
  {
    path: 'website-list',
    name: 'WebsiteList',
    title: 'Website List',
    icon: () => h(UnorderedListOutlined),
    component: () => import('~/apps/options/views/WebsiteList/index.vue'),
  },
  {
    path: 'preview',
    name: 'Preview',
    title: 'Preview',
    icon: () => h(EyeOutlined),
    component: () => import('~/apps/options/views/Preview/index'),
  },
  {
    path: 'settings',
    name: 'Settings',
    title: 'Settings',
    icon: () => h(SettingOutlined),
    component: () => import('~/apps/options/views/Settings/index.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('~/apps/options/layout/index.vue'),
      redirect: () => ({ name: 'BookList' }),
      children: views.map<RouteRecordRaw>(view => ({
        path: view.path,
        name: view.name,
        component: view.component,
      })),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('~/apps/options/views/NotFound.vue'),
    },
  ],
})

export default router
