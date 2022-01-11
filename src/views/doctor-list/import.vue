<template>
  <el-dialog
    :visible.sync="isVisible"
    width="500px"
    title="此操作将修改医生认证状态，请先上传认证成功的图片！"
    :close-on-click-modal="false"
    destroy-on-close
    class="doctor-import-dialog"
    :before-close="cancel"
  >
    <div class="import-box">
      <single-image-upload
        class="upload-contents"
        :value="imgValue"
        :limit="1"
        show-file-list
        @uploadedFileData="uploadedFileData"
      />
      <div class="but-box">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="save()">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import SingleImageUpload from '@/components/Upload/SingleImage'
import { mapGetters } from 'vuex'
export default {
  components: { SingleImageUpload },
  props: { url: String },
  data() {
    return {
      isVisible: false,
      tableData: {},

      imgValue: ''
    }
  },
  computed: {
    ...mapGetters(['addUploadFile'])
  },
  mounted() {},
  methods: {
    init() {
      this.isVisible = true
    },
    showImport() {
      this.isVisible = true
    },

    cancel() {
      this.isVisible = false
      this.$store.dispatch('upload/delUploadFile')
    },
    save() {
      console.log(this.fileList)
      if (this.addUploadFile.length <= 0) {
        this.$confirm('请先上传认证成功的图片，再更改状态！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'change-confirm-tip'
        })
          .then(() => {})
          .catch(() => {})
      } else {
        // this.$refs.upload.submit()
        this.$emit('sendUploadEmit', this.addUploadFile)
      }
    },
    templateDownload() {
      console.log('下载---')
    },
    success() {
      this.$message({
        message: '上传成功！',
        type: 'success'
      })
      this.isVisible = false
      this.fileList = []
    },

    // 获取上传子组件的上传回调
    uploadedFileData({ url, objectKey }) {
      this.imgValue = url
      // this.doctorData.doctorFace = objectKey
      console.log(objectKey)
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.flex {
  display: flex;
}
.doctor-import-dialog {
  .el-dialog {
    min-height: 500px;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: 0 !important;
  }
  .el-dialog__body {
    padding: 27px 0 50px 0;
  }

  .el-dialog__header {
    padding: 50px 0 0;
    text-align: center;
    color: #606266;
    font-size: 14px;
    line-height: 20px;
  }
  .import-box {
    background: #fff;
    padding: 0 30px;
    font-size: 13px;

    .upload-demo,
    .el-upload-dragger {
      width: 350px;
      margin: auto;
    }
    .upload-demo {
      margin: auto;
    }
    .el-icon-upload {
      width: 48px;
      height: 36px;
      background: url(../../assets/drug/import.svg) no-repeat;
    }
    .el-icon-upload:before {
      content: "";
    }
    .el-upload-dragger .el-upload__text em {
      color: #457b9e;
    }
    .tip-but-box {
      justify-content: space-between;
      align-items: center;
      margin: 12px 0 18px;
      color: #c0c4cc;
      font-size: 13px;

      .template-download {
        width: 110px;
        height: 28px;
        line-height: 28px;
        color: #457b9e;
        font-size: 14px;
        background-color: #eaf3f8;
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
      }
    }
    .but-box {
      width: 190px;
      display: flex;
      justify-content: space-between;
      margin: auto;
      padding-top: 52px;
      button {
        padding: 0;
        line-height: 32px;
      }

      .el-button--default {
        width: 80px;
        height: 32px;
        line-height: 32px;
        background-color: #e2e8ed;
        color: #99a8bc;
        font-size: 13px;
        font-weight: 700;
        padding: 0;
      }
      .el-button--primary {
        width: 80px;
        height: 32px;
        background-color: #73a5c3;
        border-color: #73a5c3;
        border-radius: 4px;
        color: #ffffff;
      }
    }
  }
}

.upload-contents{
  .image-uploader{
    width: 100%!important;
    float: none!important;
    .el-upload-list{
      width: 350px;
      margin: auto;
    }
  }
  .desc{
    width: 350px;
    margin: 13px auto 0;
  }
}
</style>
