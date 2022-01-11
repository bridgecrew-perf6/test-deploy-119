<template>
  <div class="attestation-record-msgbox">
    <el-dialog
      :visible.sync="operateRecordStatus"
      width="800px"
      title=""
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <div class="msgbox">
        <div class="header">操作记录</div>

      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'OperateRecord',
  props: {
    operateRecordStatus: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {

    }
  },
  computed: {

  },
  methods: {
    closeDialog() {
      this.$emit('update:operateRecordStatus', false)
    }
  }
}
</script>
<style lang="scss">
.attestation-record-msgbox {
  .el-dialog {
    //height: 550px;
    margin-top: 213px !important;
  }
  .el-dialog__body {
    padding: 10px 13px 23px 29px;
  }
  .msgbox {
    .header {
      line-height: 25px;
      color: #2c2c2c;
      font-size: 18px;
      padding-bottom: 14px;
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
