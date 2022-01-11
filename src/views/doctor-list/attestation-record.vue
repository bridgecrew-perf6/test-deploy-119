<template>
  <div class="attestation-record-msgbox">
    <el-dialog
      :visible.sync="isVisible"
      width="800px"
      title=""
      :close-on-click-modal="false"
    >
      <div class="msgbox">
        <div class="header">认证记录</div>
        <div
          class="msgbox-boxs"
          :class="detailData.length > 4 ? 'scroll-box' : ''"
        >
          <div class="msgbox-box">
            <div v-for="(item, index) in detailData" :key="index" class="item">
              <div>
                <div>
                  <span class="label">认证类型：</span><span class="text">医疗执业认证</span>
                </div>
                <div>
                  <span class="label">{{ getAuditName(item.auditType) }}状态：</span><span
                    class="text"
                    :class="item.verifyStatus === 1 ? 'error' : 'success'"
                  >{{ statusNameFormat(item.verifyStatus,item.auditType) }}</span>
                </div>
              </div>
              <div>
                <div>
                  <span class="label">提交时间：</span><span class="text">{{ item.submitTime }}</span>
                </div>
                <div>
                  <span class="label">说明：</span><span class="text">{{ item.refuseReason }}</span>
                </div>
              </div>
              <!-- <div>查看详情</div> -->
              <el-button
                type="text"
                size="small"
                class="show-detail"
                @click="goEvaluation(item)"
              >查看详情</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <Info ref="info" />
  </div>
</template>
<script>
import * as statusName from '@/constant/authStatus'
import { getAuthDetail } from '@/api/doctor'
import Info from './info.vue'

export default {
  components: {
    Info
  },
  data() {
    return {
      isVisible: false,
      detailData: {}
    }
  },
  computed: {
    getAuditName() {
      return (status) => {
        return statusName['auditType'][status]['name']
      }
    },
    statusNameFormat() {
      return (status) => {
        return statusName[statusName['auditType'][status]['code']][status]
      }
    }
  },
  methods: {
    init(e) {
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
    },
    // 查询认证详情
    goEvaluation({ auditInfoId, doctorId }) {
      const queryData = {
        auditInfoId, doctorId
      }
      getAuthDetail(queryData).then((response) => {
        const { data } = response
        this.$refs.info.init(data)
      })
    }
  }
}
</script>
<style lang="scss">
.attestation-record-msgbox {
  .el-dialog {
    height: 550px;
    margin-top: 213px !important;
  }
  .el-dialog__body {
    padding: 10px 13px 23px 29px;
  }
  .msgbox {
    .header {
      line-height: 25px;
      color: #2c2c2c;
      font-size: 18px;
      padding-bottom: 14px;
      text-align: center;
    }
    .msgbox-boxs {
      height: 450px;
    }
    .msgbox-box {
      .item {
        display: flex;
        justify-content: space-between;
        //width: 750px;
        height: 100px;
        background-color: #fafafa;
        padding: 20px 30px;
        margin-bottom: 10px;
        margin-right: 20px;
        > div {
          padding-right: 10px;
        }
        .label {
          color: #99a8bc;
          line-height: 20px;
        }
        span {
          display: inline-block;
          padding: 6px 0;
        }
        .show-detail {
          width: 80px;
          height: 32px;
          background-color: #73a5c3;
          border-radius: 4px;
          color: #ffffff;
          span {
            padding: 0;
          }
        }
      }
      // padding-right: 10px;
    }
  }
  .success {
    color: #7cca55;
  }
  .error {
    color: #f57c7c;
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
