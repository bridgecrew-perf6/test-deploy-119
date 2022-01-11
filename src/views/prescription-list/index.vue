<template>
  <div class="prescription-content">
    <el-form
      ref="formData"
      :inline="true"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="search-form"
    >
      <div class="search-left">
        <div class="search-left-first">
          <el-form-item label="关键字" class="keyword" prop="keyword">
            <el-autocomplete
              v-model="formData.keyword"
              class="inline-input"
              popper-class="keyword"
              :fetch-suggestions="querySearchKeyword"
              placeholder="可按照医院名称 / 医生名称 / 药师姓名 / 患者姓名搜索"
              :maxlength="20"
              @select="handleSelectKeyword"
              @input="handleInputKeyword"
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
            label="关联问诊"
            class="keyword consultation-id"
            prop="orderNum"
          >
            <el-autocomplete
              v-model="formData.orderNum"
              popper-class="orderNum"
              class="inline-input"
              :fetch-suggestions="querySearchOrderNumber"
              placeholder="请输入关联问诊ID"
              :maxlength="30"
              @select="handleOrderNum"
              @input="handleInputOrderNum"
            >
              <template slot-scope="{ item }">
                <div class="name">
                  <div v-for="(text, index) in item.arr" :key="index">
                    <span v-if="index > 0" class="key">{{
                      formData.orderNum
                    }}</span>
                    <span>{{ text }}</span>
                  </div>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="审核时间" class="time" prop="auditTime">
            <el-date-picker
              v-model="formData.auditTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="处方状态" prop="status" class="select-box">
            <el-select v-model="formData.status" placeholder="请选择">
              <el-option
                v-for="(item, index) in prescriptionStatus"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="评价状态"
            prop="evaluateStatus"
            class="select-box"
          >
            <el-select v-model="formData.evaluateStatus" placeholder="请选择">
              <el-option
                v-for="(item, index) in prescriptionEvaluation"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="开具时间" class="time" prop="signTime">
            <el-date-picker
              v-model="formData.signTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              prefix-icon=""
            />
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

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      class="prescription-table"
    >
      <el-table-column prop="transNo" label="处方编号" width="113" />
      <el-table-column prop="orderNumber" label="关联问诊" />
      <el-table-column prop="doctorHospital" label="医院名称" width="213" />
      <el-table-column prop="doctorName" label="开具医生" width="85" />
      <el-table-column prop="recipeTime" label="开具时间" width="96" />
      <el-table-column prop="patientName" label="患者姓名" width="80" />
      <el-table-column prop="patientSex" label="性别" width="52">
        <template slot-scope="scope">
          <span>{{ sexStatus[scope.row.patientSex] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="patientAge" label="年龄" width="52" />
      <el-table-column prop="auditName" label="审核药师" width="80">
        <template slot-scope="scope">
          <span>{{
            prescriptionStatus[scope.row.status] === "待审核"
              ? "—"
              : scope.row.auditName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="auditTime" label="审核时间" width="96">
        <template slot-scope="scope">
          <span>{{
            prescriptionStatus[scope.row.status] === "待审核" ||
              prescriptionStatus[scope.row.status] === "正在审核"
              ? "—"
              : scope.row.auditTime
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="evaluateName" label="评价人" width="92">
        <template slot-scope="scope">
          <span>{{
            prescriptionEvaluation[scope.row.evaluateStatus] === "未评价"
              ? "—"
              : scope.row.evaluateName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="evaluateTime" label="评价时间" width="90">
        <template slot-scope="scope">
          <span>{{
            prescriptionEvaluation[scope.row.evaluateStatus] === "已评价"
              ? scope.row.evaluateTime
              : "—"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处方状态" width="80">
        <template slot-scope="scope">
          <span>{{ prescriptionStatus[scope.row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="evaluateStatus" label="评价状态" width="79">
        <template slot-scope="scope">
          <span>{{ prescriptionEvaluation[scope.row.evaluateStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="161">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="show-but"
            @click="goShowPrescription(scope.row)"
          >查看处方</el-button>
          <el-button
            v-if="prescriptionStatus[scope.row.status] === '待审核'"
            type="text"
            size="small"
            class="reviewer-but"
            @click="goReviewer(scope.row)"
          >去审方</el-button>
          <el-button
            v-if="
              prescriptionEvaluation[scope.row.evaluateStatus] === '未评价' &&
                prescriptionStatus[scope.row.status] != '待审核'
            "
            type="text"
            size="small"
            @click="goEvaluation(scope.row)"
          >评价处方</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentPage"
      @current-change="turnPages"
    />

    <show
      ref="showPrescription"
      :prescription-status="prescriptionStatus"
      :sex-status="sexStatus"
    />
    <fail
      ref="failPrescription"
      :prescription-status="prescriptionStatus"
      :sex-status="sexStatus"
    />
    <refuse
      ref="refusePrescription"
      :prescription-status="prescriptionStatus"
      :sex-status="sexStatus"
    />
    <evaluation
      ref="evaluationPrescription"
      :prescription-status="prescriptionStatus"
      :sex-status="sexStatus"
      @getTableList="getTableList"
    />
  </div>
</template>

<script>
import show from './components/show.vue' // 导入组件
import fail from './components/fail.vue'
import refuse from './components/refuse.vue'
import evaluation from './components/evaluation.vue'
import {
  getPrescriptionList,
  getPrescriptionDetail,
  getPrescriptionLock,
  getRemind,
  getUnlockedOne,
  getSearchKeyWord,
  getSearchOrderNumber
} from '@/api/prescription'
import moment from 'moment'

export default {
  components: {
    // 挂载组件
    show, // 自定义的标签
    fail,
    refuse,
    evaluation
  },
  data() {
    return {
      formData: {
        keyword: '',
        orderNum: '',
        auditTime: '',
        status: '',
        evaluateStatus: '',
        signTime: ''
      },
      rules: {
        keyword: [
          {
            pattern: /^[\u0391-\uFFE5A-Za-z]+$/,
            message: '支持汉字，英文、其他字符不支持',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在2到20个字符',
            trigger: 'blur'
          }
        ],
        orderNum: [
          {
            pattern: /^[a-zA-Z0-9\u4e00-\u9fa5\(\)]+$/,
            message: '支持英文（大小写），数字 ，中文 ，特殊符号()',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: '长度在2到20个字符',
            trigger: 'blur'
          }
        ]
      },
      searchKeyWord: [],
      searchOrderNumber: [],
      prescriptionStatus: {
        1: '待审核',
        9: '正在审核',
        2: '已通过',
        3: '已拒绝'
      },
      prescriptionEvaluation: {
        0: '未评价',
        1: '已评价'
      },
      sexStatus: {
        1: '男',
        2: '女'
      },
      tableData: [],
      total: 10,
      currentPage: 1,
      size: 10,
      pickerOptions: {
        // 当我们选择日期时的回调方法。返回两个日期的最大值和最小值，第一次返回一个值，第二次返回两个值
        onPick: ({ maxDate, minDate }) => {
          // 当我们选择两个值的时候，就认为用户已经选择完毕
          if (maxDate != null && minDate != null) {
            this.maxDate = maxDate
            this.minDate = minDate
          }
        },
        disabledDate: (time) => {
          const maxDate = this.maxDate
          const minDate = this.minDate
          if (maxDate != null && minDate != null) {
            const days = maxDate.getTime() - minDate.getTime() // 计算完之后必须清除，否则选择器一直处于禁止选择的状态
            this.maxDate = null
            this.minDate = null
            // 限制选择时间间隔为1天
            return parseInt(days / (60 * 60 * 24 * 1000)) < 1
          } else {
            // 设置当前时间后的时间不可选
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  computed: {},
  mounted() {
    // 获取处方列表   首次默认获取当天的处方列表信息。
    this.getTableList(true)
    // 获取未审核完成处方
    getRemind().then((response) => {
      if (response.data) {
        this.$confirm('系统检测到您上张处方还未完成审核，是否继续审方？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'prescription-confirm',
          type: 'warning'
        })
          .then(() => {
            this.$router.push({
              path: '/prescription/reviewer/index',
              name: 'Reviewer',
              query: { transNo: response.data }
            })
          })
          .catch(() => {
            getUnlockedOne({ transNo: response.data }).then((response) => {
              this.$message({
                message: '处方释放成功！',
                type: 'success'
              })
            })
          })
      }
    })
  },
  methods: {
    // 获取列表
    getTableList(start) {
      const data = {
        current: this.currentPage,
        size: this.size
      }

      this.formData.keyword ? (data.keyword = this.formData.keyword) : ''
      this.formData.orderNum ? (data.orderNum = this.formData.orderNum) : ''
      this.formData.status ? (data.status = Number(this.formData.status)) : ''
      this.formData.evaluateStatus
        ? (data.evaluateStatus = Number(this.formData.evaluateStatus))
        : ''

      this.formData.auditTime[0]
        ? (data.auditStartTime = moment(this.formData.auditTime[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        ))
        : ''
      this.formData.auditTime[1]
        ? (data.auditEndTime = moment(this.formData.auditTime[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        ))
        : ''

      this.formData.signTime[0]
        ? (data.signStartTime = moment(this.formData.signTime[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        ))
        : ''
      this.formData.signTime[1]
        ? (data.signEndTime = moment(this.formData.signTime[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        ))
        : ''

      if (start) {
        data.signStartTime =
          moment(new Date()).format('YYYY-MM-DD') + ' 00:00:00'
        data.signEndTime =
          moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59'
      }

      getPrescriptionList(data).then((response) => {
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
    // 输入框搜索 关键字
    querySearchKeyword(queryString, cb) {
      if (queryString.length >= 2) {
        // 通过关键字进行返回项目进行切分
        getSearchKeyWord({ keyword: queryString }).then((response) => {
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
    // 输入框搜索 关联问诊
    querySearchOrderNumber(queryString, cb) {
      if (queryString.length >= 2) {
        getSearchOrderNumber({ orderNumber: queryString }).then((response) => {
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
    handleSelectKeyword(item) {
      this.formData.keyword = item.value
    },
    handleInputKeyword(value) {
      // 只能输入汉字、英文、数字
      this.formData.keyword = value.replace(/[^\a-\z\A-\Z\u4E00-\u9FA5]/g, '')
    },
    handleInputOrderNum(value) {
      //  支持英文（大小写），数字 ，中文 ，特殊符号【(  )】
      this.formData.orderNum = value.replace(/[^\a-\z\A-\Z\u4E00-\u9FA5\0-\9\(\)\【\】]/g, '')
    },
    // 输入框搜索 关联问诊 赋值
    handleOrderNum(item) {
      this.formData.orderNum = item.value
    },
    // 查看详情
    goShowPrescription(row) {
      getPrescriptionDetail({ transNo: row.transNo }).then((response) => {
        if (
          this.prescriptionStatus[row.status] === '待审核' ||
          this.prescriptionStatus[row.status] === '正在审核'
        ) {
          this.$refs.showPrescription.init(response.data)
        }
        if (this.prescriptionStatus[row.status] === '已通过') {
          this.$refs.failPrescription.init(response.data)
        }
        if (this.prescriptionStatus[row.status] === '已拒绝') {
          this.$refs.refusePrescription.init(response.data)
        }
      })
    },
    // 评价
    goEvaluation(row) {
      getPrescriptionDetail({ transNo: row.transNo }).then((response) => {
        this.$refs.evaluationPrescription.init(response.data)
      })
    },
    // 去审方
    goReviewer(row) {
      getPrescriptionDetail({ transNo: row.transNo }).then((response) => {
        if (this.prescriptionStatus[response.data.status] === '正在审核') {
          this.$confirm(
            '该处方已被其他药师申领，无法操作审方，如需审方请点击确定按钮进入到审方页面。',
            '',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              customClass: 'prescription-confirm',
              type: 'warning'
            }
          )
            .then(() => {
              this.$router.push({
                path: '/prescription/reviewer/index',
                name: 'Reviewer',
                query: {}
              })
            })
            .catch(() => {})
        }

        if (this.prescriptionStatus[response.data.status] === '待审核') {
          getPrescriptionLock({ transNo: row.transNo }).then(() => {
            this.$router.push({
              path: '/prescription/reviewer/index',
              name: 'Reviewer',
              query: { transNo: row.transNo }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";

.prescription-content {
  padding: 0 48px;
}
.name {
  display: flex;
}
.key {
  color: red;
}
.search-form {
  display: flex;
  justify-content: right;
  padding: 60px 0 20px 0;

  .search-left {
    text-align: right;
    .el-form-item {
      margin: 0 20px 21px 0;
    }
    .keyword {
      .el-input__inner {
        width: 340px;
        padding: 0 9px;
      }
    }
    .consultation-id {
      .el-input__inner {
        width: 180px;
        height: 39px;
        padding: 0 9px;
      }
    }
    .time {
      .el-date-editor {
        width: 300px;
        height: 39px;
        padding: 3px 5px;
      }
      .el-range-input {
        height: 36px;
        line-height: 36px;
        width: 45%;
      }
      .el-range-separator {
        line-height: 33px;
      }
      .el-icon-time {
        display: none;
      }
      .el-range__close-icon {
        position: absolute;
        right: 5px;
      }
      .el-icon-circle-close {
        background: #ffffff;
      }
    }
    .select-box {
      .el-input__inner {
        width: 120px;
      }
    }
    .el-form-item__label {
      width: auto !important;
      padding: 0 9px 0 0;
      font-size: 14px;
      font-weight: 400;
      color: $labelTextColor;
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
      margin: 0 0 0 26px;
    }
    div {
      display: block;
    }
    .el-button--medium {
      display: block;
      margin: 0 0 21px;
    }
    .el-button {
      width: 98px;
      height: 40px;
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
.prescription-table {
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
    padding: 0 !important;
    font-weight: 700;
  }
  td {
    height: 50px;
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
    font-size: 12px;
  }
  .reviewer-but {
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
  padding-top: 40px;
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
}

.prescription-confirm {
  padding-bottom: 22px;
  .el-message-box__header {
    color: #2c2c2c;
    font-size: 18px;
    padding: 11px 15px 15px;
  }

  .el-message-box__title {
    height: 25px;
    line-height: 25px;
  }

  .el-message-box__btns {
    padding-top: 38px !important;
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
