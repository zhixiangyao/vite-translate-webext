import type { RouteRecordRaw } from 'vue-router'
import { EyeOutlined, FileWordOutlined, GroupOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons-vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import i18n from '~/i18n'

export const views = [
  {
    path: 'word-list',
    name: 'WordList',
    title: i18n.global.t('Word List'),
    icon: () => h(FileWordOutlined),
    component: () => import('~/apps/options/views/WordList/index.vue'),
  },
  {
    path: 'group-list',
    name: 'GroupList',
    title: i18n.global.t('Group List'),
    icon: () => h(GroupOutlined),
    component: () => import('~/apps/options/views/GroupList/index.vue'),
  },
  {
    path: 'website-list',
    name: 'WebsiteList',
    title: i18n.global.t('Website List'),
    icon: () => h(UnorderedListOutlined),
    component: () => import('~/apps/options/views/WebsiteList/index.vue'),
  },
  {
    path: 'preview',
    name: 'Preview',
    title: i18n.global.t('Preview'),
    icon: () => h(EyeOutlined),
    component: () => import('~/apps/options/views/Preview/index'),
  },
  {
    path: 'settings',
    name: 'Settings',
    title: i18n.global.t('Settings'),
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
      redirect: () => ({ name: 'WordList' }),
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
