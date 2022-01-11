<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }}</h1>
        <div class="sidebar-split" />
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '臻络互联网医院',
      logo: require('@/assets/login/login.svg')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  // height: 50px;
  // line-height: 50px;
  background: #ffffff;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    padding: 36px 0 52px 0;

    & .sidebar-logo {
      // width: 32px;
      // height: 32px;
      // vertical-align: middle;
      // margin-right: 12px;

      width: 177px;
      height: 14px;
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
    }

    & .sidebar-title {
      display: block;
      margin: 0;
      // color: #fff;
      // font-weight: 600;
      // line-height: 50px;
      // font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      // vertical-align: middle;
      line-height: 26px;
      font-weight: 700;
      color: #2c2c2c;
      font-size: 19px;
    }
    .sidebar-split {
      width: 18px;
      height: 0px;
      border: 4px solid #2c2c2c;
      margin: 25px auto 0 auto;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
