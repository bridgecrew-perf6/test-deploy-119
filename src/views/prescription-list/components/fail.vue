<template>
  <div class="wrapper">
    <div id="fail-msgbox" class="show-msgbox">
      <el-dialog
        :visible.sync="isVisible"
        width="600px"
        title=""
        :close-on-click-modal="false"
      >
        <div class="msgbox">
          <UserInfo
            :is-show-old="false"
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
          <ReviewFail
            :prescription-status="prescriptionStatus"
            :user-info-data="detailData"
          />
          <TipText />
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import UserInfo from '../../../components/UserInfo/index.vue'
import ReviewFail from '../../../components/ReviewFail/index.vue'
import TipText from '../../../components/TipText/index.vue'
export default {
  components: {
    UserInfo,
    ReviewFail,
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
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";

#fail-msgbox {
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
  .tip-text {
    padding-top: 10px;
  }
}
</style>
