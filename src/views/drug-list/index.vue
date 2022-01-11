<template>
  <div class="drug-content">
    <el-form
      ref="formData"
      :inline="true"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="drug-search-form"
    >
      <div class="search-left">
        <div class="search-left-first">
          <el-form-item label="药品名称" class="keyword" prop="keyword">
            <el-autocomplete
              v-model="formData.keyword"
              class="inline-input"
              popper-class="drug-name"
              :fetch-suggestions="querySearch"
              placeholder="支持通用名/商品名/英文名/检索编码搜索"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                <div class="name">
                  <div v-for="(text, index) in item.arr" :key="index">
                    <span v-if="index > 0" class="key">{{
                      formData.keyword
                    }}</span>
                    <span>{{ text }}</span>
                  </div>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item
            label="药品分类"
            class="drug-classification"
            prop="categoryClass"
          >
            <el-cascader v-model="formData.categoryClass" :props="props" />
          </el-form-item>

          <el-form-item
            label="标准编码"
            class="consultation-id"
            prop="standardCode"
          >
            <el-input
              v-model="formData.standardCode"
              placeholder="请输入标准编码"
              maxlength="20"
            />
          </el-form-item>

          <el-form-item
            label="是否为进口药"
            prop="importFlag"
            class="select-box"
          >
            <el-select v-model="formData.importFlag" placeholder="请选择">
              <el-option
                v-for="(item, index) in importFlagStatus"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否为处方药" prop="otcType" class="select-box">
            <el-select v-model="formData.otcType" placeholder="请选择">
              <el-option
                v-for="(item, index) in otcTypeStatus"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="search-but">
        <el-form-item>
          <el-button @click="resetForm('formData')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('formData')"
          >查询</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table :data="tableData" border style="width: 100%" class="drug-table">
      <el-table-column label="序号" width="42">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" label="药品分类" width="185" />
      <el-table-column prop="normalName" label="通用名称" />
      <el-table-column prop="tradeName" label="商品名" width="91" />
      <el-table-column prop="englishName" label="英文名" width="89" />
      <el-table-column prop="importFlag" label="是否为进口药" width="66">
        <template slot-scope="scope">
          <div>{{ importFlagStatus[scope.row.importFlag] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="importMark" label="进口标识" width="81" />
      <el-table-column prop="drugSpecification" label="药品规格" width="189" />
      <el-table-column
        prop="packageSpecification"
        label="包装规格"
        width="86"
      />
      <el-table-column prop="coverPicture" label="药品图片" width="132" />
      <el-table-column
        prop="anesthesiaFlag"
        label="是否为毒麻类药品"
        width="98"
      >
        <template slot-scope="scope">
          <div>{{ anesthesiaFlagStatus[scope.row.anesthesiaFlag] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="otcType" label="是否为处方药" width="74">
        <template slot-scope="scope">
          <div>{{ otcTypeStatus[scope.row.otcType] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="produceFactory" label="生产厂商" width="110" />

      <el-table-column label="操作" width="110">
        <template slot-scope="scope">
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
      :total="total"
      @current-change="turnPages"
    />

    <el-drawer
      title=""
      :visible.sync="isDrawer"
      direction="rtl"
      class="drug-info-box"
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
            <span class="info-label">医保等级标识</span><span class="info-text">{{ detailData.medicareLevel || "-" }}</span><span class="info-label">是否为处方药</span><span class="info-text">{{
              otcTypeStatus[detailData.otcType] || "-"
            }}</span><span class="info-label">保质期单位</span><span class="info-text">{{
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
    <Import ref="import" :url="url" :callback="getTableList" />
  </div>
</template>

<script>
import Import from '../../components/Import/index.vue'
import { getList, getCategory, getDetail, getSearchKeyWord } from '@/api/drug'

export default {
  components: {
    Import
  },
  data() {
    return {
      url: 'https://app-dev.gyenno.com/usg/usg-ih-admin/v1/api/medicineBaseInfo/web/importMedicine',
      instructionsImgUrl: require('../../assets/drug/instructions.svg'),
      isDrawer: false,
      formData: {
        keyword: '',
        categoryClass: [],
        standardCode: '',
        importFlag: '',
        otcType: ''
      },
      rules: {
        standardCode: [
          {
            pattern: /^[0-9]+$/,
            message: '只支持输入数字',
            trigger: 'blur'
          }
        ]
      },
      importFlagStatus: {
        1: '是',
        0: '否'
      },
      otcTypeStatus: {
        0: '是',
        1: '否'
      },
      anesthesiaFlagStatus: {
        1: '是',
        0: '否'
      },
      tableData: [],
      total: 10,
      currentPage: 1,
      size: 10,
      detailData: {},
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level, value } = node
          setTimeout(() => {
            getCategory({ categoryLevel: level + 1, id: value }).then(
              (response) => {
                const nodes = response.data.map((item) => ({
                  value: item.id,
                  label: item.categoryName,
                  leaf: level >= 2
                }))
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(nodes)
              }
            )
          }, 1000)
        }
      }
    }
  },
  mounted() {
    // 药品列表/药品价格列表
    this.getTableList()
  },
  methods: {
    // 获取列表
    getTableList() {
      const data = {
        current: this.currentPage,
        size: this.size
      }

      this.formData.keyword ? (data.keyword = this.formData.keyword) : ''
      this.formData.standardCode
        ? (data.standardCode = this.formData.standardCode)
        : ''
      this.formData.importFlag
        ? (data.importFlag = Number(this.formData.importFlag))
        : ''
      this.formData.otcType
        ? (data.otcType = Number(this.formData.otcType))
        : ''

      data.categoryIdFirst = this.formData.categoryClass[0]
      data.categoryIdSecond = this.formData.categoryClass[1]
      data.categoryIdThird = this.formData.categoryClass[2]

      getList(data).then((response) => {
        const { data } = response
        this.total = data.total
        this.tableData = data.records
      })
    },
    // 查询
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentPage = 1
          this.getTableList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置查询
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.currentPage = 1
      this.getTableList()
    },
    // 翻页
    turnPages(e) {
      this.currentPage = e
      this.getTableList()
    },
    // 输入框搜索 关键字 赋值
    querySearch(queryString, cb) {
      if (queryString) {
        const data = {
          keyword: queryString
        }
        data.categoryIdFirst = this.formData.categoryClass[0]
        data.categoryIdSecond = this.formData.categoryClass[1]
        data.categoryIdThird = this.formData.categoryClass[2]
        getSearchKeyWord(data).then((response) => {
          var restaurants = response.data
          var results = queryString
            ? restaurants.filter(this.createFilter(queryString))
            : restaurants
          const list = []
          results.map((item) => {
            list.push({
              value: item,
              arr: item.toLowerCase().split(queryString.toLowerCase())
            })
          })
          // 调用 callback 返回建议列表的数据
          cb(list)
        })
        cb([])
      } else {
        cb([])
      }
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        )
      }
    },
    // 输入框搜索 关键字 赋值
    handleSelect(item) {
      this.formData.keyword = item.value
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
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";

.drug-content {
  padding: 0 48px 0 61px;
}

.drug-search-form {
  display: flex;
  justify-content: right;
  padding: 0;
  .search-left {
    text-align: right;
    .el-form-item {
      margin: 22px 20px 17px 0;
    }
    .keyword {
      .el-input__inner {
        width: 260px;
        padding: 0 9px;
      }
    }
    .drug-classification {
      .el-input__inner {
        width: 144px;
        padding: 0 9px;
      }
    }
    .consultation-id {
      .el-input__inner {
        width: 163px;
        padding: 0 9px;
      }
    }
    .select-box {
      .el-input__inner {
        width: 85px;
      }
    }
    .el-form-item__label {
      width: auto !important;
      padding: 0 9px 0 0;
      font-size: 14px;
      font-weight: 400;
      color: $labelTextColor;
      height: 39px;
    }
    .el-input__inner,
    .el-range-input,
    .el-form-item__content,
    .el-input {
      color: $labelTextColor;
      font-size: 13px;
      height: 39px;
      line-height: 39px;
    }
    .el-input__inner::-webkit-input-placeholder,
    .el-range-input::-webkit-input-placeholder {
      color: $inputTextColor;
    }
  }
  .search-but {
    > div {
      margin: 0 0 0 18px;
    }
    > .el-form-item--medium:first-child {
      margin: 0 0 0 10px;
    }
    .el-button--medium {
      width: 98px;
      height: 40px;
      margin: 22px 0 17px 0;
    }
    .el-button--default {
      border: 1px solid;
      border-color: $blueColor;
      border-radius: 4px;
      color: $blueColor;
      font-size: 14px;
    }
    .el-button--primary {
      border-color: $blueColor;
      background: $blueColor;
      color: #fff;
    }
  }
}
.drug-table {
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
    height: 72px;
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
  padding: 34px 0;
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
.inline-input{
  .el-input__inner{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.drug-name {
  .el-scrollbar__view li {
    padding: 0;
  }
  .el-autocomplete-suggestion__wrap {
    height: 200px;
  }

  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 237px;
    margin: auto;
    color: $labelTextColor;
    // height: 182px;
    display: flex;
  }
  .key {
    color: red;
  }
}
.drug-info-box {
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
