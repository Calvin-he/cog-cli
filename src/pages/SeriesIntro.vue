<template>
  <div class="container">
    <figure class="image">
      <img :src="series.bannerPath">
    </figure>

    <div class="section">
      <h4 class="title is-4">{{series.title}}</h4>
      <p v-html="series.desc"></p>
    </div>
    <hr style="margin: 0">
    <div class="section">
      <h4 class="title is-4">购买须知</h4>
      <div>价格: ￥{{series.price}}  
        <span class="icon has-text-primary is-pulled-right"><i class="fa fa-user"></i>  {{series.purchaseCount}}</span>
      </div>
      <p v-html="series.noticeForPurchase"></p> 
      <p> 已有{{series.purchaseCount}}人购买此课程</p>
    </div>

    <div class="footer">  
      <div class="columns is-mobile" v-if="!isPaid()">
        <div class="column">
          <a class=" button is-primary is-outlined" @click="gotoLessonList">试课</a>
        </div>
        <div class="column">
          <a class="button is-primary" @click.stop.prevent="gotoPayment">购买</a>
        </div>
      </div>
      <div class="columns is-mobile" v-else>
        <div class="column">
          <a class="button is-primary is-outlined" @click.stop.prevent="gotoLessonList">查看课程列表</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CogenHeader from '../components/CogenHeader'
import wechat from '../wechat'

export default {
  name: 'SeriesIntro',
  props: {
    seriesId: {
      type: String,
      requried: true
    }
  },
  data () {
    return {
    }
  },

  computed: {
    seriesUrl () {
      return '/seriesintro/' + this.seriesId
    },
    series () {
      return this.$store.state.series || {}
    }
  },

  activated () {
    if (this.series._id) {
      wechat.wxShare({ title: this.series.title, desc: this.series.desc })
    } else {
      setTimeout(() => {
        wechat.wxShare({ title: this.series.title, desc: this.series.desc })
      }, 2000)
    }
  },

  mounted () {
    let seriesId = this.seriesId
    this.$store.dispatch('getSeries', { seriesId }).then((series) => {
      if (this.isPaid()) {
        this.$router.push({name: 'LessonList', params: {seriesId}})
      }
    }).catch((error) => {
      console.error(error)
      // this.series = { title: '课程不存在' }
    })
  },

  methods: {
    gotoLessonList () {
      this.$router.push({ name: 'LessonList', params: { seriesId: this.series._id } })
    },

    gotoPayment () {
      if (this.$auth.user.isTemp) {
        this.$store.dispatch('showMessage', { msg: '请先关注公众号！', level: 'warning' })
        return
      } else {
        this.$router.push({ name: 'Payment', params: { seriesId: this.series._id } })
      }
    },
    isPaid () {
      return this.series.learningProgress != null
    }
  },

  components: {
    CogenHeader
  }
}
</script>


<style scoped>
.banner {
  width: 100%;
}

.footer .button {
  width: 100%;
}
</style>
