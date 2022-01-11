import moment from 'moment'

const disabledSelectDate = { // element日期选择器，设置今天以后不可选
  disabledDate(time) {
    return time.getTime() > Date.now()
  }
}

const datePickerShortCus = [{
  text: '昨天',
  onClick(picker) {
    picker.$emit('pick', [
      moment().subtract(1, 'days').startOf('day').valueOf(),
      moment().subtract(1, 'days').endOf('day').valueOf()
    ])
  }
}, {
  text: '今天',
  onClick(picker) {
    picker.$emit('pick', [
      moment().startOf('days').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
}, {
  text: '最近三天',
  onClick(picker) {
    picker.$emit('pick', [
      moment().subtract(3, 'days').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
}, {
  text: '最近一周',
  onClick(picker) {
    picker.$emit('pick', [
      moment().subtract(1, 'weeks').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
},
{
  text: '本周',
  onClick(picker) {
    picker.$emit('pick', [
      moment().locale('zh-cn').startOf('week').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
},
{
  text: '最近一个月',
  onClick(picker) {
    picker.$emit('pick', [
      moment().subtract(1, 'months').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
},

{
  text: '本月',
  onClick(picker) {
    picker.$emit('pick', [
      moment().startOf('months').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
},
{
  text: '最近三个月',
  onClick(picker) {
    picker.$emit('pick', [
      moment().subtract(3, 'months').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
}, {
  text: '最近半年',
  onClick(picker) {
    picker.$emit('pick', [
      moment().subtract(6, 'months').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
},
{
  text: '本年度',
  onClick(picker) {
    picker.$emit('pick', [
      moment().startOf('years').valueOf(),
      moment().endOf('day').valueOf()
    ])
  }
}
]

export {
  disabledSelectDate,
  datePickerShortCus
}
