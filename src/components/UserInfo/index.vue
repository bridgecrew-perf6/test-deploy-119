<template>
  <div>
    <div class="header">臻络互联网医院</div>
    <div class="flex tip-header-box">
      <div class="flex tip-header">
        <div>电子处方笺</div>
        <div>普通处方</div>
      </div>
      <div v-if="userInfoData.lastTransNo" class="show-old">查看原始处方</div>
    </div>
    <div class="flex splits number">
      <div>{{ userInfoData.transNo }}</div>
      <div>开具时间：{{ userInfoData.recipeTime }}</div>
    </div>
    <div class="split info">
      <div class="flex">
        <div>
          <span>姓名:</span>
          <span>{{ userInfoData.patientName }}</span>
        </div>
        <div>
          <span>性别:</span>
          <span>{{ sexStatus[userInfoData.patientSex] }}</span>
        </div>
        <div>
          <span>年龄:</span>
          <span>{{ userInfoData.patientAge }}</span>
        </div>
        <div>
          <span>体重:</span>
          <span>{{ userInfoData.f }}kg</span>
        </div>
      </div>
      <div class="flex">
        <div>
          <span>费用:</span>
          <span>{{ userInfoData.g }}</span>
        </div>
        <div>
          <span>科别:</span>
          <span>{{ userInfoData.h }}</span>
        </div>
      </div>
      <div class="flex">
        <div>
          <span>临床诊断:</span>
          <span>{{ userInfoData.i }}</span>
        </div>
      </div>
    </div>
    <img :src="rpImgUrl" class="rp">
  </div>
</template>
<script>
export default {
  components: {},
  // props: ['isShowOld', 'userInfoData', 'sexStatus'],
  props: { isShowOld: Boolean, userInfoData: Object, sexStatus: Object },
  data() {
    return {
      rpImgUrl: require('../../assets/prescription/rp.svg')
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";

.flex {
  display: flex;
}

.splits {
  border-top: 3px solid $tipColor;
}
.split {
  border-top: 1px solid $tipColor;
}
.header {
  text-align: center;
  line-height: 40px;
  font-weight: 700;
  color: $msgboxHeaderColor;
  font-size: 28px;
  padding: 21px 0 4px 0;
}
.tip-header-box {
  position: relative;
  .tip-header {
    width: 200px;
    margin: 0 auto;
    justify-content: center;
    padding-bottom: 26px;
    > div {
      width: 85px;
      height: 28px;
      line-height: 28px;
      border-radius: 4px;
      font-size: 14px;
      text-align: center;
    }
    > div:first-child {
      background-color: #eaf3f8;
      color: #457b9e;
    }
    > div:last-child {
      background-color: #f0f0f0;
      color: #848484;
      margin-left: 5px;
    }
  }
  .show-old {
    width: 91px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #ee6c4d;
    border-radius: 4px;
    color: #ee6c4d;
    text-align: center;
    position: absolute;
    right: 0;
    cursor: pointer;
  }
}
.number {
  justify-content: space-between;
  line-height: 34px;
  height: 34px;
  > div:first-child {
    color: #2c2c2c;
  }
  > div:last-child {
    color: #909399;
    font-size: 12px;
  }
}
.info {
  padding-top: 4px;
  > div {
    margin-top: 14px;
    > div {
      line-height: 18px;
      margin-right: 40px;
      color: #2c2c2c;
      :last-child {
        font-weight: 700;
        margin-left: 10px;
      }
    }
  }
}
.rp {
  width: 17px;
  height: 17px;
  margin: 5px 0 4px;
}
</style>
