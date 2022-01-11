import Layout from '@/layout'
const prescriptionRouter = {
  path: '/prescription',
  component: Layout,
  name: '处方管理',
  redirect: '/prescription/prescription-list/index',
  meta: {
    title: '处方管理',
    icon: 'prescription'
    // roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'prescription-list/index',
      component: () => import('@/views/prescription-list/index'),
      name: 'PrescriptionList',
      meta: { title: '处方列表', icon: 'prescriptionList', noCache: true }
    },
    {
      path: 'reviewer/index',
      component: () => import('@/views/reviewer/index'),
      name: 'Reviewer',
      meta: { title: '开始审方', icon: 'reviewer', noCache: true }
    }
  ]
}
export default prescriptionRouter
