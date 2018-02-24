<template>
  <div class="section" id="comment-list">
    <div class="is-flex" style="justify-content:flex-end">
      <a @click="addComment" style="">我要留言
        <span class="icon">
          <i class="fa fa-edit"></i>
        </span>
      </a>
    </div>
    <hr>
    <div class="media" v-for="c in commentList" :key="c._id">
      <figure class="media-left">
        <p class="image is-32x32">
          <img :src="c.userAvatar">
        </p>
      </figure>
      <div class="media-content">
        <div class="level is-mobile">
          <div class="level-left"><strong>{{c.userNickname}}</strong></div>
          <div class="level-right">
            <span class="icon has-text-danger" style="margin-right:10px" title="删除" @click="deleteComment(c._id)" v-if="canDelete(c.userId)">
              <i class="fa fa-remove"></i>
            </span>
            <span class="icon has-text-success" style="margin-right:10px" @click="replyComment(c)" v-if="canReply(c.userId)">
              <i class="fa fa-reply"></i>
            </span>
            {{c.created | datetimeFormat}}       
          </div>
        </div>    
        <p>{{c.content}}</p>
        <div class="media" v-for="(reply, index) in c.replies" :key=index>
          <figure class="media-left">
          <p class="image is-32x32">
            <img :src="reply.userAvatar">
          </p>
          </figure>
          <div class="media-content">
            <div class="level is-mobile">
              <div class="level-left"><strong>{{reply.userNickname}}</strong></div>
              <div class="level-right">
                <span class="icon has-text-danger" style="margin-right:10px" @click="deleteReply(c, index)" v-if="canReply(c.userId)">
                  <i class="fa fa-remove"></i>
                </span>
                {{reply.created | datetimeFormat}}
              </div>
            </div>    
            <p>
              {{reply.content}}
            </p>
          </div>
      </div>
      </div>
    </div>
  
    <div class="modal" :class="{'is-active': showCommentModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">@{{lessonTitle}}</p>
          <button class="delete is-large" @click="showCommentModal=false"></button>
        </header>
        <section class="modal-card-body" style="padding:0">
          <textarea class="textarea" placeholder="字数必须多于3个字，少于500字" rows="10" ref="commentTextarea" v-model="comment"></textarea>
        </section>
        <footer class="modal-card-foot">
          <button type="submit" class="button is-success full-width" @click="submitComment">提交</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Comments',
  props: {
    lessonId: {
      type: String,
      required: true
    },
    seriesId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      comment: '',
      showCommentModal: false,
      commentList: [],
      lessonTitle: '',
      repliedComment: null
    }
  },

  activated () {
    this.$store.dispatch('getLesson', { seriesId: this.seriesId, lessonId: this.lessonId }).then((lesson) => {
      this.lessonTitle = lesson.title
    })
    this.loadComments()
  },
  deactivated () {
    this.lessonTitle = ''
    this.comment = ''
    this.showCommentModal = false
    this.commentList = []
  },
  methods: {
    addComment () {
      this.showCommentModal = true
      this.repliedComment = null
      setTimeout(() => {
        this.$refs.commentTextarea.focus()
      }, 300)
    },
    submitComment () {
      if (this.comment.length <= 3 || this.comment.length >= 500) {
        return false
      }
      if (this.repliedComment == null) {
        this.$store.dispatch('addComment', { lessonId: this.lessonId, content: this.comment }).then((comment) => {
          this.commentList = [comment, ...this.commentList]
          this.showCommentModal = false
          this.comment = ''
        }).catch(err => {
          console.warn(err)
        })
      } else {
        let user = this.$auth.user()
        let comment = {
          content: this.comment,
          userNickname: user.nickname,
          userAvatar: user.avatar
        }
        this.$store.dispatch('replyComment', {lessonId: this.lessonId, commentId: this.repliedComment._id, reply: comment}).then((reply) => {
          this.repliedComment.replies.push(reply)
          this.showCommentModal = false
          this.comment = ''
        })
      }
    },
    loadComments () {
      this.$store.dispatch('listComments', { lessonId: this.lessonId }).then((comments) => {
        this.commentList = comments
      })
    },
    deleteComment (commentId) {
      this.$store.dispatch('deleteComment', {lessonId: this.lessonId, commentId: commentId}).then(() => {
        this.commentList = this.commentList.filter(c => c._id !== commentId)
      })
    },
    canDelete (userId) {
      let user = this.$auth.user()
      return user.roles.indexOf('ROLE_ADMIN') !== -1 || user._id === userId
    },
    canReply (comment) {
      return this.$auth.user().roles.indexOf('ROLE_ADMIN') !== -1
    },
    replyComment (comment) {
      this.showCommentModal = true
      this.repliedComment = comment
    },
    deleteReply (comment, index) {
      this.$store.dispatch('deleteReply', {lessonId: this.lessonId, commentId: comment._id, index: index}).then(() => {
        comment.replies.splice(index, 1)
      })
    }
  },
  components: {
    InfiniteLoading
  }
}</script>

<style scoped>
#comment-list {
  background-color: ghostwhite;
}
.media-content {
  word-break: break-word;
}
</style>
