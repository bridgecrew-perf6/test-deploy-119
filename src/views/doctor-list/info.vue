<template>
  <div class="info-msgbox">
    <el-dialog
      :visible.sync="isVisible"
      width="800px"
      title=""
      :close-on-click-modal="false"
    >
      <div class="msgbox">
        <div class="header">基本信息</div>
        <div class="msgbox-boxs scroll-box">
          <div class="msgbox-box">
            <div class="info-box">
              <div>
                <div>
                  <span class="label">医生姓名：</span><span class="text">{{ detailData.doctorName }}</span>
                </div>
                <div>
                  <span class="label">医院：</span><span class="text">{{ detailData.hospital }}</span>
                </div>
                <div>
                  <span class="label">科室：</span><span class="text">{{ detailData.section }}</span>
                </div>
              </div>
              <div>
                <div>
                  <span class="label">职称：</span><span class="text">{{ detailData.title }}</span>
                </div>
              </div>
              <div>
                <div>
                  <span class="label">手写签名：</span>
                  <img class="icon" :src="detailData.electronicSign">
                </div>
              </div>
            </div>
            <div class="header">认证资料</div>
            <div class="attestation-data">
              <div class="label">身份证</div>
              <div class="id-img-box">
                <template v-if="getAuthFile(5).length">
                  <el-image
                    v-for="(item,index) in getAuthFile(5)"
                    :key="'auth5_'+index"
                    style="width: 120px;height: 120px;margin-right: 10px;"
                    fit="cover"
                    :src="item"
                    :preview-src-list="getAuthFile(5)"
                  />
                </template>
              </div>
              <div class="label">学历证证书</div>
              <div class="academic-certificate-box">
                <span
                  :class="isCertificate ? 'certificate-nav' : ''"
                  @click="changeCertificate()"
                >学历证</span>
                <span
                  :class="!isCertificate ? 'certificate-nav' : ''"
                  @click="changeCertificate()"
                >学位证</span>
              </div>
              <div>
                <template v-if="isCertificate && getAuthFile(6).length">
                  <el-image
                    v-for="(item,index) in getAuthFile(6)"
                    :key="'auth6_'+index"
                    style="width: 120px;height: 120px;margin-right: 10px;"
                    fit="cover"
                    class="icon"
                    :src="item"
                    :preview-src-list="getAuthFile(6)"
                  />
                </template>
                <template v-if="!isCertificate && getAuthFile(7).length">
                  <el-image
                    v-for="(item,index) in getAuthFile(7)"
                    :key="'auth7_'+index"
                    style="width: 120px;height: 120px;margin-right: 10px;"
                    fit="cover"
                    class="icon"
                    :src="item"
                    :preview-src-list="getAuthFile(7)"
                  />
                </template>
              </div>
              <div class="label">医生证照</div>
              <div class="academic-certificate-box doctor-license-box">
                <span
                  :class="isDoctorLicense === 0 ? 'certificate-nav' : ''"
                  @click="changeDoctorLicense(0)"
                >资格证</span>
                <span
                  :class="isDoctorLicense === 1 ? 'certificate-nav' : ''"
                  @click="changeDoctorLicense(1)"
                >执业证</span>
                <span
                  :class="isDoctorLicense === 2 ? 'certificate-nav' : ''"
                  @click="changeDoctorLicense(2)"
                >职称证</span>
              </div>
              <div>

                <template v-if="isDoctorLicense === 0 && getAuthFile(1).length">
                  <el-image
                    v-for="(item,index) in getAuthFile(1)"
                    :key="'auth1_'+index"
                    style="width: 120px;height: 120px;margin-right: 10px;"
                    fit="cover"
                    class="icon"
                    :src="item"
                    :preview-src-list="getAuthFile(1)"
                  />
                </template>
                <template v-if="isDoctorLicense === 1 && getAuthFile(2).length">
                  <el-image
                    v-for="(item,index) in getAuthFile(2)"
                    :key="'auth2_'+index"
                    style="width: 120px;height: 120px;margin-right: 10px;"
                    fit="cover"
                    class="icon"
                    :src="item"
                    :preview-src-list="getAuthFile(2)"
                  />
                </template>
                <template v-if="isDoctorLicense === 2 && getAuthFile(3).length">
                  <el-image
                    v-for="(item,index) in getAuthFile(3)"
                    :key="'auth3_'+index"
                    style="width: 120px;height: 120px;margin-right: 10px;"
                    fit="cover"
                    class="icon"
                    :src="item"
                    :preview-src-list="getAuthFile(3)"
                  />
                </template>
              </div>
              <div class="label">工牌</div>
              <div v-if="detailData.chestCard">
                <el-image
                  style="width: 120px;height: 120px;margin-right: 10px;"
                  fit="cover"
                  class="icon"
                  :src="detailData.chestCard"
                  :preview-src-list="[detailData.chestCard]"
                />
              </div>
              <div class="label">正面照</div>
              <div v-if="getAuthFile(4).length">
                <el-image
                  v-for="(item,index) in getAuthFile(4)"
                  :key="'auth4_'+index"
                  style="width: 120px;height: 120px;margin-right: 10px;"
                  fit="cover"
                  class="icon"
                  :src="item"
                  :preview-src-list="getAuthFile(4)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      isVisible: false,
      detailData: {},
      isCertificate: true,
      isDoctorLicense: 0
    }
  },
  computed: {
    // 获取各个认证类型的图片
    getAuthFile({ detailData }) {
      return (type) => {
        if (!detailData.doctorFile) return []
        return detailData.doctorFile.map(item => {
          return item.certifyType === type && item.fileUrl
        }).filter(Boolean)
      }
    }
  },
  methods: {
    init(e) {
      this.detailData = e
      this.isVisible = true
    },
    changeCertificate() {
      this.isCertificate = !this.isCertificate
    },
    changeDoctorLicense(status) {
      this.isDoctorLicense = status
    }
  }
}
</script>
<style lang="scss">
@import "@/styles/variables.scss";
.info-msgbox {
  .el-dialog {
    height: 750px;
    margin-top: 213px !important;
  }
  .el-dialog__body {
    padding: 10px 13px 23px 0;
  }
  .msgbox {
    .header {
      line-height: 25px;
      color: #2c2c2c;
      font-size: 18px;
      padding-left: 29px;
      text-align: center;
    }
    .msgbox-boxs {
      height: 649px;
    }
    .msgbox-box {
      .label {
        color: #99a8bc;
        line-height: 20px;
      }
      .info-box {
        padding: 14px 0 0 54px;
        font-size: 14px;

        span {
          display: inline-block;
          line-height: 20px;
          margin-bottom: 6px;
        }
        > div {
          display: flex;
          .text {
            margin-right: 80px;
          }
        }
        .icon {
          display: block;
          width: 105px;
          // height:50.53px;
        }
      }
      .header {
        padding: 27px 0 0 29px;
      }
      .attestation-data {
        padding: 0 54px;
        .label {
          padding-top: 14px;
          font-weight: 700;
        }
        .id-img-box {
          padding-top: 6px;
          display: flex;
          img {
            margin-right: 18px;
            width: 164px;
            height: 100px;
          }
        }
        .academic-certificate-box {
          display: flex;
          width: 166px;
          height: 36px;
          // line-height: 32px;
          text-align: center;
          border-radius: 4px;
          margin-top: 6px;
          align-items: center;
          padding: 2px;
          background: #ecedee;
          cursor: pointer;

          span {
            flex: 1;
            text-align: center;
            height: 32px;
            font-size: 14px;
            line-height: 32px;
          }
          .certificate-nav {
            background-color: #ffffff;
            border-radius: 2px;
            // border: 2px solid #ecedee;
            color: #73a5c3;
            font-weight: 700;
          }
        }
        .icon {
          width: 270px;
          height: 160px;
          margin-top: 14px;
        }
        .doctor-license-box {
          width: 248px;
        }
      }
      .item {
        display: flex;
      }
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
