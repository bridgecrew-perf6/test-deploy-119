<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <img :src="loginImgUrl" class="login-img">
      <div class="title-container">臻络互联网医院管理平台</div>

      <el-form-item prop="account">
        <el-input
          ref="account"
          :value="loginForm.account"
          placeholder="请输入账号"
          name="account"
          type="text"
          tabindex="1"
          autocomplete="on"
          maxlength="11"
          @input="inputUserName"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <el-input
            ref="password"
            :value="loginForm.password"
            type="password"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            maxlength="8"
            @keyup.native="checkCapslock"
            @keyup.enter.native="handleLogin"
            @focus="focusPassword"
            @input="inputPassword"
            @blur="blurPassword"
          />
          <!-- <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span> -->
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        class="login-but"
        :disabled="!isLogin"
        @click.native.prevent="handleLogin"
      >登录</el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      loginImgUrl: require('../../assets/login/login.svg'),
      loginForm: {
        account: 'zhang',
        password: '123456'
      },
      passwordType: '',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      isPasswordSave: false,
      isLogin: true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.account === '') {
      this.$refs.account.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      console.log(this.loginForm)

      // if (this.loginForm.account) {
      // }
      // if (this.loginForm.password) {
      // }
      // this.$refs.loginForm.validate((valid) => {
      //   if (valid) {
      this.loading = true
      this.$store
        .dispatch('user/login', this.loginForm)
        .then(() => {
          this.$router.push({
            path: this.redirect || '/prescription/prescription-list/index',
            query: this.otherQuery
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      // } else {
      //   console.log("error submit!!");
      //   return false;
      // }
      // });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    inputUserName(e) {
      if (e.indexOf('-') === -1 && !isNaN(e)) {
        this.loginForm.account = e
      }
    },
    focusPassword(e) {
      if (!this.loginForm.account) {
        this.$message.error('请先输入账号')
        this.isPasswordSave = false
        return
      }
      if (this.loginForm.account.length < 11) {
        this.$message.error('请输入正确的账号')
        this.isPasswordSave = false
        return
      }
      this.isPasswordSave = true
    },

    inputPassword(e) {
      if (!e) {
        console.log(e)
        this.loginForm.password = ''
      }
      const reg = /^[a-zA-Z0-9]+$/
      if (!this.isPasswordSave) {
        return
      }
      if (reg.test(e)) {
        this.loginForm.password = e
      }
      if (this.loginForm.password.length >= 8) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    blurPassword() {
      if (this.loginForm.password.length < 8) {
        this.$message.error('密码至少八位')
      }
    }
  }
}
</script>

<style lang="scss">
$bg: #ffffff;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-img {
    width: 200px;
    height: 16px;
    display: block;
    margin: auto;
  }
  .login-form {
    width: 460px;
    height: 296px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .title-container {
    height: 56px;
    line-height: 56px;
    font-weight: 700;
    color: #73a5c3;
    font-size: 40px;
    margin-bottom: 32px;
    text-align: center;
  }
  .el-form-item {
    width: 300px;
    margin: auto;
    margin-bottom: 10px;
  }
  .el-input__inner {
    // width: 300px;
    height: 44px;
    line-height: 44px;
    background-color: #ffffff;
    border: 1px solid;
    border-color: #e6e6e6;
    border-radius: 4px;
    padding: 0 9px;
    color: #2c2c2c;
  }
  .show-pwd {
    position: absolute;
    right: 20px;
    line-height: 44px;
  }
  .login-but {
    width: 300px;
    height: 44px;
    background-color: #73a5c3;
    border-color: #73a5c3;
    border-radius: 4px;
    margin: auto;
    margin-top: 27px;
    display: block;
    font-weight: 700;
    color: #ffffff;
    font-size: 16px;
  }
  .is-disabled {
    background-color: #c0c4cc;
    border-color: #c0c4cc;
  }
}
</style>
