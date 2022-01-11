<template>
  <div class="wrapper">
    <div id="evaluation-msgbox" class="show-msgbox">
      <el-dialog
        :visible.sync="isVisible"
        width="625px"
        title=""
        :hidden="false"
        @close="closeDialog"
      >
        <div class="evaluation-msgbox-box scroll-box">
          <div class="close-but" @click="closeDialog">
            <img :src="closeImgUrl">
          </div>
          <div class="msgbox evaluation-msgbox">
            <UserInfo
              :is-show-old="false"
              :user-info-data="detailData"
              :sex-status="sexStatus"
            />
            <div v-if="detailData.drugs" class="drug-box">
              <div>
                <div
                  v-for="(item, index) in detailData.drugs"
                  :key="index"
                  class="drug"
                >
                  <div>
                    <span>{{ item.title }}</span><span>{{ item.specification }}</span><span>x{{ item.quantity }}</span>
                  </div>
                  <div>
                    用法用量： (每次{{ item.dosage
                    }}{{ item.dosagePerTimeUnit }}
                    <span v-if="item.cycle">，{{ item.cycle }}</span>
                    <span v-if="item.usages">， {{ item.usages }}</span>
                    )
                  </div>
                </div>
              </div>
            </div>
            <ReviewFail
              :prescription-status="prescriptionStatus"
              :user-info-data="detailData"
            />
            <TipText />
          </div>
        </div>
        <div class="evaluation-box">
          <div class="evaluation-header">
            <span>评价处方</span><span
              v-if="isTip"
            >请认真评价处方，该处方只可评价一次保存后将无法修改评价内容哦！</span>
          </div>
          <el-input
            v-model="evaluationText"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入审核意见..."
            class="evaluation-text"
          />
          <div class="evaluation-but">
            <el-button type="primary" @click="save()">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import UserInfo from '../../../components/UserInfo/index.vue'
import ReviewFail from '../../../components/ReviewFail/index.vue'
import TipText from '../../../components/TipText/index.vue'
import { getEvaluate } from '@/api/prescription'

export default {
  components: {
    UserInfo,
    ReviewFail,
    TipText
  },
  props: { prescriptionStatus: Object, sexStatus: Object },
  data() {
    return {
      closeImgUrl: require('@/assets/prescription/close.svg'),
      isVisible: false,
      detailData: {},
      evaluationText: '',
      isTip: true
    }
  },
  methods: {
    init(e) {
      this.detailData = e
      this.isVisible = true
    },
    closeDialog() {
      this.isVisible = false
      if (this.evaluationText && this.isTip) {
        this.$confirm(
          '您还未保存已编辑的内容,是否确定退出？退出后内容将会清空。',
          '',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'prescription-confirm'
          }
        )
          .then(() => {
            this.evaluationText = ''
            this.isVisible = false
          })
          .catch(() => {
            this.isVisible = true
          })
      } else {
        this.isVisible = false
      }
    },
    save() {
      if (this.evaluationText) {
        getEvaluate({
          transNo: this.detailData.transNo,
          evaluateContent: this.evaluationText
        }).then((response) => {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.evaluationText = ''
          this.isVisible = false
          this.$emit('getTableList')
        })
      } else {
        this.$message.error('请输入评价内容！')
      }
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";

#evaluation-msgbox {
  .close-but {
    position: absolute;
    right: -58px;
    width: 36px;
    height: 35px;
    background-color: rgba(255, 255, 255, 0.29);
    border-radius: 8px;
    img {
      display: block;
      margin: 10px auto;
    }
  }
  .el-dialog {
    height: 881px;
    background: none;
    box-shadow: none;
  }
  .el-dialog__header {
    display: none;
    padding: 0;
  }
  .evaluation-msgbox-box {
    height: 684px;
    border-radius: 4px;
    padding-right: 22px;
    .evaluation-msgbox {
      height: 100%;
    }
  }
  .header {
    padding: 14px 0 4px 0;
  }
  .tip-header-box {
    .tip-header {
      padding-bottom: 15px;
    }
  }
  .rp {
    margin: 7px 0 9px;
  }
  .drug-box {
    .drug {
      padding: 0px 0 12px;
      > div:first-child {
        margin-bottom: 3px;
      }
    }
  }

  .evaluation-box {
    width: 600px;
    margin-top: 16px;
    height: 181px;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 18px 30px 0 29px;
    .evaluation-header {
      line-height: 21px;
      font-weight: 700;
      color: #2c2c2c;
      font-size: 15px;
      > span:last-child {
        height: 20px;
        font-weight: 500;
        color: #909399;
        font-size: 12px;
        line-height: 20px;
        margin-left: 6px;
      }
    }
    .evaluation-text {
      margin: 8px 0 10px;
      .el-textarea__inner {
        height: 80px;
      }
    }
    .evaluation-but {
      text-align: right;
      .el-button--primary {
        width: 80px;
        height: 32px;
        line-height: 32px;
        background-color: $blueColor;
        border-color: $blueColor;
        border-radius: 4px;
        font-weight: 700;
        color: #ffffff;
        font-size: 13px;
        padding: 0;
      }
    }
  }
}
</style>
