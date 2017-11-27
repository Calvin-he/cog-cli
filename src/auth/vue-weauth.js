const weauth = {
  _accessToken: null,
  _user: null,

  authFailed () {
    this._accessToken = null
    this._user = null
  },

  getUserData () {
    return this._user
  },

  hasAuth () {
    return this._accessToken != null && this._user != null
  }
}

export default {
  install (Vue, { router, axios, appid }) {
    if (router == null) {
      console.error('Please use Plugin VueRouter first')
    }
    if (axios == null) {
      console.error('Please use Plugin VueAxios first')
    }
    Vue.weauth = weauth

    Object.defineProperties(Vue.prototype, {
      weauth: {
        get () {
          return weauth
        }
      }
    })

    axios.interceptors.request.use((config) => {
      if (weauth.hasAuth()) {
        config.headers['Authorization'] = weauth._accessToken
      }
      return config
    })

    router.beforeEach((to, from, next) => {
      if (weauth.hasAuth()) {
        next()
      } else {
        if (to.query.code != null && to.query.state != null) {
          // if redirect from wechat
          axios.get('/auth', {params: {
            origin: 'wechat',
            code: to.query.code,
            state: to.query.state
          }}).then(response => {
            weauth._user = response.data.user
            next()
          })
        } else {
          // jump to wechat auth url
          let fullPath = encodeURIComponent(location.protocol + '//' + location.hostname + to.fullPath)
          let wechatUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${fullPath}&response_type=code&scope=snsapi_base&state=Rzyyxx#wechat_redirect`
          window.location.href = wechatUrl
        }
      }
    })
  }

}
