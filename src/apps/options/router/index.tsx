import type { RouteRecordRaw } from 'vue-router'
import {
  EyeOutlined,
  FileWordOutlined,
  GroupOutlined,
  SettingOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'
import { createRouter, createWebHashHistory } from 'vue-router'

export const views = [
  {
    path: 'word-list',
    name: 'WordList',
    title: 'Word List',
    icon: () => <FileWordOutlined />,
    component: () => import('~/apps/options/views/WordList/index.vue'),
  },
  {
    path: 'group-list',
    name: 'GroupList',
    title: 'Group List',
    icon: () => <GroupOutlined />,
    component: () => import('~/apps/options/views/GroupList/index.vue'),
  },
  {
    path: 'website-list',
    name: 'WebsiteList',
    title: 'Website List',
    icon: () => <UnorderedListOutlined />,
    component: () => import('~/apps/options/views/WebsiteList/index.vue'),
  },
  {
    path: 'preview',
    name: 'Preview',
    title: 'Preview',
    icon: () => <EyeOutlined />,
    component: () => import('~/apps/options/views/Preview/index'),
  },
  {
    path: 'settings',
    name: 'Settings',
    title: 'Settings',
    icon: () => <SettingOutlined />,
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
