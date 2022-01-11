<template>
  <el-dialog
    :visible.sync="isVisible"
    width="500px"
    title=""
    :close-on-click-modal="false"
    :show-close="false"
    class="import-dialog"
  >
    <div class="import-box">
      <el-upload
        ref="upload"
        class="upload-demo"
        drag
        :action="url"
        multiple
        :auto-upload="false"
        :file-list="fileList"
        :limit="1"
        :on-exceed="handleExceed"
        :before-remove="beforeRemove"
        :headers="headers"
        :on-success="success"
        :on-change="handleFileList"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip flex tip-but-box">
          <div>支持扩展名:xlsx，且不超过1MB</div>
          <a href="/static/excel/drug.xlsx" download class="template-download" @click="templateDownload">
            点击下载模板
          </a>
        </div>
      </el-upload>
      <div slot="tip" class="but-box">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="success" @click="save()">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import eventBus from '@/event-bus'
import { getToken } from '@/utils/auth'
export default {
  components: {},
  props: { url: String, callback: Function },
  data() {
    return {
      isVisible: false,
      tableData: {},
      fileList: [],
      headers: {
        Authorization: 'Bearer  ' + getToken()
      }
    }
  },
  mounted() {
    eventBus.$on('UPLOADFILE', () => {
      this.isVisible = true
    })
  },
  beforeDestroy() {
    eventBus.$off('UPLOADFILE')
  },
  methods: {
    showImport() {
      this.isVisible = true
    },
    // handle 文件获取成功后将fileList文件数修改
    handleFileList(file, fileList) {
      this.fileList = fileList
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      console.log('fileList :>> ', fileList)
      return this.$confirm(`确定移除 ${file.name}？`, '', { type: 'warning' })
    },
    changeFile(file, fileList) {
      console.log(file, fileList)
    },
    cancel() {
      this.isVisible = false
    },
    save() {
      if (this.fileList.length >= 1) {
        this.$refs.upload.submit()
      } else {
        this.$message({
          message: '请先选择文件！',
          type: 'warning'
        })
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
      this.$refs.upload.clearFiles()
      this.isVisible = false
      this.fileList = []
      this.callback()
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.flex {
  display: flex;
}
.import-dialog {
  .el-dialog {
    min-height: 320px;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    margin-top: 0 !important;
  }
  .import-box {
    background: #fff;
    padding: 0 30px;
    font-size: 13px;

    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 50px 0 40px 0;
    }

    .upload-demo,
    .el-upload-dragger {
      width: 350px;
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
      .el-button--primary,
      .el-button--success {
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
</style>
