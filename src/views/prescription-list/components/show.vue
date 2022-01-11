<template>
  <div class="wrapper">
    <div class="show-msgbox">
      <el-dialog
        :visible.sync="isVisible"
        width="600px"
        title=""
        :close-on-click-modal="false"
      >
        <div class="msgbox">
          <UserInfo
            :is-show-old="true"
            :user-info-data="detailData"
            :sex-status="sexStatus"
          />
          <div
            v-if="detailData.drugs"
            class="drug-box"
            :class="detailData.drugs > 2 ? 'scroll-box' : ''"
          >
            <div>
              <div
                v-for="(item, index) in detailData.drugs"
                :key="index"
                :class="index > 0 ? 'split' : ''"
                class="drug"
              >
                <div>
                  <span>{{ item.title }}</span><span>{{ item.specification }}</span><span>x{{ item.quantity }}</span>
                </div>
                <div>
                  用法用量： (每次{{ item.dosage }}{{ item.dosagePerTimeUnit }}
                  <span v-if="item.cycle">，{{ item.cycle }}</span>
                  <span v-if="item.usages">， {{ item.usages }}</span>
                  )
                </div>
              </div>
            </div>
          </div>
          <div class="audit-physician">
            <span>审核医师:</span><span>{{
              detailData.pharmacist && detailData.pharmacist.doctorName
            }}</span>
          </div>
          <ReviewComments
            :prescription-status="prescriptionStatus"
            :user-info-data="detailData"
            @adoptReview="adopt"
            @failReview="fail"
          />
          <TipText />
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import UserInfo from '../../../components/UserInfo/index.vue'
import ReviewComments from '../../../components/ReviewComments/index.vue'
import TipText from '../../../components/TipText/index.vue'
export default {
  components: {
    UserInfo,
    ReviewComments,
    TipText
  },
  props: { prescriptionStatus: Object, sexStatus: Object },
  data() {
    return {
      isVisible: false,
      detailData: {}
    }
  },
  methods: {
    init(e) {
      console.log('这是详情组件', e)
      this.detailData = e
      this.isVisible = true
    },
    adopt(e) {
      console.log(11111, e)
      if (!this.commentsText) {
        this.$confirm('请输入不通过意见。', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {})
          .catch(() => {})
      }
    },
    fail(e) {
      console.log('同意---', e)
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
.show-msgbox {
  .el-dialog {
    height: 838px;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: 0 !important;
  }

  .el-dialog__body {
    padding: 0;
  }
  .el-dialog__header {
    padding: 5px 20px;
  }
  .el-dialog__headerbtn {
    top: 24px;
    right: 34px;
  }
}
.msgbox {
  background: #fff;
  padding: 0 30px;
  font-size: 13px;

  .drug-box {
    padding-right: 21px;
    padding-bottom: 2px;
    line-height: 21px;
    .drug {
      padding: 18px 0 11px;
      > div {
        font-weight: 700;
        color: $labelTextColor;
      }
      > div:first-child {
        margin-bottom: 7px;
        line-height: 21px;
        > span {
          margin-right: 16px;
        }
      }
      > div:last-child {
        color: $msgboxTextColor;
        line-height: 18px;
        height: 18px;
        font-weight: 500;
      }
    }
    .drug:first-child {
      padding-top: 0;
    }
  }
  .audit-physician {
    padding: 10px 0 8px;
    color: $msgboxTextColor;
    > span {
      display: inline-block;
      margin-right: 5px;
      line-height: 18px;
    }
  }
}

.scroll-box {
  height: 127px;
  overflow-y: scroll;
}
/*滚动条整体样式*/
.scroll-box::-webkit-scrollbar {
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
/*滚动条里面小方块*/
.scroll-box::-webkit-scrollbar-thumb {
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #73a5c3;
  border-radius: 100px;
}
/*滚动条里面轨道*/
.scroll-box::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 100px;
  background: #b1b1b1;
}
</style>
