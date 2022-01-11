<template>
  <div class="info-msgbox-edit">
    <el-dialog
      :visible.sync="infoEditStatus"
      width="800px"
      title=""
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <div class="step-box">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="基本信息" @click.native="anchorPoint('base')" />
          <el-step title="资质证信息" @click.native="anchorPoint('practice')" />
          <el-step title="执业证信息" @click.native="anchorPoint('qualification')" />
          <el-step title="账号信息" @click.native="anchorPoint('account')" />
        </el-steps>
      </div>
      <div class="msgbox">
        <div class="msgbox-boxs scroll-box">
          <div class="msgbox-box">
            <div id="base" class="header">基本信息</div>
            <div class="header-tip">上传照片(医务人员一寸照）</div>

            <single-image-upload
              class="upload-contents"
              :value="imgValue"
              :limit="1"
              @uploadedFileData="uploadedFileData"
            />

            <el-form
              ref="doctorData"
              :model="doctorData"
              :rules="doctorRules"
              label-width="130px"
              class="demo-form"
              :inline="true"
            >
              <div v-for="(data, index) in formList" :id="index" :key="index">
                <div class="header" :style="index==='doctor'?'padding-top:40px':''">{{ data.name }}</div>
                <div class="form-item-box">
                  <div v-for="(item, i) in data.list" :key="i">
                    <el-form-item
                      v-if="item.type === 'text'"
                      :label="item.name"
                      :prop="item.key"
                      :class="!item.left ? 'label-right' : ''"
                    >
                      <el-input
                        v-model="doctorData[item.key]"
                        :disabled="infoEditModal==='view' || item.disabled || false"
                        :placeholder="item.placeholder || '请输入' + item.name"
                      />
                    </el-form-item>
                    <el-form-item
                      v-if="item.type === 'select'"
                      :label="item.name"
                      :prop="item.key"
                      :class="!item.left ? 'label-right' : ''"
                    >
                      <el-select
                        v-model="doctorData[item.key]"
                        :disabled="infoEditModal==='view'"
                        :placeholder="item.placeholder || '请选择'"
                      >
                        <el-option
                          v-for="list in item.option"
                          :key="list.value"
                          :label="list.key"
                          :value="list.value"
                        >{{ list.key }}</el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      v-if="item.type === 'date'"
                      :label="item.name"
                      :prop="item.key"
                      :class="!item.left ? 'label-right' : ''"
                    >
                      <el-date-picker
                        v-model="doctorData[item.key]"
                        :disabled="infoEditModal==='view'"
                        type="date"
                        :picker-options="datePickerDisabled"
                        value-format="yyyy-MM-dd"
                        :placeholder="item.placeholder || '请选择' + item.name"
                      />
                    </el-form-item>
                    <el-form-item
                      v-if="item.type === 'selectTwo'"
                      :label="item.name"
                      :prop="item.key"
                      class="title"
                      :class="!item.left ? 'label-right' : ''"
                    >
                      <el-select
                        v-model="doctorData[item.key]"
                        :disabled="infoEditModal==='view'"
                        :placeholder="item.placeholder || '请选择'"
                      >
                        <el-option
                          v-for="list in item.option"
                          :key="list.value"
                          :label="list.key"
                          :value="list.value"
                        />
                      </el-select>
                      <el-select
                        v-model="doctorData[item.key2]"
                        :disabled="infoEditModal==='view'"
                        :placeholder="item.placeholder || '请选择'"
                      >
                        <el-option
                          v-for="list in item.option2"
                          :key="list.value"
                          :label="list.key"
                          :value="list.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      v-if="item.type === 'radio'"
                      :label="item.name"
                      :prop="item.key"
                      :class="!item.left ? 'label-right' : ''"
                    >
                      <el-radio-group
                        v-model="doctorData[item.key]"
                        :disabled="infoEditModal==='view'"
                        @change="testRadioGroup"
                      >
                        <el-radio
                          v-for="list in item.option"
                          :key="list.value"
                          :label="list.value"
                          :value="list.value"
                        >{{ list.key }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </div>
                </div>
              </div>

              <el-form-item v-if="infoEditModal==='edit'" class="submit-item">
                <el-button
                  v-debounce="[()=>submitForm('doctorData'),`click`,500]"
                  type="text"
                  size="small"
                  class="show-detail"
                >提交</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import debounce from '@/directive/debounce'
import { doctorVerify, getList } from '@/api/doctor'
import { checkUserIdCard } from '@/utils/checkIdCardValid'
import SingleImageUpload from '@/components/Upload/SingleImage'
import moment from 'moment'

export default {
  components: { SingleImageUpload },
  directives: { debounce },
  props: {
    // dialog的显示 隐藏状态
    infoEditStatus: {
      type: Boolean,
      default: false
    },
    // 当前页面的模式
    infoEditModal: {
      type: String,
      default: 'view',
      validator: (val) => ['view', 'edit'].includes(val)
    },
    // 当前医生的信息
    currentDoctorInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    // 验证idcard
    const selfIdCardCheck = (rule, value, callback) => {
      setTimeout(() => {
        if (
          !checkUserIdCard(value)
        ) {
          callback(new Error('身份证格式错误'))
        } else {
          callback()
        }
      }, 100)
    }
    const phoneValid = (rule, value, callback) => {
      setTimeout(() => {
        if (!/^1\d{10}$/.test(value)) {
          callback(new Error('手机号格式不正确'))
        } else {
          callback()
        }
      }, 100)
    }
    const emailValid = (rule, value, callback) => {
      setTimeout(() => {
        if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      }, 100)
    }
    return {
      isVisible: false,
      detailData: {},
      isCertificate: true,
      isDoctorLicense: 0,
      active: 0,
      formList: {
        doctor: {
          name: '医务人员信息',
          list: [
            {
              key: 'name',
              name: '姓名',
              placeholder: '请输入医务人员姓名',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'sex',
              name: '性别',
              placeholder: '请选择',
              required: true,
              trigger: 'change',
              type: 'select',
              option: [
                { key: '男', value: 1 },
                { key: '女', value: 2 }
              ]
            },
            {
              key: 'idCardNo',
              name: '身份证号',
              placeholder: '请输入医务人员身份证号',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'birthday',
              name: '出生日期',
              placeholder: '请选择出生日期',
              required: true,
              trigger: 'blur',
              type: 'date'
            },
            {
              key: 'title',
              key2: 'titleDeputy',
              name: '职称',
              placeholder: '请选择',
              required: true,
              trigger: 'change',
              type: 'selectTwo',
              option: [
                { key: '主任医师', value: '主任医师' },
                { key: '副主任医师', value: '副主任医师' },
                { key: '主治医师', value: '主治医师' }
              ],
              option2: [
                { key: '主任医师', value: '主任医师' },
                { key: '副主任医师', value: '副主任医师' },
                { key: '主治医师', value: '主治医师' }
              ],
              left: true
            },
            {
              key: 'identityVerify',
              name: '是否完成实名认证',
              placeholder: '请选择活实名认证',
              required: true,
              trigger: 'change',
              type: 'radio',
              option: [
                { key: '是', value: 2 },
                { key: '否', value: 1 }
              ],
              br: true,
              left: true
            }
          ]
        },
        practice: {
          name: '资格认证信息',
          list: [
            {
              key: 'qualificationCode',
              name: '医师资格证号',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'qualificationOrg',
              name: '发证机关',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'qualificationIssuer',
              name: '签发人',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'qualificationNum',
              name: '证书编号',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'education',
              name: '学历',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'graduationSchool',
              name: '毕业院校',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'major',
              name: '专业',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'qualificationType',
              name: '类别',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'qualificationTime',
              name: '发证日期',
              required: true,
              trigger: 'blur',
              type: 'date',
              left: true
            }
          ]
        },
        qualification: {
          name: '执业认证信息',
          list: [
            {
              key: 'certificateCode',
              name: '编码',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'certificateOrg',
              name: '发证机关',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'certificateIssuer',
              name: '签发人',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'certificateTime',
              name: '发证日期',
              required: true,
              trigger: 'blur',
              type: 'date'
            },
            {
              key: 'certificateQualification',
              name: '医师资格',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'certificateBookCode',
              name: '证书编号',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'certificateNum',
              name: '医师执业证号',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'certificateType',
              name: '执业类别',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'certificateScope',
              name: '执业范围',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'certificateSection',
              name: '科室',
              required: true,
              trigger: 'blur',
              type: 'text'
            },
            {
              key: 'certificateCity',
              name: '城市',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'certificateAddress',
              name: '联系地址',
              required: true,
              trigger: 'blur',
              type: 'text'
            }
          ]
        },
        account: {
          name: '账号信息',
          list: [
            {
              key: 'cellphone',
              name: '手机号码',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            }
          ]
        },
        set: {
          name: '设置账号信息',
          list: [
            {
              key: 'email',
              name: '医务人员邮箱',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true
            },
            {
              key: 'securityQuestion',
              name: '安全保护问题',
              required: true,
              trigger: 'blur',
              type: 'text',
              disabled: true
            },
            {
              key: 'securityAnswer',
              name: '安全保护答案',
              required: true,
              trigger: 'blur',
              type: 'text',
              br: true,
              left: true,
              disabled: true
            },
            {
              key: 'securityPassword',
              name: '登录密码',
              required: true,
              trigger: 'blur',
              type: 'text',
              left: true,
              disabled: true
            },
            {
              key: 'rePassword',
              name: '再输入一次',
              required: true,
              trigger: 'blur',
              type: 'text',
              disabled: true
            }
          ]
        }
      },
      doctorData: {
        doctorId: '',
        name: '',
        sex: '',
        idCardNo: '',
        birthday: '',
        title: '',
        titleDeputy: '',
        identityVerify: '',
        qualificationCode: '',
        qualificationOrg: '',
        qualificationIssuer: '',
        qualificationNum: '',
        education: '',
        graduationSchool: '',
        major: '',
        qualificationType: '',
        qualificationTime: '',
        certificateCode: '',
        certificateOrg: '',
        certificateIssuer: '',
        certificateTime: '',
        certificateQualification: '',
        certificateBookCode: '',
        certificateNum: '',
        certificateType: '',
        certificateScope: '',
        certificateSection: '',
        certificateCity: '',
        certificateAddress: '',
        cellphone: '',
        email: '',
        securityQuestion: '我的出生地',
        securityAnswer: '臻络',
        securityPassword: 'Zhenluo123',
        rePassword: 'Zhenluo123'
      },
      doctorRules: {
        name: [{ required: true, message: '请输入医务人员姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择', trigger: 'change' }],
        idCardNo: [{ required: true, message: '请选择日期', trigger: 'blur' }, {
          validator: selfIdCardCheck,
          message: '身份证格式错误',
          trigger: 'blur'
        }],
        birthday: [{ required: true, message: '请选择时间' }],
        title: [{ required: true, message: '请职称', trigger: 'change' }],
        titleDeputy: [{ required: true, message: '请职称', trigger: 'change' }],
        identityVerify: [{ required: true, message: '请选择活实名认证', trigger: 'change' }],

        qualificationCode: [{ required: true, message: '请输入医师资格证号', trigger: 'blur' }],
        qualificationOrg: [{ required: true, message: '请输入发证机关', trigger: 'blur' }],
        qualificationIssuer: [{ required: true, message: '请输入签发人', trigger: 'blur' }],
        qualificationNum: [{ required: true, message: '请输入证书编号', trigger: 'blur' }],
        education: [{ required: true, message: '请输入学历', trigger: 'blur' }],
        graduationSchool: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }],
        major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
        qualificationType: [{ required: true, message: '请输入类别', trigger: 'blur' }],
        qualificationTime: [{ required: true, message: '请输入发证日期', trigger: 'blur' }],

        certificateCode: [{ required: true, message: '请输入编码', trigger: 'blur' }],
        certificateOrg: [{ required: true, message: '请输入发证机关', trigger: 'blur' }],
        certificateIssuer: [{ required: true, message: '请输入签发人', trigger: 'blur' }],
        certificateTime: [{ required: true, message: '请输入发证日期', trigger: 'blur' }],
        certificateQualification: [{ required: true, message: '请输入医师资格', trigger: 'blur' }],
        certificateBookCode: [{ required: true, message: '请输入证书编号', trigger: 'blur' }],
        certificateNum: [{ required: true, message: '请输入医师执业证号', trigger: 'blur' }],
        certificateType: [{ required: true, message: '请输入执业类别', trigger: 'blur' }],
        certificateScope: [{ required: true, message: '请输入执业范围', trigger: 'blur' }],
        certificateSection: [{ required: true, message: '请输入科室', trigger: 'blur' }],
        certificateCity: [{ required: true, message: '请输入城市', trigger: 'blur' }],
        certificateAddress: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
        cellphone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }, {
          validator: phoneValid,
          message: '手机号格式不正确',
          trigger: 'blur'
        }],
        email: [
          { required: true, message: '请输入医务人员邮箱', trigger: 'blur' }, {
            validator: emailValid,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        securityQuestion: [
          { required: true, message: '请输入安全保护问题', trigger: 'blur' }
        ],
        securityAnswer: [
          { required: true, message: '请输入安全保护答案', trigger: 'blur' }
        ],
        securityPassword: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
        rePassword: [{ required: true, message: '请再输入一次', trigger: 'blur' }]
      },
      datePickerDisabled: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }, // 日期组件禁用的时段

      // 默认的问题答题，目前写死，后面更新
      defaultAnswerValues: {
        securityQuestion: '我的出生地',
        securityAnswer: '臻络',
        securityPassword: 'Zhenluo123',
        rePassword: 'Zhenluo123'
      },

      imgValue: ''// 上传的图片url

    }
  },
  mounted() {
    // 查询认证信息
    // console.log(this.currentDoctorInfo)
    // this.$nextTick(() => {
    //   // this.currentDoctorInfo && this.getVerifyInfo()
    //   this.getVerifyInfo()
    // })
    // 查询认证的默认信息（问题、答案）
  },
  methods: {
    init(e) {
      this.detailData = e
      this.isVisible = true
    },
    changeSteps(index) {
      this.active = index
      console.log(index)
      console.log(this.$refs.doctorData)
      this.$refs.doctorData.validate((valid) => {
        // if (valid) {
        // } else {
        //   console.log('error submit!!')
        //   return false
        // }
      })
    },
    closeDialog() {
      this.$emit('update:infoEditStatus', false)
      this.$store.dispatch('upload/delUploadFile')
    },
    anchorPoint(id) {
      document.querySelector('#' + id).scrollIntoView()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        // console.log(JSON.stringify(this.doctorData, null, 4))

        if (valid) {
          this.saveDoctorVerify()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存医生的资料信息
    saveDoctorVerify() {
      this.doctorData = {
        ...this.doctorData,
        // doctorFace: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-3de7816e-149a-4557-ab4c-4650a76eda4e/9cf80ade-903e-4f19-83a1-2abeac1b4d90.png',
        doctorId: this.currentDoctorInfo.doctorId
      }
      doctorVerify(this.doctorData, 'put').then(response => {
        this.$message({ message: '提交成功', type: 'success' })
      })
    },
    // 查询认证信息
    getVerifyInfo() {
      doctorVerify(this.formData, 'get', `${this.currentDoctorInfo.doctorId}`).then((response) => {
        const { data } = response
        this.doctorData = { ...data, ...this.defaultAnswerValues }
        // 往vuex中存储上传的文件信息
        if (data?.doctorFace) {
          this.imgValue = data.doctorFaceUrl
          const fileUpload = {
            expiration: moment().add(1, 'hours').valueOf(),
            objectKey: data.doctorFace,
            url: data.doctorFaceUrl
          }
          this.$store.dispatch('upload/addUploadFile', fileUpload)
        }
      })
    },
    // 查询默认认证信息
    getDefautVerifyInfo() {
      getList(this.formData).then((response) => {
        const { data } = response
        console.log(data)
        this.total = data.total
        this.tableData = data.records
      })
    },
    // 获取上传子组件的上传回调
    uploadedFileData({ url, objectKey }) {
      this.imgValue = url
      this.doctorData.doctorFace = objectKey
    },

    testRadioGroup(e) {
      console.log(e)
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.info-msgbox-edit {
  .el-dialog {
    height: 750px;
    margin-top: 120px !important;
  }
  .el-dialog__body {
    padding: 0 0 23px 0;
  }
  .el-dialog__header {
    padding: 15px 0 10px;
  }
  .step-box {
    border-bottom: 1px solid #e2e2e2;
    padding: 0 0 22px 0;
    .el-steps {
      margin: 0 146px 0 156px;
      .el-step {
        cursor: pointer;
      }
      .is-process {
        color: #73a5c3;
        font-size: 16px;
      }
      .is-wait {
        color: #c0c4cc;
        font-size: 14px;
      }
      .el-step__head {
        height: 14px;
        font-size: 12px;
        .el-step__line {
          top: 6px;
        }
      }
      .el-step__main {
        padding-top: 6px;
        .el-step__title {
          line-height: 22px;
        }
      }
      .is-wait .el-step__icon {
        width: 14px;
        height: 14px;
        background-color: #e2e2e2;
        color: #e2e2e2;
        border: none;
      }
      .is-process .el-step__icon {
        width: 14px;
        height: 14px;
        background-color: #73a5c3;
        color: #73a5c3;
        border: none;
      }
      .is-success .el-step__icon {
        width: 14px;
        height: 14px;
        //background-color: #e2e2e2;
        //color: #e2e2e2;
        border: solid 1px;
      }
    }
  }
  .msgbox {
    padding: 22px 13px 0 62px;
    .msgbox-boxs {
      height: 630px;
    }
    .msgbox-box {
      .header {
        line-height: 25px;
        color: #2c2c2c;
        font-size: 18px;
        font-weight: 700;
      }
      .header-tip {
        padding: 12px 0;
        line-height: 20px;
        font-weight: 700;
        color: #99a8bc;
        font-size: 14px;
      }
      .upload-img {
        // width: 128px;
        // height: 160px;
        .el-upload-dragger {
          width: 128px;
          height: 160px;
          padding: 0 22px;
          border-color: #a1c0d6;
          font-size: 12px;
          div {
            font-size: 12px;
          }
          .el-icon-upload {
            width: 48px;
            height: 36px;
            background: url(../../assets/drug/import.svg) no-repeat;
          }
          .el-icon-upload:before {
            content: "";
          }
        }
        .el-upload__tip {
          color: #c0c4cc;
          font-size: 13px;
          line-height: 18px;
          margin: 12px 0 18px;
        }
      }
      .form-item-box {
        display: flex;
        flex-wrap: wrap;
        padding-top: 12px;
        div {
          flex-shrink: 0;
        }
        .br {
          width: 100%;
          .el-form-item {
            width: 100%;
          }
        }
        .el-form-item--medium {
          margin-right: 12px;
        }
      }
      .demo-form {
        font-size: 14px;
        padding: 12px 0 21px;

        .header {
          padding-top: 12px;
          :first-child {
            padding-top: 0;
          }
        }

        .el-form-item__label {
          color: #404040;
          padding: 0 8px 0 0;
          height: 39px;
          line-height: 39px;
        }
        input {
          height: 39px;
          line-height: 39px;
          width: 220px;
          //padding: 10px;
        }
        .sex,
        .date,
        .label-right {
          .el-form-item__label {
            width: auto !important;
          }
        }
        .date {
          .el-input__prefix {
            display: none;
          }
        }
        .sex {
          input {
            width: 100px;
          }
        }
        .title {
          input {
            width: 160px;
          }
          .el-select {
            margin-right: 10px;
          }
        }
      }
      .submit-item{
        display: block;
        text-align: center;
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

      //定制上传组件的大小
      .upload-contents{
        .image-preview{
          width: 131px;
          height: 160px;
          margin-left: 9px;
        }
        .desc{
          position: relative;
          top: 170px;
          left: -185px!important;
        }
        .image-uploader{
          width: 128px!important;
          float: left!important;
          .el-upload-dragger{
            height: 160px;
            .el-upload__text{
              font-size: 12px;
              padding: 0 22px;
            }
          }
        }
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
