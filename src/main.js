// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import * as filters from './filters'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import wx from './wechat'

// if (window.location.search.indexOf('from=singlemessage')) {
//   window.location.href = window.location.origin + window.location.pathname + window.location.hash
// }

Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = '/api/1.0'
Vue.axios.defaults.timeout = 20000
wx.config()

document.addEventListener('DOMContentLoaded', function () {
  if (window.FastClick) window.FastClick.attach(document.body)
}, false)

Vue.router = router
Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      req.headers.authorization = token
      // this.options.http._setHeaders.call(this, req, {Authorization: token})
    },
    response: function (res) {
      // Get Token from response body
      // var token = this.options._getHeaders.call(this, res).Authorization
      let token = res.data.token
      return token
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: '/auth/login', method: 'POST', fetchUser: false },
  refreshData: { enabled: false }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },

  beforeMount () {
    // Add a response interceptor
    Vue.axios.interceptors.response.use(function (response) {
      return response
    }, (err) => {
      if (err.response.status === 403) {
        Vue.$auth.logout({
          redirect: '/login',
          makeRequest: false
        })
      } else {
        return err
      }
    })
  }

})
