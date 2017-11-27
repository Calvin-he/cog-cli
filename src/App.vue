<template>
  <div id="app">
    <transition name="fade">
    <div id="message-bar" v-show="message" class="message is-warning">
      <div class="message-header"> {{message && message.msg}}
      </div>
    </div>
     </transition>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    message () {
      return this.$store.state.messageEvent
    }
  }
}
</script>

<style lang="scss">
@import "~quill/dist/quill.core.css";
@import '~bulma';

$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome';

#app {
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // color: #2c3e50;
  .nav {
    background-color: $primary;
  }

  #message-bar {
    position: fixed;
    bottom: 0;
    width: 100%;

    z-index: 200;
  }
}

.full-width {
  width: 100%
}
</style>
