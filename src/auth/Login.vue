<template>
  <div v-if="isWechatBrowser()">
    微信登录中...
  </div>
  <div class="box" v-else>
    <h1 class="title is-4 has-text-centered">用户登录</h1>
    <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
    <form v-on:submit.prevent="loginByUsername">
      <div class="field is-horizontal is-mobile">
        <div class="field-label is-normal">
          <label class="label">用户名</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input v-model="username" class="input" type="text" placeholder="">
            </div>
          </div>
        </div>
      </div>
  
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">密码</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input v-model="password" class="input" type="password" placeholder="">
            </div>
          </div>
        </div>
      </div>
  
      <div class="field">
      <p class="control">
        <label class="checkbox">
          <input type="checkbox" v-model="rememberMe"> Remember me
        </label>
      </p>
      </div>
  
      <hr>
      <p class="control">
        <button type="submit" class="button is-primary is-fullwidth" :class="{'is-loading': logging}">登录</button>
      </p>
    </form>
  </div>
</template>

<script>
function parseSearchString () {
  let queryString = window.location.search
  if (queryString[0] === '?') {
    queryString = queryString.substring(1)
  }
  var obj = {}
  queryString.split('&').forEach(item => {
    let idx = item.indexOf('=')
    if (idx !== -1) {
      let name = item.substring(0, idx)
      obj[name] = item.substring(idx + 1)
    } else {
      let name = item.substring(0)
      obj[name] = ''
    }
  })
  return obj
}

export default {
  data () {
    return {
      username: '',
      password: '',
      rememberMe: false,
      error: null,
      logging: false
    }
  },

  mounted () {
    // console.log('user', this.$auth.user)
    if (this.isWechatBrowser()) {
      this.loginWechat()
    }
  },
  methods: {
    isWechatBrowser () {
      let ua = navigator.userAgent.toLowerCase()
      return (/micromessenger/.test(ua))
      // return false
    },

    loginWechat () {
      let redirect = this.$auth.redirect()
      if (!redirect) {
        return
      }
      let search = parseSearchString()
      let wxstate = 'wechat'
      if (!search.code || search.state !== wxstate) {
        let portStr = location.port ? (':' + location.port) : ''
        let fullPath = encodeURIComponent(location.protocol + '//' + location.hostname + portStr + location.pathname + '#' + redirect.from.path)
        this.axios.get(`/wechat/authorize_url?redirect_url=${fullPath}&state=${wxstate}`).then(res => {
          location.href = res.data.authorize_url
        })
      } else {
        // console.log('browsing2 from: ' + redirect.from.path)
        this.$auth.login({
          data: { code: search.code, state: search.state, origin: 'wechat' },
          rememberMe: true,
          redirect: null,
          success (res) {
            console.log('Auth Success')
            this.$auth.user(res.user)
            this.logging = true
            let portStr = location.port ? (':' + location.port) : ''
            window.location.href = location.protocol + '//' + location.hostname + portStr + location.pathname + '?#' + redirect.from.path
          },
          error (err) {
            console.log('err: ', err)
            if (err.response) {
              this.error = err.response.data
            } else {
              console.log('Error', err.message)
            }
            this.logging = false
          }
        })
      }
    },

    loginByUsername () {
      if (!this.username || !this.password) {
        this.error = '用户名或密码不能为空'
        return
      }
      let redirectPath = this.$auth.redirect() ? this.$auth.redirect().from.fullPath : '/'
      this.logging = true
      this.$auth.login({
        data: { username: this.username, password: this.password, origin: 'cogen' },
        rememberMe: this.rememberMe,
        redirect: { path: redirectPath },
        success (res) {
          console.log('Auth Success')
          this.$auth.user(res.user)
          this.logging = false
        },
        error (err) {
          console.log('err: ', err)
          if (err.response) {
            this.error = err.response.data
          } else {
            console.log('Error', err.message)
          }
          this.logging = false
        }
      })
    }
  }
}
</script>

<style>

</style>
