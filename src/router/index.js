import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    // meta: { title: '您好', icon: 'table' },
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/matrix',
    component: Layout,
    redirect: '/matrix/file',
    name: '个人云空间',
    meta: { title: '个人云空间', icon: 'example' },
    children: [
      {
        path: 'file',
        name: '全部文件',
        component: () => import('@/views/matrix/disk/all'),
        // component: () => import('@/components/GlobalUploader/demo'),
        meta: { title: '全部文件', icon: 'table' }
      },
      {
        path: 'picture',
        name: '图片',
        component: () => import('@/views/matrix/disk/picture'),
        meta: { title: '图片', icon: 'table' }
      },
      {
        path: 'doc',
        name: '文档',
        component: () => import('@/views/matrix/disk/doc'),
        meta: { title: '文档', icon: 'table' }
      },
      {
        path: 'video',
        name: '视频',
        component: () => import('@/views/matrix/disk/video'),
        meta: { title: '视频', icon: 'table' }
      },
      {
        path: 'music',
        name: '音乐',
        component: () => import('@/views/matrix/disk/music'),
        meta: { title: '音乐', icon: 'table' }
      },
      {
        path: 'others',
        name: '其他',
        component: () => import('@/views/matrix/disk/others'),
        meta: { title: '其他', icon: 'table' }
      }
    ]
  },

  {
    path: '/share',
    component: Layout,
    redirect: '/share/my',
    name: 'share',
    meta: { title: '我的分享', icon: 'table' },
    children:
      [
        {
          path: 'my',
          name: '分享记录',
          component: () => import('@/views/matrix/share/my'),
          meta: { title: '分享记录', icon: 'table' }
        },
        {
          path: 'friend',
          name: '好友分享',
          component: () => import('@/views/matrix/share/friend'),
          meta: { title: '好友分享', icon: 'table' }
        }
      ]
  },

  {
    path: '/recyclebin',
    component: Layout,
    redirect: '/recyclebin/list',
    name: '/recyclebin',
    // meta: { title: '回收站', icon: 'table' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/matrix//recyclebin/list'),
        meta: { title: '回收站', icon: 'table' }
      }
    ]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'example' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
