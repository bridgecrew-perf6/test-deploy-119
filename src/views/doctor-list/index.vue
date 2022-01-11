<template>
  <div class="doctor-content">
    <el-form
      ref="formData"
      :inline="true"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="doctor-search-form"
    >
      <div class="search-left">
        <div class="search-left-first">
          <el-form-item label="关键字" class="keyword" prop="a">
            <el-autocomplete
              v-model="formData.keyword"
              class="inline-input"
              popper-class="doctor-name"
              :fetch-suggestions="querySearch"
              placeholder="支持通过医生ID，医生，手机号码，临床职称，科室，医院名称 进行查询"
              :maxlength="30"
              clearable
              @input="handleInput"
              @select="handleSelect"
              @keyup.enter.native="submitForm('formData')"
            >
              <template slot-scope="{ item }">
                <div class="name">
                  <div v-for="(text, index) in item.arr" :key="index">
                    <span v-if="index > 0" class="key">{{ formData.a }}</span>
                    <span>{{ text }}</span>
                  </div>
                </div>
              </template>
            </el-autocomplete>
          </el-form-item>

          <el-form-item label="人工初审状态" prop="b" class="select-box">
            <el-select v-model="formData.trialVerify" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in eeStatus"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="四川监管认证状态"
            prop="otcType"
            class="select-box"
          >
            <el-select v-model="formData.multiSitedVerify" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in ffStatus"
                :key="index"
                :label="item"
                :value="index"
              />
            </el-select>
          </el-form-item>
          <date-time-range-form-item
            ref="timeSelectRangeFormBySubmitTime"
            label="认证资料提交时间"
            @setDateTimeRangeChange="setDateTimeRangeChange"
          />
        </div>
      </div>
      <div class="search-but">
        <el-form-item>
          <el-button v-debounce="[()=>resetForm('formData'),`click`,500]">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            v-debounce="[()=>submitForm('formData'),`click`,500]"
            :class="{'disableBtnClass':!searchBtnAvailable}"
            type="primary"
          >查询</el-button>
        </el-form-item>
      </div>
    </el-form>

    <el-table :data="tableData" border style="width: 100%" class="doctor-table">
      <el-table-column fixed label="序号" width="42">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="doctorId" label="医生ID" width="80" />
      <el-table-column prop="name" label="医生" width="*" />
      <el-table-column prop="cellphone" label="手机号" width="120" />
      <el-table-column prop="submitTimes" label="认证资料" width="100">
        <template slot-scope="{row:{submitTimes,submitTimesDes},row}">
          <div v-if="submitTimes===0">{{ submitTimesDes }}</div>
          <div v-else class="text-color" @click="showRecord(row, 1,{})">{{ submitTimesDes }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="trialVerify" label="人工初审核状态" width="118">
        <template v-slot="{row:{trialVerify},row}">
          <div v-if="trialVerify!==1">{{ statusNameFormat(trialVerify,'trialVerify') }}</div>
          <div v-else class="text-color" @click="showRecord(row, 2,{})">{{ statusNameFormat(trialVerify,'trialVerify') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="multiSitedVerify" label="四川监管认证状态" width="145">
        <template v-slot="{row:{multiSitedVerify,verifyInfo},row}">
          <div v-if="multiSitedVerify!==1">{{ statusNameFormat(multiSitedVerify,'multiSitedVerify') }}</div>
          <div v-else class="text-color" @click="showRecord(row, 4,{verifyInfo})">{{ statusNameFormat(multiSitedVerify,'multiSitedVerify') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="gg" label="认证记录" width="91">
        <template slot-scope="scope">
          <div class="text-color" @click="showRecord(scope.row, 6,{verifyInfo:scope.row.verifyInfo})">
            点击查看
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="caVerify" label="CA认证" width="91">
        <template v-slot="{row:{caVerify,verifyInfo},row}">
          <div v-if="caVerify!==1">{{ statusNameFormat(caVerify,'caVerify') }}</div>
          <div v-else class="text-color" @click="showRecord(row, 7,{verifyInfo})">{{ statusNameFormat(caVerify,'caVerify') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="identityVerify" label="实名认证" width="98">
        <template v-slot="{row:{identityVerify,verifyInfo},row}">
          <div v-if="identityVerify!==1">{{ statusNameFormat(identityVerify,'identityVerify') }}</div>
          <div v-else class="text-color" @click="showRecord(row, 11,{verifyInfo})">{{ statusNameFormat(identityVerify,'identityVerify') }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="认证资料提交时间" width="160" />
      <el-table-column prop="kk" label="操作记录" width="139">
        <template slot-scope="scope">
          <div class="text-color" @click="showRecord(scope.row, 10,{})">
            点击查看
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="241">
        <template slot-scope="scope">
          <div
            v-if="
              scope.row.trialVerify!==1 || scope.row.multiSitedVerify!==1 || (scope.row.trialVerify===2 && scope.row.multiSitedVerify===2)
            "
            id="change-reviewer"
          >
            <div class="reviewer-header">
              <span>变更审核</span>
            </div>
            <div class="reviewer-body">
              <div>
                <div v-for="(items, index) in options" :key="index">
                  <div
                    class="reviewer-body-head"
                    :class="getButton[0] === index ? 'but-show-head' : ''"
                    @click="showReviewer(index,items.code,scope.row)"
                  >
                    {{ items.label }}
                  </div>
                  <div
                    class="reviewer-body-text"
                    :class="getButton[0] === index ? 'but-show' : ''"
                  >
                    <div
                      v-for="(item, i) in items.options"
                      :key="i"
                      :class="getButton[1] === i ? 'but-show-text' : ''"
                      @click="changeReviewer(index, i,item.value,scope.row)"
                    >
                      {{ item.label }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="change-more">
            <div class="more-header">
              <span>更多操作</span>
            </div>
            <div class="more-body">
              <div
                :class="getButton[0] === 0 ? 'but-show-text' : ''"
                @click="changeMore(0,scope.row)"
              >
                CA认证
              </div>

              <div
                :class="getButton[0] === 1 ? 'but-show-text' : ''"
                @click="changeMore(1,scope.row)"
              >
                认证信息
              </div>
              <div
                :class="getButton[0] === 2 ? 'but-show-text' : ''"
                @click="changeMore(2,scope.row)"
              >
                备注
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="formData.size"
      layout="prev, pager, next, jumper"
      :total="total"
      @current-change="changeTableData"
    />
    <Import ref="import" :url="url" @sendUploadEmit="sendUploadEmit" />
    <el-dialog
      title=""
      :visible.sync="isRemarks"
      width="500px"
      class="change-remarks-tip"
      :center="true"
      :before-close="closeRemaks"
    >
      <el-input
        v-model="remarksText"
        v-debounce="[inputRemark,`input`,300]"
        type="textarea"
        placeholder="请输入备注内容……"
        maxlength="500"
        show-word-limit
      />
    </el-dialog>
    <AttestationRecord ref="attestationRecord" />
    <Info ref="info" />
    <InfoEdit
      ref="infoEdit"
      :info-edit-status.sync="infoEditStatus"
      :info-edit-modal="infoEditModal"
      :current-doctor-info="currentDoctorInfo"
    />
    <operate-record
      :operate-record-status.sync="operateRecordStatus"
    />
  </div>
</template>

<script>
import Import from './import.vue'
import AttestationRecord from './attestation-record.vue'
import Info from './info.vue'
import { caVerify, doctorRemark, getAuthDetail, getList, multiVerify, trialVerify, verifyRecordList } from '@/api/doctor'
import DateTimeRangeFormItem from '@/components/CommonForm/DateTimeRangeFormItem'
import * as statusName from '@/constant/authStatus'
import debounce from '@/directive/debounce'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  components: {
    OperateRecord: () => import('@/views/doctor-list/operate-record'),
    DateTimeRangeFormItem,
    Import,
    AttestationRecord,
    Info,
    InfoEdit: () => import('./info-edit.vue')
  },
  directives: { debounce },
  data() {
    return {
      url: '/v1/api/file/upload',
      instructionsImgUrl: require('../../assets/drug/instructions.svg'),
      isDrawer: false,
      formData: {
        current: 1, // 当前页码
        size: 10,
        keyword: '', // 查询关键字
        multiSitedVerify: '', // 四川监管认证状态
        submitTimeEnd: '', // 认证资料提交时间结束
        submitTimeStart: '', // 认证资料提交时间开始
        trialVerify: ''// 人工初审状态
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
      tableData: [],
      total: 0,
      currentPage: 1,
      size: 10,
      detailData: {},
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
      },
      butValue: '',
      options: [
        {
          label: '人工初审状态变更',
          code: 'trialVerify',
          options: [
            {
              value: 2,
              label: '审核通过'
            },
            {
              value: 1,
              label: '审核失败'
            }
          ]
        },
        {
          label: '四川监管认证状态变更',
          code: 'multiSitedVerify',
          options: [
            {
              value: 3,
              label: '认证中'
            },
            {
              value: 2,
              label: '认证通过'
            },
            {
              value: 1,
              label: '认证失败'
            }
          ]
        }
      ],
      isButton: [],
      importData: {
        text: '此操作将修改医生认证状态，请先上传认证成功的图片！',
        isClose: true
      },
      isRemarks: false,
      remarksText: '',
      infoData: {
        a: '阿萨德',
        b: '深圳市第二人民医院',
        c: '神经内科',
        d: '主治医师',
        e: require('@/assets/prescription/fail.svg'),
        f: require('@/assets/prescription/fail.svg'),
        g: require('@/assets/login/login.svg'),
        h: require('@/assets/prescription/fail.svg'),
        i: require('@/assets/prescription/rp.svg')
      },
      currentDoctorInfo: null, // 当前医生的信息
      operateRecordStatus: false, // 操作记录的dialog status
      infoEditStatus: false, // 认证信息编辑页面的状态
      infoEditModal: 'edit', // 认证信息编辑页面的模式(view/edit)，默认是view

      verifyParams: null, // 保存审核 的参数
      searchBtnAvailable: false// 查询按钮的可用状态
    }
  },
  computed: {
    getButton: function() {
      return this.isButton
    },
    // 获取状态的格式化名称
    statusNameFormat() {
      return (status, type) => {
        return statusName[type][status]
      }
    },
    ...mapGetters(['addUploadFile']),
    // 人工初审options data
    eeStatus() {
      // eslint-disable-next-line no-unused-vars
      const { name, ...newVerify } = statusName.trialVerify
      return newVerify
    },
    // 四川平台审核
    ffStatus() {
      // eslint-disable-next-line no-unused-vars
      const { name, ...newVerify } = statusName.multiSitedVerify
      return newVerify
    }
  },
  watch: {
    formData: {
      deep: true,
      immediate: true,
      handler(val) {
        // eslint-disable-next-line no-unused-vars
        const { current, size, ...otherObj } = val
        // 判断除了分页参数之外的参数是否为空，为空则将查询按钮置灰，不查询列表
        const objValues = Object.values(otherObj).every(item => !item)
        this.searchBtnAvailable = !objValues
      }
    }
  },
  mounted() {
    // 药品列表/药品价格列表
    // this.getTableList()
    // this.$refs.infoEdit.init(this.infoData);
  },
  methods: {
    getTableList() {
      getList(this.formData).then((response) => {
        const { data } = response
        this.total = data.total
        this.tableData = data.records
      })
    },
    submitForm(formName) {
      if (!this.searchBtnAvailable) return false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentPage = 1
          const [submitTimeStart = '', submitTimeEnd = ''] = this.$refs.timeSelectRangeFormBySubmitTime.dateTimeRangeValue
          this.formData = {
            ...this.formData,
            submitTimeStart: submitTimeStart ? moment(submitTimeStart).format('YYYY-MM-DD HH:mm:ss') : '',
            submitTimeEnd: submitTimeEnd ? moment(submitTimeEnd).format('YYYY-MM-DD HH:mm:ss') : ''
          }
          this.getTableList()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields()// 重置表单数据
      Object.assign(this.$data.formData, this.$options.data().formData)// 重置data
      this.$refs.timeSelectRangeFormBySubmitTime.$data.dateTimeRangeValue = []// 清空还原日期组件中的data
      this.searchBtnAvailable = false
      // this.getTableList()
    },
    changeTableData(e) {
      this.formData.current = e
      this.getTableList()
    },
    querySearch(queryString, cb) {
      if (queryString) {
        // const data = {
        //   keyword: queryString,
        // };

        // getSearchKeyWord({ data }).then((response) => {
        // var restaurants = response.data;
        var restaurants = [
          'ENG',
          '三公仔',
          '小贴士',
          '太极',
          '信龙',
          '燕鱼',
          '太阳',
          '朗迪',
          '三益',
          '艾纳香'
        ]
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
        // });
        // cb([]);
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
    handleSelect(item) {
      // this.formData.a = item.value
    },
    handleInput(value) {
      // 只能输入汉字、英文、数字
      this.formData.a = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    },
    goShowDetail(row) {
      // getDetail({ id: row.id }).then((response) => {
      //   const arr = []
      //   response.data.images.map((item) => {
      //     arr.push(item.pictureUrl)
      //   })
      //   this.detailData = response.data || {}
      //   this.detailData.imagesArr = arr
      //   this.isDrawer = true
      // })
    },
    changeReview(e, row) {
      console.log(e, row, '122')
    },
    showReviewer(index, code, { trialVerify }) {
      console.log(code, trialVerify)
      if (code === 'multiSitedVerify' && trialVerify !== 2) {
        this.$message({
          message: '人工初审状态通过后才可变更四川监管认证状态',
          type: 'error'
        })
        return
      }

      // console.log(code)
      // console.log(JSON.stringify(row, null, 4))
      const arr = [index]
      this.isButton = arr
    },
    changeReviewer(index, i, verifyStatus, row) {
      const arr = [index, i]
      this.isButton = arr
      if (index === 0 && i === 0) {
        this.$confirm('此操作将修改医生审核状态，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'change-confirm-tip'
        })
          .then(() => {
            const params = {
              ...row,
              auditType: 1, refuseReason: '', successContent: '', verifyStatus
            }
            this.trialVerify(params)
          })
          .catch(() => {})
      }
      if (index === 0 && i === 1) {
        this.$prompt('此操作将修改医生状态，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入审核失败原因',
          customClass: 'change-prompt-tip',
          inputValidator: function(e) {
            if (e) {
              if (e.length > 100) {
                return false
              }
            } else {
              return false
            }
          },
          inputErrorMessage: '请先输入审核失败原因',
          type: 'warning'
        })
          .then(({ value }) => {
            console.log(value)
            const params = {
              ...row,
              auditType: 1, refuseReason: value, successContent: '', verifyStatus
            }
            this.trialVerify(params)
          })
          .catch(() => {})
      }

      if (index === 1 && row.trialVerify !== 2) {
        this.$message({
          message: '人工初审状态通过后才可变更四川监管认证状态',
          type: 'error'
        })
        return
      }

      if (index === 1 && i === 0) {
        this.$confirm(
          '此操作将修改医生状态，医生执业认证资料是否已经上传到四川监管平台？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'change-confirm-tip'
          }
        )
          .then(() => {
            console.log('四川监管平台')
            const params = {
              ...row,
              auditType: 2, refuseReason: '', successContent: '', verifyStatus, detailFiles: ''
            }
            this.multiVerify(params)
          })
          .catch(() => {})
      }
      if (index === 1 && i === 1) {
        const params = {
          ...row,
          auditType: 2, refuseReason: '', successContent: '', verifyStatus
        }
        this.verifyParams = params
        this.$refs.import.init()
      }
      if (index === 1 && i === 2) {
        this.$prompt('此操作将修改医生状态，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入认证失败原因',
          customClass: 'change-prompt-tip',
          inputValidator: function(e) {
            if (e) {
              if (e.length > 100) {
                return false
              }
            } else {
              return false
            }
          },
          inputErrorMessage: '请先输入认证失败原因 ',
          type: 'warning'
        })
          .then(({ value }) => {
            console.log(value)
            console.log('四川监管平台')
            const params = {
              ...row,
              auditType: 2, refuseReason: value, successContent: '', verifyStatus, detailFiles: ''
            }
            this.multiVerify(params)
          })
          .catch(() => {})
      }
    },

    // 人工初审接口和监管平台审核接口
    trialVerify({ auditInfoId, doctorId, auditType, refuseReason, successContent, verifyStatus }) {
      const data = {
        auditInfoId,
        doctorId,
        auditType,
        refuseReason,
        successContent,
        verifyStatus
      }
      trialVerify(data).then(response => {
        console.log(response)
        // this.$message({ message: '提交成功', type: 'success' })
        this.$message({ message: '操作成功', type: 'success' })
        this.getTableList()
      })
    },
    multiVerify({ auditInfoId, doctorId, auditType, refuseReason, successContent, verifyStatus, detailFiles }) {
      const data = {
        auditInfoId,
        doctorId,
        auditType,
        refuseReason,
        successContent,
        verifyStatus,
        detailFiles
      }
      multiVerify(data).then(response => {
        // console.log(response)
        this.$message({ message: '操作成功', type: 'success' })
        this.getTableList()
        this.$store.dispatch('upload/delUploadFile')
      })
    },
    changeMore(index, row) {
      const arr = [index]
      this.isButton = arr
      this.currentDoctorInfo = row
      this.remarksText = row.remark
      if (index === 0) {
        if (!row.verifyStatus || row.verifyStatus !== 1) {
          this.$message.error('请先录入认证信息')
          return false
        }
        this.$confirm('是否确定调用云证书？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'change-confirm-tip'
        })
          .then(() => {
            // ca认证
            this.caVerify()
          })
          .catch(() => {})
      }
      if (index === 1) {
        // this.showRecord(row, 1, {})
        this.infoEditStatus = true
        this.$nextTick(() => {
          this.$refs.infoEdit.getVerifyInfo()
        })
      }
      if (index === 2) {
        this.isRemarks = true
      }
    },
    closeRemaks() {
      console.log(this.remarksText)
      this.isRemarks = false
      this.getTableList()
    },
    showRecord(row, index, { verifyInfo }) {
      console.log(row)
      console.log(index)
      if (index === 1) {
        console.log('N 次提交')
        const { auditInfoId, doctorId } = row
        const queryData = {
          auditInfoId, doctorId
        }
        getAuthDetail(queryData).then((response) => {
          const { data } = response
          this.$refs.info.init(data)
        })
      }
      if (index === 2) {
        console.log('人工初审核状态-审核失败')
        const { refuseReason } = verifyInfo?.find(item => item.auditType === 1) || ''
        this.showDialogMessage('人工初审核状态-审核失败', refuseReason)
      }
      if (index === 3) {
        console.log('人工初审核状态-审核成功')
      }
      if (index === 4) {
        console.log('四川监管认证状态-认证拒绝')
        const { refuseReason } = verifyInfo?.find(item => item.auditType === 2) || ''
        this.showDialogMessage('四川监管认证状态-认证拒绝', refuseReason)
      }
      if (index === 5) {
        console.log('四川监管认证状态-认证通过')
      }
      if (index === 6) {
        console.log('认证记录')
        // 查询认证记录列表
        console.log(JSON.stringify(row, null, 4))
        this.getVerifyRecordList(row.doctorId)
      }
      if (index === 7) {
        console.log('CA认证-认证失败')
        const { refuseReason } = verifyInfo?.find(item => item.auditType === 4)
        this.showDialogMessage('CA认证-认证失败', refuseReason)
      }
      if (index === 8) {
        console.log('CA认证-认证通过')
      }
      if (index === 9) {
        console.log('实名认证-认证通过')
      }
      if (index === 11) {
        console.log('实名认证-认证失败')
        const { refuseReason } = verifyInfo?.find(item => item.auditType === 3)
        this.showDialogMessage('实名认证-认证失败', refuseReason)
      }
      if (index === 10) {
        console.log('操作记录')
        this.operateRecordStatus = true
      }
    },

    // 查询认证记录列表
    getVerifyRecordList(doctorId) {
      const data = { doctorId }
      verifyRecordList(data).then((response) => {
        const { data } = response
        this.$refs.attestationRecord.init(data)
      })
    },

    // 显示审核成功/失败的弹窗
    showDialogMessage(title = '提示', content) {
      this.$confirm(content, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'change-confirm-tip'
      })
        .then(() => {})
        .catch(() => {})
    },

    // 保存备注
    inputRemark() {
      const params = {
        'doctorId': this.currentDoctorInfo.doctorId,
        'remark': this.remarksText
      }
      doctorRemark(params, 'put').then((response) => {
        // console.log(response)
        // const { data } = response
        // console.log(data)
        // this.total = data.total
        // this.tableData = data.records
      })
    },

    sendUploadEmit(addUploadFile) {
      const params = {
        ...this.verifyParams,
        detailFiles: addUploadFile[0].objectKey
      }
      this.multiVerify(params)
    },

    // ca认证
    caVerify() {
      const { currentDoctorInfo: { auditInfoId, doctorId }} = this
      const data = { auditInfoId, doctorId }
      caVerify(data).then(() => {
      })
    },
    // 接收时间控件的传值
    setDateTimeRangeChange(val) {
      console.log(val)
      const [submitTimeStart, submitTimeEnd] = val ?? []
      this.formData = {
        ...this.formData,
        submitTimeStart,
        submitTimeEnd
      }
    }
  }
}
</script>

<style lang="scss">
@import "~@/styles/variables.scss";

.doctor-content {
  padding: 0 48px 0 61px;
}

.doctor-search-form {
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
        width: 450px;
        padding: 0 9px;
      }
    }
    .select-box {
      .el-input__inner {
        width: 116px;
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
      //height: 39px;
      //line-height: 39px;
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
      margin: 0 0 0 18px;
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
.doctor-table {
  th,
  td {
    text-align: center;
    color: $tableTextColor;
    padding: 0 !important;
    > div {
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
  .text-color {
    color: #409eff;
    cursor: pointer;
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

.doctor-name {
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
    display: flex;
  }
  .key {
    color: red;
  }
}
.doctor-table {
  overflow: visible;
  .el-table__body-wrapper,
  .cell {
    overflow: visible;
  }
}
#change-reviewer {
  display: inline-block;
  width: 98px;
  height: 38px;
  cursor: pointer;
  z-index: 999;

  :hover .reviewer-body {
    display: block;
  }

  .reviewer-header {
    width: 100%;
    line-height: 38px;
    background-color: #73a5c3;
    border-radius: 4px;
    font-weight: 700;
    color: #ffffff;
    font-size: 13px;
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    > span::after {
      content: " ";
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-color: #ffffff;
      margin: 8px 0 0 9px;
    }
  }
  .reviewer-body {
    display: none;
    position: absolute;
    top: 38px;
    left: 0;
    width: 206px;
    height: 233px;
    background-color: #ffffff;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
    z-index: 99;
    text-align: left;
    padding-top: 10px;

    .reviewer-body-head {
      padding: 0 15px;
      line-height: 31px;
      color: #2c2c2c;
      font-size: 14px;
    }
    .reviewer-body-text {
      padding: 11px 0 5px;
      display: none;
      > div {
        padding: 0 15px 8px 15px;
        color: #909399;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
  .but-show {
    display: block !important;
  }
  .but-show-head {
    background-color: #f3f6f8;
  }
  .but-show-text {
    color: #409eff !important;
  }
}

#change-reviewer:hover,
.change-more:hover {
  position: relative !important;
}

#change-reviewer:hover .reviewer-body,
.change-more:hover .more-body {
  display: block !important;
}

.change-more {
  display: inline-block;
  width: 98px;
  height: 38px;
  cursor: pointer;
  z-index: 99;
  margin-left: 10px;

  :hover .reviewer-body {
    display: block;
  }

  .more-header {
    width: 100%;
    line-height: 38px;
    background-color: #ffffff;
    border-radius: 4px;
    border: 1px solid #73a5c3;
    font-weight: 700;
    color: #73a5c3;
    font-size: 13px;
    > span {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    > span::after {
      content: " ";
      width: 0;
      height: 0;
      border: 5px solid transparent;
      border-top-color: #73a5c3;
      margin: 8px 0 0 9px;
    }
  }
  .more-body {
    display: none;
    position: absolute;
    top: 40px;
    left: 0;
    width: 206px;
    height: 110px;
    background-color: #ffffff;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.16);
    z-index: 999;
    text-align: left;
    padding: 5px 0;
    > div {
      padding: 6px 11px;
      line-height: 17px;
      color: #2c2c2c;
      font-size: 14px;
    }
  }
  .but-show {
    display: block !important;
  }
  .but-show-text {
    color: #409eff !important;
  }
}

.change-confirm-tip {
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

.change-prompt-tip {
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

.change-remarks-tip {
  .el-dialog__body {
    padding: 10px 19px 34px 18px;
  }
  .el-textarea,
  .el-textarea__inner {
    height: 247px;
  }
  .el-dialog--center {
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: auto !important;
  }
}
.disableBtnClass{
  border-color: #A4ADB3!important;
  background: #A4ADB3!important;
}
.el-table__fixed{
  height: 100%!important;
}
</style>
