<template>
  <div class="splits review-comments-box">
    <div class="review-comments-header">
      <span>药师审核意见</span>
      <span :class="'comments' + userInfoData.status">{{
        prescriptionStatus[userInfoData.status]
      }}</span>
    </div>
    <div class="comments-text">{{ userInfoData.refuseReason || "无" }}</div>
    <div class="flex autograph-box">
      <div class="flex autograph">
        <div>
          <span>处方医师:</span><span>{{
            (userInfoData.doctor && userInfoData.doctor.doctorName) || "-"
          }}</span>
        </div>
        <div>
          <span>审核药师:</span><span>{{
            (userInfoData.pharmacist && userInfoData.pharmacist.doctorName) ||
              "-"
          }}</span>
        </div>
        <div>
          <span>发药药师:</span><span>{{
            (userInfoData.pharmacist && userInfoData.pharmacist.publishName) ||
              "-"
          }}</span>
        </div>
      </div>
      <div class="drug-amount"><span>药品金额:</span><span>90.00</span></div>
    </div>
    <img class="fail-icon" :src="failImgUrl">
  </div>
</template>
<script>
export default {
  components: {},
  // props: ['prescriptionStatus', 'userInfoData'],
  props: { prescriptionStatus: Object, userInfoData: Object },
  data() {
    return {
      failImgUrl: require('../../assets/prescription/fail.svg')
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";

.review-comments-box {
  position: relative;
  .review-comments-header {
    padding: 9px 0 10px;
    line-height: 21px;
    font-size: 15px;
    font-weight: 700;
    color: #ee6c4d;
    > span:last-child {
      display: inline-block;
      line-height: 29px;
      padding: 0 9px;
      margin-left: 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 14px;
    }
    .comments1,
    .comments9 {
      background-color: #fdf6ec;
      color: #e6a23c;
    }
    .comments2 {
      background-color: #f0f9ea;
      color: #67c23a;
    }
    .comments3 {
      background-color: #ffe4dd;
      color: #ee6c4d;
    }
  }
  .comments-text {
    padding: 11px 0 0 21px;
    height: 39px;
    background-color: #f3f6f8;
    border-radius: 4px;
    margin-bottom: 13px;
    color: #99a8bc;
  }
  .autograph-box {
    justify-content: space-between;
    color: #909399;
    line-height: 18px;
    .autograph {
      padding-bottom: 10px;
      > div {
        margin-right: 4px;
        > span:first-child {
          margin-right: 10px;
        }
      }
    }
    .drug-amount {
      display: flex;
      > span:last-child {
        display: block;
        height: 31px;
        font-weight: 700;
        color: #2c2c2c;
        font-size: 30px;
        margin-top: -4px;
      }
    }
  }
  .fail-icon {
    position: absolute;
    bottom: 5px;
    right: 0;
  }
}
</style>
