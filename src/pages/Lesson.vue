<template>
  <div class="container">
    <cogen-header :url="seriesUrl" :title="series.title">
      <router-link slot="left" :to="{name: 'LessonList', params: {seriesId: seriesId}}" replace>返回</router-link>
    </cogen-header>
    <div class="section">
      <h4 class="title">{{lesson.title}}</h4>
      <div>
        <span class="publish-date">{{lesson.updated | dateFormat}}</span>
        <router-link class="public-source" :to="{name: 'LessonList', params: {seriesId: seriesId}}" replace>{{series.title}}</router-link>
      </div>
      <audio-player :audio-url="lesson.mediaPath" :title="lesson.title" :source="series.title" class="audio-player" v-if="lesson.mediaPath">></audio-player>
      <article class="ql-editor" v-html="lesson.content"></article>
      <audio-player :audio-url="lesson.mediaPath2" title="" :source="series.title" class="audio-player" v-if="lesson.mediaPath2"></audio-player>
    </div>

    <div class="visited-count">
      <span class="icon has-text-info">
        <i class="fa fa-eye"></i>
      </span>
      {{lesson.visitedCount}}
    </div>
    <Comments :lessonId="lessonId" :seriesId="seriesId"></Comments>
 
  </div>
</template>

<script>
import AudioPlayer from '../components/AudioPlayer'
import CogenHeader from '../components/CogenHeader'
import Comments from '../components/Comments'
import wechat from '../wechat'

export default {
  name: 'Lesson',
  props: {
    seriesId: { type: String, required: true },
    lessonId: { type: String, required: true }
  },

  computed: {
    seriesUrl () {
      return '/seriesintro/' + this.seriesId
    },
    series () {
      return this.$store.state.series || {}
    }
  },

  data () {
    return {
      lesson: { mediaPath: '', mediaPath2: '' }
    }
  },

  activated () {
    this.loadLesson()
  },
  deactivated () {
    this.lesson = { mediaPath: '', mediaPath2: '' }
  },

  methods: {
    loadLesson () {
      this.$store.dispatch('getLesson', { seriesId: this.seriesId, lessonId: this.lessonId }).then((lesson) => {
        this.lesson = lesson
        wechat.wxShare({title: this.lesson.title, desc: this.series.title})

        if (!this.lesson._visited) {
          this.$store.dispatch('incVisitedCount', {lessonId: this.lessonId}).then(() => {
            this.lesson.visitedCount += 1
            this.lesson._visited = true
          })
        }
        if (this.lesson.unread) {
          this.$store.dispatch('forwardLearningProgress', {seriesId: this.seriesId}).then((learningProgress) => {
            this.series.learingProgress = learningProgress
            this.lesson.unread = false
          })
        }
      })
    }
  },
  components: {
    AudioPlayer,
    CogenHeader,
    Comments
  }
}
</script>

<style scoped>

.audio-player {
  margin-top: 10px;
  margin-bottom: 10px;
}
.visited-count {
  float: left;
  margin-top: 1rem;
  margin-left: 2rem;
}
</style>
