import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  series: {lessons: []},
  appId: null,
  messageEvent: null
}

const actions = {
  getSeries ({ commit, state }, {seriesId, paidInfo, fresh}) {
    if (seriesId === state.series._id && !fresh) {
      return Promise.resolve(state.series)
    } else {
      return Vue.axios.get('/series/' + seriesId).then((response) => {
        let seriesObj = response.data
        commit('SET_SERIES', seriesObj)
        return state.series
      })
    }
  },
  queryLesson ({ dispatch, commit, state }, {seriesId, paidInfo}) {
    return dispatch('getSeries', {seriesId}).then((series) => {
      if (series.lessons) {
        return series.lessons
      } else {
        return Vue.axios.get(`/series/${seriesId}/lessons`).then((response) => {
          let lessons = response.data
          if (series.learningProgress != null) {
            let curProgress = series.learningProgress.curProgress
            if (curProgress < lessons.length && lessons[curProgress].content) {
              lessons[curProgress].unread = true
            }
          }
          Vue.set(series, 'lessons', lessons)
          return series.lessons
        })
      }
    })
  },
  getLesson ({dispatch, commit, state}, {seriesId, lessonId}) {
    return dispatch('queryLesson', {seriesId}).then((lessons) => {
      let lesson = lessons.find((les) => les._id === lessonId)
      if (lesson.content) {
        return lesson
      } else {
        return Vue.axios.get(`/series/${seriesId}/lessons/${lessonId}`).then((response) => {
          Object.assign(lesson, response.data)
          return lesson
        })
      }
    })
  },
  forwardLearningProgress ({dispatch, state}, {seriesId}) {
    Vue.axios.put(`/series/${seriesId}/forward-learning-progress`).then(response => {
      return response.data
    })
  },

  listComments ({dispatch}, {lessonId}) {
    return Vue.axios.get(`/lessons/${lessonId}/comments/`).then((response) => {
      return response.data
    })
  },

  addComment ({dispatch}, {lessonId, content}) {
    return Vue.axios.post(`/lessons/${lessonId}/comments/`, {content}).then((response) => {
      return response.data
    })
  },

  deleteComment ({dispatch}, {lessonId, commentId}) {
    return Vue.axios.delete(`/lessons/${lessonId}/comments/${commentId}`)
  },

  getSeriesPayParams ({dispatch}, {seriesId}) {
    return Vue.axios.get(`/series/${seriesId}/wxpay`).then((response) => {
      return response.data
    })
  },

  getPayState ({dispatch}, {seriesId}) {
    return Vue.axios.get(`/series/${seriesId}/check_paystate`).then(response => {
      return response.data.state
    })
  },

  showMessage ({commit}, {msg, level}) {
    commit('SET_MESSAGE_EVENT', {msg, level})
    setTimeout(() => {
      commit('SET_MESSAGE_EVENT', null)
    }, 1500)
  },

  incVisitedCount ({commit}, {lessonId}) {
    return Vue.axios.put(`/lessons/${lessonId}/action/inc_visited_count`)
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  SET_SERIES (state, series) {
    state.series = series
  },
  SET_MESSAGE_EVENT (state, obj) {
    state.messageEvent = obj
  }

}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
