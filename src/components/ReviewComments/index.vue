<template>
  <div class="splits review-comments-box">
    <div class="review-comments-header">
      <span>药师审核意见</span>
      <span :class="'comments' + userInfoData.status">{{
        prescriptionStatus[userInfoData.status]
      }}</span>
    </div>
    <div class="comments-box">
      <el-input
        v-model="commentsText"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="请输入审核意见..."
        maxlength="500"
        :disabled="prescriptionStatus[userInfoData.status] !== '正在审核'"
      />
      <div class="search-but">
        <el-tooltip
          v-if="isAudit"
          class="item"
          effect="dark"
          content="请先在药师审核意见处填写不合理原因！"
          placement="left"
        >
          <el-button
            :disabled="prescriptionStatus[userInfoData.status] !== '正在审核'"
            @click="adopt()"
          >不通过</el-button>
        </el-tooltip>
        <el-button
          v-if="!isAudit"
          :disabled="prescriptionStatus[userInfoData.status] !== '正在审核'"
          @click="adopt()"
        >不通过</el-button>
        <el-button
          type="primary"
          :disabled="prescriptionStatus[userInfoData.status] !== '正在审核'"
          @click="agree()"
        >通过</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  // props: ["prescriptionStatus", "isAudit", "userInfoData"],
  props: { prescriptionStatus: Object, isAudit: Boolean, userInfoData: Object },
  data() {
    return {
      commentsText: ''
    }
  },
  methods: {
    adopt() {
      this.$emit('adoptReview', this.commentsText)
    },
    agree() {
      this.$emit('failReview', this.commentsText)
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
.review-comments-box {
  .review-comments-header {
    line-height: 21px;
    font-size: 15px;
    font-weight: 700;
    color: #ee6c4d;
    padding: 9px 0 4px;
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
  .comments-box {
    color: #c0c4cc;
    .el-textarea__inner {
      height: 80px !important;
      padding: 11px 8px;
      font-size: 13px;
    }
    .search-but {
      text-align: right;
      padding: 25px 0 22px;
      .el-button {
        width: 80px;
        height: 32px;
        line-height: 32px;
        padding: 0;
        font-weight: 700;
        border-radius: 4px;
        border: none;
      }
      .el-button--default {
        background-color: #e2e8ed;
        color: #99a8bc;
        font-size: 13px;
      }
      .el-button--primary {
        background-color: $blueColor;
        color: #ffffff;
      }
    }
  }
}
</style>
