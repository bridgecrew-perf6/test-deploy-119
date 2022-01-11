<template>
  <el-form-item :label="label">
    <el-row>
      <el-col v-if="tooltip" :span="1">
        <el-tooltip
          class="item"
          effect="dark"
          :content="tooltip"
          placement="top-start"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </el-col>
      <el-col :span="23">
        <el-date-picker
          v-model="dateTimeRangeValue"
          :type="dateType"
          :value-format="valueFormat"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          @change="dateTimeRangeChange"
        />
      </el-col>
    </el-row>

  </el-form-item>
</template>

<script>
import moment from 'moment'
import { datePickerShortCus, disabledSelectDate } from '@/constant/time'

export default {
  name: 'DateTimeRangeFormItem',
  props: {
    // label名称
    label: {
      type: String,
      default: 'none'
    },
    // 日期时间格式
    valueFormat: {
      type: String,
      default: 'timestamp'
    },
    // 默认查询天数
    searchDay: {
      type: String,
      default: '0'
    },
    // 是否有提示，比如提示最多可查询xxx天的数据
    tooltip: {
      type: String,
      default: ''
    },
    // 最大可查询的天数
    maxSearchDay: {
      type: String
    },
    dateType: {
      type: String,
      default: 'datetimerange',
      validator: val => ['daterange', 'datetimerange'].includes(val)
    }
  },
  data() {
    return {
      pickerOptions: {
        ...disabledSelectDate,
        shortcuts: datePickerShortCus
      },
      dateTimeRangeValue: []
    }
  },
  watch: {
    dateTimeRangeValue(val) {
      if (val === null) {
        this.dateTimeRangeValue = []
      } else if (+this.maxSearchDay > 0) {
        const [start, end] = val
        if ((start + (+this.maxSearchDay) * 24 * 3600 * 1000) < end) {
          // this.$self.selfMessage(this.tooltip, 'error')
          this.dateTimeRangeValue = []
        }
      }
    }
  },
  created() {
    if (+this.searchDay > 0) {
      this.dateTimeRangeValue = [
        moment().subtract(+this.searchDay, 'day').valueOf(),
        moment().valueOf()
      ]
    }
  },
  methods: {
    // 向父组件传递控件的值
    dateTimeRangeChange(val) {
      this.$emit('setDateTimeRangeChange', val)
    }
  }
}
</script>

<style scoped>

</style>
