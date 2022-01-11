import Layout from '@/layout'
const drugRouter = {
  // path: '/drug',
  // component: Layout,
  // redirect: '/drug/index',
  // children: [
  //   {
  //     path: 'index',
  //     component: () => import('@/views/drug/index'),
  //     name: 'Drug',
  //     meta: { title: '药品库', icon: 'guide', noCache: true }
  //   }
  // ]
  path: '/drug',
  component: Layout,
  name: '药品管理',
  redirect: '/drug/drug-list/index',
  meta: {
    title: '药品管理',
    icon: 'drug'
    // roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'drug-list/index',
      component: () => import('@/views/drug-list/index'),
      name: 'DrugList',
      meta: { title: '药品列表', icon: 'drugList', noCache: true, but: '导入' }
    }, {
      path: 'drug-price/index',
      component: () => import('@/views/drug-price/index'),
      name: 'DrugPrice',
      meta: { title: '药品价格', icon: 'drugPrice', noCache: true }
    }
  ]
}
export default drugRouter
