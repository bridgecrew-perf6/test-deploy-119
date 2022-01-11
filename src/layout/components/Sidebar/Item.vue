<script>
import eventBus from '@/event-bus'
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    but: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title, but } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<svg-icon icon-class={icon} />)
      }
    }

    if (title) {
      vnodes.push(<span slot='title' >{title}</span>)
    }
    // 导入组件弹出触发
    if (but) {
      vnodes.push(
        <span slot='title' class='but' v-on:click={() => eventBus.$emit('UPLOADFILE')} >
          {but}
        </span>
      )
    }

    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.but {
  display: inline-block;
  width: 67px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid;
  border-color: #73a5c3;
  border-radius: 4px;
  background-color: #eaf3f8;
  position: absolute;
  top: 11px;
  right: 18px;
}
</style>
