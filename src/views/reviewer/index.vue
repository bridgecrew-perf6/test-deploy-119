<template>
  <div v-show="recipeCanShow" class="reviewer-box">
    <div class="flex">
      <div class="reviewer-left">
        <div class="msgbox" :class="isAudit ? '' : 'isAudit'">
          <UserInfo
            :is-show-old="true"
            :user-info-data="detailData"
            :sex-status="sexStatus"
          />
          <div
            v-if="detailData.drugs"
            class="drug-box"
            :class="detailData.drugs.length > 2 ? 'scroll-box' : ''"
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
            ref="reviewComments"
            :prescription-status="prescriptionStatus"
            :is-audit="isAudit"
            :user-info-data="detailData"
            @adoptReview="adopt"
            @failReview="agree"
          />
          <TipText />
        </div>
      </div>
      <div class="reviewer-right">
        <div class="flex nav">
          <div :class="navIndex ? 'isNav' : ''" @click="changeNav">
            风险预警
          </div>
          <div :class="navIndex ? '' : 'isNav'" @click="changeNav">
            计算超量
          </div>
        </div>
        <div v-if="navIndex" class="risk-warning">
          <div class="allergic-history">
            <div class="risk-warning-header">过敏史</div>
            <div class="allergic-history-text">{{ riskText }}</div>
          </div>
        </div>
        <div v-if="!navIndex" class="calculate-excess-box">
          <div class="calculate-excess">
            <el-form
              ref="excessData"
              :model="excessFormData"
              label-width="100px"
            >
              <div class="search-left">
                <div class="search-left-first">
                  <el-form-item
                    label="药品规格"
                    class="input-number"
                    prop="specs"
                  >
                    <el-input
                      v-model="excessFormData.specs"
                      placeholder="示例：4*12片/板/盒，则输入:48"
                      maxlength="10"
                      type="number"
                    />
                  </el-form-item>
                  <el-form-item
                    label="用法用量"
                    class="input-number"
                    prop="dosage"
                  >
                    <el-input
                      v-model="excessFormData.dosage"
                      placeholder="示例：一次4片，一日3次，则输入:12"
                      maxlength="10"
                      type="number"
                    />
                  </el-form-item>
                  <el-form-item
                    label="实际开药数量"
                    class="quantity-number"
                    prop="quantity"
                  >
                    <el-input-number
                      v-model="excessFormData.quantity"
                      :min="0"
                      :max="100"
                    />
                  </el-form-item>
                </div>
              </div>
              <div class="but-box">
                <el-button
                  type="primary"
                  @click="checkExcess()"
                >确定</el-button>
              </div>
            </el-form>
            <div v-if="isExcess" class="calculate-excess-tip">
              当前处方超过国家规定的慢病用药3个月限量，请修改后重新提交
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="split-bottom">
      <div class="next-sheet" @click="nextSheet">下一张</div>
    </div>
  </div>
</template>

<script>
import UserInfo from '../../components/UserInfo/index.vue'
import ReviewComments from '../../components/ReviewComments/index.vue'
import TipText from '../../components/TipText/index.vue'
import eventBus from '@/event-bus'

import {
  getPrescriptionDetail,
  getPrescriptionLock,
  getPrescriptionRisk,
  getDrugSpecs,
  getVerify,
  getUnlockedOne
} from '@/api/prescription'

