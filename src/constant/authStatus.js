// 认证类型
const auditType = {
  1: { code: 'trialVerify', name: '人工初审' },
  2: { code: 'multiSitedVerify', name: '四川监管认证' },
  3: { code: 'identityVerify', name: '实名认证' },
  4: { code: 'caVerify', name: 'CA认证' }
}

// ca认证状态(1: 拒绝，2：通过，3：审核中，4:资料未提交)
const caVerify = {
  name: 'CA认证',
  1: '认证失败',
  2: '认证通过',
  3: '认证中',
  4: '未认证'
}
// 实名认证状态(1: 拒绝，2：通过，3：审核中，4:资料未提交)
const identityVerify = {
  name: '实名认证',
  1: '认证失败',
  2: '认证通过',
  3: '认证中',
  4: '未认证'
}
// 多点执业状态(1: 拒绝 2: 审核通过 3: 审核中，4:资料未提交)
const multiSitedVerify = {
  name: '四川监管认证',
  1: '认证失败',
  2: '认证通过',
  3: '认证中',
  4: '未认证'
}
// 人工初审状态(1: 拒绝，2：通过，3：审核中，4:资料未提交)
const trialVerify = {
  name: '人工初审',
  1: '审核失败',
  2: '审核成功',
  3: '未审核'
}
export {
  auditType,
  caVerify, identityVerify, multiSitedVerify, trialVerify
}
