import request from '@/utils/request'

// 获取医生列表
export function getList(query) {
  return request({
    url: '/doctor/web/list',
    method: 'get',
    params: query
  })
}
// 查看认证详情
export function getAuthDetail(query) {
  return request({
    url: '/doctor/web/verify-info',
    method: 'get',
    params: query
  })
}
// 医生列表备注
export function doctorRemark(data, method) {
  return request({
    url: '/doctor/web/remark',
    method,
    params: method === 'get' ? data : {},
    data: ['post', 'put'].includes(method) ? data : {}
  })
}
// 医生列表备注
export function doctorVerify(data, method, urlParam) {
  console.log(urlParam)
  return request({
    url: '/doctor-verify' + (urlParam ? '/' + urlParam : ''),
    method,
    params: method === 'get' ? data : {},
    data: ['post', 'put'].includes(method) ? data : {}
  })
}

// 人工初审接口
export function trialVerify(data) {
  return request({
    url: '/doctor/web/trial-verify',
    method: 'put',
    params: {},
    data
  })
}
// 四川监管平台审核
export function multiVerify(data) {
  return request({
    url: '/doctor/web/multi-verify',
    method: 'put',
    params: {},
    data
  })
}
// CA审核
export function caVerify(data) {
  return request({
    url: '/doctor/web/ca-verify',
    method: 'put',
    params: {},
    data
  })
}
// 查询认证记录列表
export function verifyRecordList(params, method = 'get') {
  const { doctorId } = params
  return request({
    url: `/doctor/web/${doctorId}/verify-record`,
    method,
    params
  })
}

// 药品上下架
export function getOnline(data) {
  return request({
    url: '/medicineInfo/web/online',
    method: 'put',
    data: data
  })
}