export default {
  components: {
    UserInfo,
    ReviewComments,
    TipText
  },
  data() {
    return {
      excessFormData: {
        specs: '',
        dosage: '',
        quantity: 0
      },
      prescriptionStatus: {
        1: '待审核',
        9: '正在审核',
        2: '已通过',
        3: '已拒绝'
      },
      sexStatus: {
        1: '男',
        2: '女'
      },
      recipeCanShow: false,
      detailData: {},
      navIndex: true,
      isAudit: true,
      isExcess: false,
      times: 0,
      riskText: ''
    }
  },
  created() {
    this.onTime()
  },
  mounted() {
    const transNo = this.$route.query.transNo
    if (transNo) {
      getPrescriptionDetail({ transNo: transNo }).then((response) => {
        this.detailData = response.data
      })
      getPrescriptionRisk({ transNo: transNo }).then((res) => {
        this.riskText = res.data
      })
      this.recipeCanShow = true
    } else {
      getPrescriptionDetail().then((response) => {
        this.detailData = response.data
        getPrescriptionLock({ transNo: response.data.transNo }).then((res) => {
          this.detailData = response.data
          this.detailData.status = 9
        })
        getPrescriptionRisk({ transNo: response.data.transNo }).then((res) => {
          this.riskText = res.data
        })
      }).catch(() => {
        this.$router.push({ name: 'PrescriptionList' })
      }).finally(() => {
        this.recipeCanShow = true
      })
    }
    eventBus.$on('CHECKREVIEWER', (callback) => {
      if (this.detailData.status === 9) {
        this.$confirm('该处方还未完成审核,您确定退出么？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'reviewer-confirm'
        })
          .then(() => {
            clearInterval(this.setTime)
            getUnlockedOne({ transNo: this.detailData.transNo }).then(
              (response) => {
                this.$message({
                  message: '处方释放成功！',
                  type: 'success'
                })
                callback()
              }
            )
          })
          .catch(() => {})
      } else {
        clearInterval(this.setTime)
        callback()
      }
    })
  },
  beforeDestroy() {
    eventBus.$off('CHECKREVIEWER')
  },
  destroyed() {
    clearInterval(this.setTime)
  },
  methods: {
    adopt(e) {
      if (e && this.isAudit) {
        this.$confirm('是否确认不通过该处方审核？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'reviewer-confirm'
        })
          .then(() => {
            this.getVerify(3, e)
          })
          .catch(() => {})
      }
    },
    agree(e) {
      if (e && this.isAudit) {
        this.$confirm('是否确认通过该处方审核？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'reviewer-confirm'
        })
          .then(() => {
            this.getVerify(2, e)
          })
          .catch(() => {})
      } else {
        this.$message({ message: '请输入审核意见', type: 'warning' })
      }
    },
    // 发送请求，同意/不同意
    getVerify(status, refuseReason) {
      const data = {
        transNo: this.detailData.transNo,
        status,
        refuseReason
      }
      getVerify(data).then((response) => {
        this.isAudit = false
        this.detailData.status = status
        clearInterval(this.setTime)
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
      })
    },
    changeNav() {
      this.navIndex = !this.navIndex
    },
    nextSheet() {
      if (this.isAudit) {
        this.$message.warning('请先审核该处方。')
      } else {
        // 停止循环，获取处方
        clearInterval(this.setTime)
        getPrescriptionDetail().then((response) => {
          // 恢复初始数据
          this.isAudit = true
          this.isExcess = false
          this.navIndex = true
          this.times = 0
          this.excessFormData = {
            specs: '',
            dosage: '',
            quantity: 0
          }
          this.$refs.reviewComments.commentsText = ''
          this.onTime()

          this.detailData = response.data
          getPrescriptionLock({ transNo: response.data.transNo }).then(
            (res) => {
              this.detailData = response.data
              this.detailData.status = 9
            }
          )
          getPrescriptionRisk({ transNo: response.data.transNo }).then(
            (res) => {
              this.riskText = res.data
            }
          )
        }).catch(err => {
          if (err.code === 1) {
            this.$confirm(
              '已经审核完最后一张处方，是否跳转回处方列表？',
              '',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'reviewer-confirm',
                type: 'warning'
              }
            )
              .then(() => {
                this.$router.push({ name: 'PrescriptionList' })
              })
          }
        })
      }
    },
    // 计算超量
    checkExcess() {
      const { quantity, dosage, specs } = this.excessFormData
      getDrugSpecs({
        dosage: Number(dosage),
        quantity: Number(quantity),
        specs: Number(specs)
      }).then((response) => {
        if (response.code === 10006) {
          this.isExcess = true
        } else {
          this.isExcess = false
        }
      })
    },
    // 循环，计算是否超量
    onTime() {
      const _this = this
      _this.times = 0
      this.setTime = setInterval(() => {
        _this.times++
        if (_this.times / 60 >= 4) {
          if (_this.times / 60 >= 5) {
            clearInterval(_this.setTime)
            getUnlockedOne({ transNo: this.detailData.transNo }).then(
              (response) => {
                _this.$message({
                  message: '处方释放成功！',
                  type: 'success'
                })
                this.detailData.status = 1
              }
            )
          }
          if (_this.times / 60 === 4) {
            _this.$message('尽快审核处方，1分钟后将自动释放处方！')
          }
        }
      }, 1000)
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

.isAudit .el-button {
  background-color: rgba(0, 0, 0, 0.5) !important;
  color: #fff !important;
}

.reviewer-box {
  > div:first-child {
    width: 1240px;
    margin: 33px auto 0 auto;
    justify-content: space-between;
    padding-bottom: 118px;
  }
  .reviewer-left {
    width: 600px;
    height: 838px;
    background-color: #fcfcfc;
    border: 1px solid;
    border-color: #ebeef5;
    border-radius: 4px;
    .msgbox {
      background: #fff;
      padding: 0 30px;
      font-size: 13px;
      .header {
        padding: 31px 0 4px 0;
      }
      .drug-box {
        padding-right: 21px;
        padding-bottom: 2px;
        line-height: 21px;
        .drug {
          padding: 18px 0 11px;
          > div {
            font-weight: 700;
            color: $labelTextColor;
            > span {
              margin-right: 16px;
            }
          }
          > div:first-child {
            height: 21px;
            margin-bottom: 7px;
            line-height: 21px;
          }
          > div:last-child {
            color: $msgboxTextColor;
            line-height: 18px;
            height: 18px;
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
          margin-right: 5px;
        }
      }
      .review-comments-header {
        line-height: 29px;
        padding: 11px 0 9px 0;
      }
      .review-comments-box .comments-box .search-but {
        padding: 18px 0 22px;
      }
      .tip-text {
        padding-top: 12px;
      }
    }
  }
  .reviewer-right {
    width: 600px;
    height: 838px;
    background-color: #fcfcfc;
    border: 1px solid;
    border-color: #ebeef5;
    border-radius: 4px;
    .nav {
      width: 248px;
      height: 36px;
      background-color: #f0f2f5;
      border-radius: 4px;
      margin: 19px auto 38px auto;
      color: #909399;
      font-size: 14px;
      justify-content: space-between;

      div {
        flex: 1;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        border: 2px solid #f0f2f5;
      }
      .isNav {
        background-color: #ffffff;
        border-radius: 2px;
        font-weight: 700;
        color: #73a5c3;
      }
    }
    .risk-warning-header {
      width: 96px;
      height: 28px;
      line-height: 28px;
      background-color: #eaf3f8;
      border-radius: 4px 0px 4px 0px;
      text-align: center;
    }
    .risk-warning {
      padding: 0 30px;
      .allergic-history {
        min-height: 100px;
        background-color: #ffffff;
        border: 1px solid;
        border-color: #ebeef5;
        border-radius: 4px;
        .allergic-history-text {
          padding: 18px 0 0 31px;
          color: #2c2c2c;
          font-size: 14px;
          letter-spacing: 2.5px;
          line-height: 24px;
        }
      }
    }
    .calculate-excess-box {
      width: 540px;
      height: 368px;
      background-color: #ffffff;
      border: 1px solid;
      border-color: #ebeef5;
      border-radius: 4px;
      margin: auto;

      .calculate-excess {
        padding: 37px 72px 0 73px;
      }
      .el-form-item {
        margin-bottom: 20px;
      }
      .el-form-item__label {
        width: auto !important;
        padding: 0 9px 0 0;
        font-size: 14px;
        font-weight: 400;
        color: $labelTextColor;
        height: 39px;
      }
      .input-number {
        .el-input__inner {
          width: 330px;
          height: 39px;
          color: $labelTextColor;
          font-size: 13px;
          padding: 0 9px;
        }
        .el-form-item__content {
          margin-left: 66px !important;
        }
      }
      .quantity-number {
        text-align: right;
        margin: 1px 0 50px;
        .el-input-number--medium {
          width: 189px;
          height: 39px;
          color: $labelTextColor;
          font-size: 13px;
          span {
            height: 37px;
            line-height: 37px;
          }
          div,
          input {
            height: 39px;
            line-height: 39px;
          }
        }
      }
      .but-box {
        button {
          display: block;
          margin: 0 auto;
          width: 80px;
          height: 32px;
          line-height: 32px;
          background-color: #73a5c3;
          border-color: #73a5c3;
          border-radius: 4px;
          font-weight: 700;
          color: #ffffff;
          font-size: 13px;
          padding: 0;
        }
      }
      .calculate-excess-tip {
        padding-top: 34px;
        color: #ee6c4d;
        font-size: 12px;
      }
    }
  }

  .split-bottom {
    width: 100%;
    border-top: 1px solid #d9dee6;
    position: fixed;
    bottom: 0;
    background: #fff;
  }
  .next-sheet {
    width: 98px;
    height: 40px;
    line-height: 40px;
    background-color: #ee6c4d;
    border-radius: 4px;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    margin: 18px auto;
    cursor: pointer;
  }
  .comments9 {
    background-color: #f0f9ea !important;
    color: #67c23a !important;
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

.reviewer-confirm {
  padding-bottom: 22px;

  .el-message-box__header {
    color: #2c2c2c;
    font-size: 18px;
    padding: 11px 15px 23px;
  }

  .el-message-box__title {
    height: 25px;
    line-height: 25px;
  }

  .el-message-box__btns {
    padding-top: 30px;
  }

  .el-message-box__content {
    padding-top: 0;
    padding-bottom: 0;
  }

  .el-message-box__container {
    height: 37px;
    display: flex;
    .el-message-box__status {
      position: relative;
    }

    .el-message-box__message {
      line-height: 18px;
      padding-left: 11px;
    }
  }

  .el-button--default {
    width: 52px;
    height: 30px;
    background-color: #dcdfe6;
    color: $tableTextColor;
    font-size: 14px;
    padding: 0;
  }
  .el-button--primary {
    width: 52px;
    height: 30px;
    background-color: $blueColor;
    border-color: $blueColor;
    border-radius: 4px;
    font-weight: 700;
    color: #ffffff;
    font-size: 14px;
  }
}
</style>
