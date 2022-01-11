<template>
  <div class="splits tip-text">
    <div class="">特别提示</div>
    <div v-for="(item, index) in hotTip" :key="index">
      {{ index + 1 }}.{{ item }}
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      hotTip: [
        '处方有效期为3天，请及时取药。',
        '本处方限于臻络互联网医院使用，自行下载配药不具有处方效力。',
        '按照卫生部、国家中医药管理局卫医发[2002]24号文件规定：为保证患者用药安全，药品一经发出，不得退换。',
        '服用3天症状未见好转，建议及时复诊或线下就医。'
      ]
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";

.flex {
  display: flex;
}

.splits {
  border-top: 3px solid $tipColor;
}
.split {
  border-top: 1px solid $tipColor;
}

.tip-text {
  padding: 9px 0;
  > div {
    color: $msgboxTextColor;
    font-size: 12px;
    line-height: 20px;
  }
}
</style>
