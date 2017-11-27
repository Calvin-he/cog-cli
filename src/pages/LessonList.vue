<template>
  <div class="container">
    <cogen-header :url="seriesUrl" :title="series.title">
        <router-link slot="right" class="is-bold is-info" v-if="!isPaid"
          :to="{name: 'Payment', params: {seriesId: seriesId}}">购买</router-link>
    </cogen-header>
    <div class="section">
        <loading :loading="isLoading">
        <div class="media lesson-list-item" v-for="lesson in lessonList" v-bind:key="lesson._id">
          <div class="media-left">
            <a class="button is-primary is-outlined" @click.prevent="play(lesson)">
              <span class="icon">
                <i class="fa fa-lock" v-if="!lesson.mediaPath"></i>
                <i class="fa fa-pause" v-else-if="lesson === currentPlayingLesson"></i>
                <i class="fa fa-play" v-else></i>
              </span>
            </a>
          </div>
          <div class="media-content" @click.stop="gotoLesson(lesson)">
            <h4 class="subtitle is-6">{{lesson.title}}</h4>
          </div>
          <div class="media-right" @click.stop="gotoLesson(lesson)">
            <span class=" icon ">
              <i class="fa fa-angle-right "></i>
            </span>
          </div>
        </div>
        </loading>
    </div>
    <audio src=""></audio>
  </div>
</template>

<script>
// import InfiniteLoading from 'vue-infinite-loading'
import Loading from '../components/Loading'
import CogenHeader from '../components/CogenHeader'
import wechat from '../wechat'

export default {
  name: 'LessonList',
  props: {
    seriesId: {
      type: String,
      required: true
    },
    fresh: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // series: {},
      // lessons: [],
      isLoading: false,
      currentPlayingLesson: null
    }
  },
  computed: {
    seriesUrl () {
      return '/seriesintro/' + this.seriesId
    },
    lessonList () {
      if (this.$store.state.series && this.$store.state.series.lessons) {
        return [...this.$store.state.series.lessons].reverse()
      } else {
        return []
      }
    },
    isPaid () {
      return this.series.paidInfo != null
    },
    series () {
      return this.$store.state.series || {}
    }

  },
  activated () {
    this.isLoading = true
    this.$store.dispatch('getSeries', { seriesId: this.seriesId, fresh: this.fresh }).then((series) => {
      // this.series = series
      this.$store.dispatch('queryLesson', { seriesId: this.seriesId }).then((lessons) => {
        wechat.wxShare({ title: this.series.title, desc: this.series.desc })
        // this.lessons = lessons
        this.isLoading = false
      })
    })
  },
  mounted () {
    this.audio = this.$el.getElementsByTagName('audio')[0]
    this.audio.addEventListener('ended', this.eventPlayEnd, false)
  },
  methods: {
    gotoLesson (lesson) {
      if (lesson.mediaPath) {
        this.$router.push({ name: 'Lesson', params: { lessonId: lesson._id, seriesId: this.series._id } })
      } else {
        this.$store.dispatch('showMessage', { msg: lesson._locked_msg, level: 'warning' })
      }
    },

    play (lesson) {
      if (!lesson.mediaPath) {
        return
      } else if (lesson !== this.currentPlayingLesson) {
        this.currentPlayingLesson = lesson
        this.audio.src = lesson.mediaPath
        this.audio.play()
      } else {
        this.currentPlayingLesson = null
        this.audio.src = ''
      }
    },
    eventPlayEnd () {
      let lessonList = this.lessonList
      if (this.currentPlayingLesson) {
        let idx = lessonList.indexOf(this.currentPlayingLesson)
        this.currentPlayingLesson = null
        if (idx >= 0 && idx < lessonList.length - 1) {
          this.play(lessonList[idx + 1])
        }
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (this.currentPlayingLesson != null) {
      this.currentPlayingLesson = null
      this.audio.pause()
      this.audio.src = ''
    }
    next()
  },

  components: {
    Loading,
    CogenHeader
  }
}
</script>

<style lang="scss">
.section {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.lesson-list-item {
  align-items: center;
}
</style>
