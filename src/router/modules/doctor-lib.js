import Layout from '@/layout'
const doctorRouter = {
  path: '/doctor',
  component: Layout,
  name: '医生管理',
  redirect: '/doctor/doctor-list/index',
  meta: {
    title: '医生管理',
    icon: 'doctor'
    // roles: ['admin', 'editor'] // you can set roles in root nav
  },
  children: [
    {
      path: 'doctor-list/index',
      component: () => import('@/views/doctor-list/index'),
      name: 'DoctorList',
      meta: { title: '医生详情', icon: 'doctor_list', noCache: true }
    }
  ]
}
export default doctorRouter
