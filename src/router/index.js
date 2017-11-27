import Vue from 'vue'
import Router from 'vue-router'
import LessonList from 'pages/LessonList'
import Lesson from 'pages/Lesson'
import SeriesIntro from 'pages/SeriesIntro'
import Payment from 'pages/Payment'
import Login from 'auth/Login'
import NotFound from 'pages/NotFound'

Vue.use(Router)

const router = new Router({
  routes: [ {
    path: '/',
    redirect: to => {
      let query = parseQueryString(window.location.search)
      // console.log('query: ', query)
      if (query.path) {
        return {path: query.path, query: query}
      } else {
        return '/404'
      }
    }
  }, {
    name: 'Login',
    path: '/login',
    component: Login
  }, {
    name: 'LessonList',
    path: '/lessonlist/:seriesId',
    meta: {auth: true},
    component: LessonList,
    props: true
  }, {
    name: 'Lesson',
    path: '/:seriesId/lesson/:lessonId',
    meta: {auth: true},
    component: Lesson,
    props: true
  }, {
    name: 'SeriesIntro',
    path: '/seriesintro/:seriesId',
    meta: {auth: true},
    component: SeriesIntro,
    props: true
  }, {
    name: 'Payment',
    path: '/payment/:seriesId',
    meta: {auth: true},
    component: Payment,
    props: true
  }, {
    name: 'NotFound',
    path: '/404',
    component: NotFound
  }]
})

function parseQueryString (queryString) {
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

export default router
