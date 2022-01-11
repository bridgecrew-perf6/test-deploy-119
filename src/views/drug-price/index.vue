<template>
  <div class="drug-price-content">
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="drug-price-table"
    >
      <el-table-column label="序号" width="42">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="providerName" label="供应商" width="138" />
      <el-table-column prop="medicineInfoId" label="药品SKUID" width="105" />
      <el-table-column
        prop="thirdGoodsId"
        label="第三方药品SKUID"
        width="111"
      />
      <el-table-column prop="normalName" label="通用名" width="102" />
      <el-table-column prop="tradeName" label="商品名" width="68" />
      <el-table-column prop="englishName" label="英文名" width="67" />
      <el-table-column prop="importFlag" label="是否为进口药" width="66">
        <template slot-scope="scope">
          <div>{{ importFlagStatus[scope.row.importFlag] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="importMark" label="进口标识" width="80" />
      <el-table-column prop="drugSpecification" label="药品规格" />
      <el-table-column
        prop="packageSpecification"
        label="包装规格"
        width="80"
      />
      <el-table-column prop="produceFactory" label="生产厂商" width="126" />
      <el-table-column prop="price" label="药品售卖价格(元)" width="81" />
      <el-table-column prop="onlineStatus" label="状态" width="63">
        <template slot-scope="scope">
          <div>{{ status[scope.row.onlineStatus] }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="195">
        <template slot-scope="scope">
          <el-button
            v-if="status[scope.row.onlineStatus] == '下架'"
            type="text"
            size="small"
            class="put-but"
            @click="putDrug(scope.row)"
          >上架</el-button>
          <el-button
            v-if="status[scope.row.onlineStatus] == '上架'"
            type="text"
            size="small"
            class="off-but"
            @click="offDrug(scope.row)"
          >下架</el-button>
          <el-button
            type="text"
            size="small"
            class="show-but"
            @click="goShowDetail(scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="this.total"
      @current-change="turnPages"
    />

    <el-drawer
      title=""
      :visible.sync="isDrawer"
      direction="rtl"
      class="drug-price-info-box"
    >
      <div class="drug-info">
        <div class="info-header">药品基本信息</div>
        <div class="info-text-box">
          <div>
            <span class="info-label">通用名</span><span class="info-text">{{ detailData.normalName || "-" }}</span><span class="info-label">拼音学名</span><span class="info-text">{{ detailData.namePinyin || "-" }}</span><span class="info-label">检索编码</span><span class="info-text">{{ detailData.searchCode || "-" }}</span>
          </div>
          <div>
            <span class="info-label">一级分类</span><span class="info-text">{{
              detailData.categoryNameFirst || "-"
            }}</span><span class="info-label">二级分类</span><span class="info-text">{{
              detailData.categoryNameSecond || "-"
            }}</span><span class="info-label">三级分类</span><span class="info-text">{{
              detailData.categoryNameThird || "-"
            }}</span>
          </div>
          <div>
            <span class="info-label">是否为进口药</span><span class="info-text">{{
              importFlagStatus[detailData.importFlag]
            }}</span><span class="info-label">英文名</span><span class="info-text">{{ detailData.englishName || "-" }}</span><span class="info-label">进口标识</span><span class="info-text">{{ detailData.importMark || "-" }}</span>
          </div>
          <div>
            <span class="info-label">商品名</span><span class="info-text">{{ detailData.tradeName || "-" }}</span><span class="info-label">疾病编码</span><span class="info-text">{{ detailData.diseaseCode || "-" }}</span><span class="info-label">标准编码</span><span class="info-text">{{ detailData.standardCode || "-" }}</span>
          </div>
          <div>
            <span class="info-label">批准字号</span><span class="info-text">{{ detailData.approveNo || "-" }}</span><span class="info-label">药品批次号</span><span class="info-text">{{ detailData.drugBatch || "-" }}</span><span class="info-label">是否为麻毒类药类药品</span><span class="info-text">{{
              anesthesiaFlagStatus[detailData.anesthesiaFlag] || "-"
            }}</span>
          </div>
          <div>
            <span class="info-label">医保等级标识</span><span class="info-text">{{ detailData.medicareLevel || "-" }}</span><span class="info-label">是否为处方药</span><span class="info-text">{{ detailData.otcType || "-" }}</span><span class="info-label">保质期单位</span><span class="info-text">{{
              detailData.expirationDate || "-"
            }}</span>
          </div>
          <div>
            <span class="info-label">药品规格</span><span class="info-text">{{
              detailData.drugSpecification || "-"
            }}</span><span class="info-label">包装规格</span><span class="info-text">{{
              detailData.packageSpecification || "-"
            }}</span>
          </div>
        </div>
      </div>
      <div class="drug-instructions">
        <div class="info-header">药品说明书</div>
        <div class="info-text-box">
          <div>
            <span class="info-label">适应症</span><span class="info-text">{{
              detailData.drugIndication || "-"
            }}</span>
          </div>
          <div>
            <span class="info-label">主治疾病</span><span class="info-text">{{
              detailData.attendingDisease || "-"
            }}</span>
          </div>
          <div>
            <span class="info-label">用法用量</span><span class="info-text">{{ detailData.drugUsage || "-" }}</span>
          </div>
          <div>
            <span class="info-label">不良反应</span><span class="info-text">{{
              detailData.adverseReaction || "-"
            }}</span>
          </div>
          <div>
            <span class="info-label">禁忌</span><span class="info-text">{{ detailData.drugForbid || "-" }}</span>
          </div>
        </div>
        <div class="info-img-box">
          <div class="info-label">药品图片</div>
          <div>
            <el-image
              v-for="(item, index) in detailData.imagesArr"
              :key="index"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="detailData.imagesArr"
            />
          </div>
        </div>
      </div>
      <a
        v-if="detailData.instructionBook"
        class="show-file"
        :href="detailData.instructionBook"
        target="_blank"
      >
        <img :src="instructionsImgUrl">
        <div>说明书</div>
      </a>
    </el-drawer>
  </div>
</template>

<script>
import { getList, getOnline, getDetail } from '@/api/drug'

export default {
  components: {},
  data() {
    return {
      instructionsImgUrl: require('../../assets/drug/instructions.svg'),
      isDrawer: false,
      importFlagStatus: {
        1: '是',
        0: '否'
      },
      otcTypeStatus: {
        0: '是',
        1: '否'
      },
      status: {
        0: '下架',
        1: '上架'
      },
      anesthesiaFlagStatus: {
        1: '是',
        0: '否'
      },
      tableData: [],
      currentPage: 1,
      total: 10,
      size: 10,
      detailData: {}
    }
  },
  mounted() {
    this.getTableList()
  },
  methods: {
    // 获取列表
    getTableList() {
      const data = {
        current: this.currentPage,
        size: this.size
      }

      getList(data).then((response) => {
        const { data } = response
        this.total = data.total
        this.tableData = data.records
      })
    },
    // 翻页
    turnPages(e) {
      this.currentPage = e
      this.getTableList()
    },
    // 查看详情
    goShowDetail(row) {
      getDetail({ id: row.id }).then((response) => {
        const arr = []
        response.data.images.map((item) => {
          arr.push(item.pictureUrl)
        })
        this.detailData = response.data || {}
        this.detailData.imagesArr = arr
        this.isDrawer = true
      })
    },
    // 上架
    putDrug(row) {
      this.$confirm('您是否确定上架该药品？', '上架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'drug-price-confirm'
      })
        .then(() => {
          getOnline({
            medicineInfoId: row.id,
            salesStatus: 1
          }).then((response) => {
            this.getTableList()
            this.$message({
              type: 'success',
              message: '上架成功!'
            })
          })
        })
        .catch(() => {})
    },
    // 下架
    offDrug(row) {
      this.$prompt('您是否确定下架该药品？', '下架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入下架原因',
        customClass: 'drug-price-prompt',
        inputValidator: function(e) {
          if (e) {
            if (e.length > 100) {
              return false
            }
          } else {
            return false
          }
        },
        inputErrorMessage: '请先输入下架原因 ',
        type: 'warning'
      })
        .then(({ value }) => {
          console.log(value)
          getOnline({
            medicineInfoId: row.id,
            salesStatus: 0,
            unshelveReason: value
          }).then((response) => {
            this.getTableList()
            this.$message({
              type: 'success',
              message: '下架成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";

.drug-price-content {
  padding: 24px 45px 0 64px;
}

.drug-price-table {
  th,
  td {
    text-align: center;
    color: $tableTextColor;
    padding: 0 !important;
    div {
      padding: 0 5px !important;
    }
  }
  th {
    height: 48px;
    font-weight: 700;
    font-size: 14px;
  }
  td {
    height: 96px;
    font-size: 13px;
  }
  .el-button {
    width: 64px;
    height: 32px;
    padding: 0;
    line-height: 32px;
    border-color: $blueColor;
    color: $blueColor;
    border-radius: 4px;
  }
  .show-but {
    font-size: 13px;
    background-color: $blueColor;
    color: #fff;
  }
}
.has-gutter tr th {
  background: rgba(0, 0, 0, 0.05);
}
.el-pagination {
  display: flex;
  justify-content: right;
  padding: 46px 0 47px;
  .number {
    border-radius: 2px !important;
    font-size: 14px;
    color: $tableTextColor !important;
    font-weight: 500;
  }
  .active {
    background-color: $paginationColor !important;
    color: #fff !important;
  }
  li,
  button {
    width: 30px;
    height: 30px;
    line-height: 30px;
  }
}

.el-message-box__wrapper {
  .el-button--default {
    width: 52px;
    height: 30px;
    background-color: #dcdfe6;
    color: $tableTextColor;
    font-size: 14px;
    padding: 0;
    margin-left: 16px !important;
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
.put-but {
  background-color: #eaf3f8;
}
.drug-price-confirm {
  padding-bottom: 22px;

  .el-message-box__header {
    color: #2c2c2c;
    font-size: 18px;
    padding: 7px 15px 19px 20px;
  }

  .el-message-box__title {
    height: 25px;
    line-height: 25px;
  }

  .el-message-box__btns {
    padding-top: 30px;
    padding-right: 16px;
  }

  .el-message-box__content {
    padding: 0 20px;
  }

  .el-message-box__container {
    height: 45px;
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

.drug-price-prompt {
  padding-bottom: 22px;

  .el-message-box__header {
    color: #2c2c2c;
    font-size: 18px;
    padding: 9px 21px 18px 11px;
  }

  .el-message-box__title {
    height: 25px;
    line-height: 25px;
  }

  .el-message-box__btns {
    padding-top: 2px;
    padding-right: 16px;
  }

  .el-message-box__content {
    padding: 0 15px;
  }

  .el-message-box__container {
    height: 35px;
    display: flex;
    .el-message-box__status {
      position: relative;
    }

    .el-message-box__message {
      line-height: 18px;
      padding-left: 11px;
    }
  }

  .el-message-box__input {
    padding-top: 0;
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
.drug-price-info-box {
  color: #2c2c2c;
  font-size: 14px;

  .el-drawer {
    width: 767px !important;
    height: 1080px;
    background-color: #ffffff;
  }
  .el-drawer__header {
    margin-bottom: 22px;
  }
  .drug-info,
  .drug-instructions {
    width: 700px;
    height: 316px;
    background-color: #f3f6f8;
    border-radius: 4px;
    margin: auto;
    padding: 24px 36px 0 34px;
    .info-header {
      margin-bottom: 18px;
    }
  }
  .drug-instructions {
    min-height: 316px;
    height: auto;
    padding-bottom: 33px;
  }
  .drug-info {
    margin-bottom: 12px;

    .info-header {
      margin-bottom: 20px;
    }
  }
  .info-header {
    font-weight: 700;
    color: #2c2c2c;
    font-size: 17px;
  }
  .info-text-box {
    > div {
      margin-bottom: 12px;
    }
  }
  .info-label {
    width: 56px;
    height: 20px;
    color: rgba(44, 44, 44, 0.6);
    font-size: 14px;
    margin-right: 10px;
  }
  .info-text {
    color: #2c2c2c;
    font-size: 14px;
    margin-right: 16px;
  }
  .info-img-box {
    display: flex;
    > div:last-child {
      img,
      .el-image {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
  .show-file {
    width: 122px;
    height: 39px;
    background-color: #eaf3f8;
    border-radius: 4px;
    position: absolute;
    right: 36px;
    margin-top: 20px;
    font-weight: 700;
    color: #73a5c3;
    font-size: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 18px;
      height: 18px;
      margin-right: 4px;
    }
  }
}
</style>
