<template>
  <div class="upload-container">
    <el-upload
      ref="uploadFileRef"
      :data="dataObj"
      :multiple="false"
      :show-file-list="showFileList"
      :on-success="handleImageSuccess"
      class="image-uploader"
      drag
      :action="action"

      :file-list="handleFileList"
      :limit="limit"
      :accept="imageAccept"
      :headers="headers"
      :on-remove="handleRemoveFile"
      :before-remove="beforeRemove"

      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>

    <template v-if="addUploadFile.length && !showFileList">
      <div v-for="(items,index) in addUploadFile" :key="items.expiration" class="image-preview">

        <div class="image-preview-wrapper">
          <el-image
            style="width: 100%;height: 100%;"
            :src="items.url"
            fit="cover"
          >
            <div slot="placeholder" class="image-slot">
              <i class="el-icon-loading" />
            </div>
          </el-image>
          <div v-if="items.url" class="image-preview-action">
            <i class="el-icon-delete" @click="handleRemove(index)" />
          </div>
        </div>
      </div>
    </template>
    <!--    上传说明-->
    <slot name="upload-desc"> <div class="desc">支持扩展名:jpg/png，且不超过{{ fileMaxSize }}MB</div></slot>

  </div>
</template>

<script>
import { IMAGE_SUFFIX_ALLOWED_TO_UPLOAD } from '@/constant/upload'
import { mapGetters } from 'vuex'

export default {
  name: 'SingleImageUpload',
  props: {
    // 文件上传的地址
    action: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/file/uploadAndGetObjectUrl'
    },
    // 图片的地址
    value: {
      type: String,
      default: ''
    },
    // 允许上传的文件个数
    limit: {
      type: Number,
      default: 1
    },
    // 接收的上传文件后缀
    imageAccept: {
      type: String,
      default: IMAGE_SUFFIX_ALLOWED_TO_UPLOAD.join()
    },
    // 是否显示上传的文件列表
    showFileList: {
      type: Boolean,
      default: false
    },
    // 允许上传的文件大小，单位MB
    fileMaxSize: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      tempUrl: '',
      dataObj: { token: '', key: '' },
      handleFileList: [], // 已添加的文件列表
      headers: {
        Authorization: 'Bearer  ' + this.$store.getters.token
      }

    }
  },
  computed: {
    imageUrl() {
      return this.value
    },
    ...mapGetters(['addUploadFile'])
  },
  methods: {
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess({ code, data }) {
      if (code === 200) {
        this.$store.dispatch('upload/addUploadFile', data)
        this.$emit('uploadedFileData', data)
      }
    },

    // 上传之前的校验
    beforeUpload(file) {
      const suffix = IMAGE_SUFFIX_ALLOWED_TO_UPLOAD
      const fileSuffix = `.${file.name.substring(file.name.lastIndexOf('.') + 1)}`.toLocaleLowerCase()
      // console.log(fileSuffix);

      if (!suffix.includes(fileSuffix)) {
        this.$message.error(`只能上传${suffix.join('和').replaceAll('.', '')}的照片`)
      }
      const isLt2M = file.size / 1024 / 1024 <= this.fileMaxSize// 最大上传2MB
      if (!isLt2M) {
        this.$message.error('单张上传照片大小不能超过 ' + this.fileMaxSize + 'MB')
      }
      return suffix.includes(fileSuffix) && isLt2M
    },

    // 上传之前的校验
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    // // 添加文件行为
    // async onChange(files, fileList) {
    //   const validFileSuffix = await this.beforeUpload(files)
    //   if (validFileSuffix) {
    //     this.selectFileList = [...fileList]
    //     console.log(JSON.stringify(this.selectFileList, null, 4))
    //   } else {
    //     console.log(validFileSuffix)
    //     if (!validFileSuffix) {
    //       this.handleRemove(files, true)
    //       return false
    //     }
    //   }
    // },
    // 自定义删除文件
    handleRemove(index) {
      this.$confirm('此操作将删除该照片，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'change-confirm-tip'
      })
        .then(() => {
          this.$store.dispatch('upload/delUploadFile', index)
        })
        .catch(() => {})
    },
    // 当展示文件列表中，后面的删除文件钩子
    handleRemoveFile(file, fileList) {
      if (file.response.code === 200) {
        const index = this.addUploadFile.findIndex(item => item === file.response.data)
        this.$store.dispatch('upload/delUploadFile', index)
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定删除 ${file.name}？`)
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "~@/styles/mixin.scss";
    .upload-container {
        width: 100%;
        position: relative;
        @include clearfix;
        .image-uploader {
            width: 60%;
            float: left;
        }
        .image-preview {
            width: 200px;
            height: 200px;
            position: relative;
            border: 1px dashed #d9d9d9;
            float: left;
            margin-left: 50px;
            .image-preview-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
              .image-slot{
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
            .image-preview-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0, 0, 0, .5);
                transition: opacity .3s;
                cursor: pointer;
                text-align: center;
                line-height: 200px;
                .el-icon-delete {
                    font-size: 36px;
                }
            }
            &:hover {
                .image-preview-action {
                    opacity: 1;
                }
            }
        }

      .desc{
        color:#c0c4cc;
        font-size:13px;
        margin-top: 12px;
      }
    }

</style>
