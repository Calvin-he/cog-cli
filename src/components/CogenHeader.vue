<template>
  <header class="nav">
    <div class="nav-left">
      <div class="nav-item">
       <slot  name="left"></slot>
      </div>
    </div>
    <div class="nav-center">
      <div class="nav-item">
      <router-link class="is-bold is-info" :to="url" replace>
        {{title}}
      </router-link>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-item">
       <slot  name="right"></slot>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'CogenHeader',
  props: {
    url: String,
    title: String
  }

}
</script>

<style>
.nav-left, .nav-right {
  flex-basis: 0;
}

.nav-item > a {
  text-decoration: none;
  border-bottom: 1px solid #ffdd57;
  font-weight: bold;
}
.nav-item > a:hover, .nav-item > a:focus {
}
</style>
