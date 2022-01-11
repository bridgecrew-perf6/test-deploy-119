import request from '@/utils/request'

// 处方列表
export function getPrescriptionList(query) {
  return request({
    url: '/prescription/web/list',
    method: 'get',
    params: query
  })
}

// 处方详情
export function getPrescriptionDetail(query) {
  return request({
    url: '/prescription/web/detail',
    method: 'get',
    params: query
  })
}

// 锁定处方
export function getPrescriptionLock(query) {
  return request({
    url: '/prescription/web/lock',
    method: 'post',
    data: query
  })
}

// 风险预警
export function getPrescriptionRisk(query) {
  return request({
    url: '/prescription/web/risk',
    method: 'get',
    params: query
  })
}

// 计算超量
export function getDrugSpecs(query) {
  return request({
    url: '/prescription/web/drugSpecs',
    method: 'put',
    data: query
  })
}

// 处方审核
export function getVerify(query) {
  return request({
    url: '/prescription/web/verify',
    method: 'post',
    data: query
  })
}

// 处方评价
export function getEvaluate(query) {
  return request({
    url: '/prescription/web/evaluate',
    method: 'post',
    data: query
  })
}

// 当前处方释放
export function getUnlockedOne(query) {
  return request({
    url: '/prescription/web/unlockedOne',
    method: 'post',
    data: query
  })
}

// 获取未审核完成处方
export function getRemind(query) {
  return request({
    url: '/prescription/web/remind',
    method: 'get',
    params: query
  })
}

// 关键字模糊搜索
export function getSearchKeyWord(query) {
  return request({
    url: '/prescription/web/searchKeyWord',
    method: 'get',
    params: query
  })
}

// 问诊编号模糊搜索
export function getSearchOrderNumber(query) {
  return request({
    url: '/prescription/web/searchOrderNumber',
    method: 'get',
    params: query
  })
}
