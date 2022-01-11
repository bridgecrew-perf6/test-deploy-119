import request from '@/utils/request'

// 药品列表/药品价格列表
export function getList(query) {
  return request({
    url: '/medicineBaseInfo/web/list',
    method: 'get',
    params: query
  })
}

// 药品分类列表
export function getCategory(query) {
  return request({
    url: '/category/web/category',
    method: 'get',
    params: query
  })
}
// 药品详情
export function getDetail(query) {
  return request({
    url: '/medicineBaseInfo/web/detail',
    method: 'get',
    params: query
  })
}

// 关键字模糊搜索
export function getSearchKeyWord(query) {
  return request({
    url: '/medicineBaseInfo/web/searchKeyWord',
    method: 'get',
    params: query
  })
}

// 药品上下架
export function getOnline(query) {
  return request({
    url: '/medicineInfo/web/online',
    method: 'put',
    data: query
  })
}
