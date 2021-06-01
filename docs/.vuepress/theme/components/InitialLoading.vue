<!-- The initial loading component hides itself when vue starts working. -->
<template>
  <div :class="['initial-container', this.class]">
    <div class="loader">
      <i class="fa fa-circle-notch fa-spin"></i>
      {{ $t("loading-spin-text") }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      class: ""
    };
  },
  mounted() {
    this.class = "hide";
  }
};
</script>

<style lang="stylus" scoped>
.initial-container
  font-size 0.7rem

  .loader
    z-index 21
    position fixed
    top $navbarHeight + 0.6rem
    right 0.5rem
    display inline-block
    padding 0.4rem 1rem
    border 4px solid lighten($warningColor, 40%)
    background lighten($warningColor, 80%)
    color lighten($textColor, 20%)

@media (max-width: $MQMobileNarrow)
  .initial-container
    .loader
      top 0.45rem
      right 0.4rem
</style>
