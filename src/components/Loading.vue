<template>
  <div class="loading-container">
    <slot></slot>
    <div class="loading-text" v-show="loading">
         <i class="fa fa-spinner fa-2x loading-spinner"></i>
         <div class="loading-tip">{{loadingTip}}</div>
    </div>
    <div class="loading-background" v-show="loading"></div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    loadingTip: {
      type: String,
      default: ''
    }
  }
}
</script>


<style lang="scss">
@keyframes spinAround {
  from { transform: rotate(0deg) };
  to { transform: rotate(359deg) };  
}

.loading-container {
  position: relative;
  .loading-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .loading-text {
    position: absolute;
    left: 0%;
    top: 48%;
    width: 100%;
    z-index: 200;
    text-align: center;
  }

  .loading-text > .loading-spinner {
    animation: spinAround 1000ms infinite linear;
  }

}
</style>
