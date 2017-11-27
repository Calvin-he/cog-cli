<template>
  <div>
    <cogen-header :url="seriesUrl" :title="series.title"></cogen-header>
    <div class="section">
      <h4 class="title is-4">商品信息</h4>
      <div class="columns is-mobile">
        <div class="column is-4">名称</div>
        <div class="column">{{series.title}}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">价格</div>
        <div class="column">￥{{series.price}}</div>
      </div>
    </div>
    <hr/>
    <div class="section">
      <h4 class="title is-4">个人信息</h4>
      <div class="columns is-mobile">
        <div class="column is-4">头像</div>
        <div class="column">
          <figure class="image is-64x64">
            <img :src="user.avatar">
          </figure>
        </div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">昵称</div>
        <div class="column">{{user.nickname || user.username}}</div>
      </div>
      <div class="columns is-mobile">
        <div class="column is-4">性别</div>
        <div class="column">{{userSex}}</div>
      </div>
      <!--div class="columns is-mobile">
                  <div class="column is-4">手机号码</div>
                  <div class="column">{{user.phoneNo}}</div>
                </div -->
    </div>
    <div class="footer">
      <div class="columns is-mobile">
        <div class="column">
          <a class=" button is-primary is-fullwidth" :class="{'is-loading': paying}" @click="startWxPay" v-if="!isPaid">付款</a>
          <a class="button is-primary is-outlined is-fullwidth" @click.stop.prevent="gotoLessonList" v-else>查看课程列表</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CogenHeader from '../components/CogenHeader'
import wx from '../wechat'

export default {
  name: 'Payment',
  props: {
    seriesId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      user: this.$auth.user(),
      paying: false
    }
  },
  computed: {
    seriesUrl () {
      return '/seriesintro/' + this.seriesId
    },
    userSex () {
      switch (this.user.sex) {
        case 1:
          return '男'
        case 2:
          return '女'
        default:
          return '未知'
      }
    },
    isPaid () {
      return this.series.paidInfo != null
    },
    series () {
      return this.$store.state.series || {}
    }
  },
  mounted () {
    let seriesId = this.seriesId
    this.$store.dispatch('getSeries', { seriesId }).then((series) => {
      // this.series = series
    }).catch((error) => {
      console.error(error)
      // this.series = { title: '课程不存在' }
    })
  },
  methods: {
    startWxPay () {
      this.paying = true
      if (/micromessenger/.test(navigator.userAgent.toLowerCase())) {
        this.$store.dispatch('getSeriesPayParams', { seriesId: this.seriesId }).then((payparams) => {
          wx.pay(payparams, (res) => {
            this._checkPayStateAfterSuccess(payparams.out_trade_no)
          }, (res) => {
            this.paying = false
            this.$store.dispatch('showMessage', { msg: '支付失败!', level: 'warning' })
          })
        })
      } else {
        this.axios.get(`/series/${this.seriesId}/wxpay_debug`).then((res) => {
          console.log(res.status)
          this.paying = false
          this.$store.dispatch('showMessage', { msg: '支付成功!', level: 'info' })
          this.$router.push({ name: 'LessonList', params: { seriesId: this.seriesId, fresh: true } })
          // window.location.reload()
        })
      }
    },

    _checkPayStateAfterSuccess (outTradeNo) {
      setTimeout(() => {
        this.$store.dispatch('getPayState', { seriesId: this.seriesId, outTradeNo: outTradeNo }).then(state => {
          if (state === 'prepay') {
            this._checkPayStateAfterSuccess(outTradeNo)
          } else if (state === 'success') {
            this.paying = false
            this.$store.dispatch('showMessage', { msg: '支付成功!', level: 'info' })
            this.$router.push({ name: 'LessonList', params: { seriesId: this.seriesId, fresh: true } })
            // window.location.reload()
          } else {
            this.paying = false
            this.$store.dispatch('showMessage', { msg: '支付失败！', level: 'warning' })
          }
        })
      }, 3000)
    },
    gotoLessonList () {
      this.$router.replace({ name: 'LessonList', params: { seriesId: this.seriesId } })
    }
  },
  components: {
    CogenHeader
  }
}
</script>
