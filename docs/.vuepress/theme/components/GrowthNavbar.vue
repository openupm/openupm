<template>
  <div class="nav-links hide-md">
    <div class="nav-item growth">
      <div class="btn-group">
        <a href="https://github.com/openupm/openupm" class="btn btn-sm"
          ><i class="fa fa-star"></i> Star <span>|</span>
          <span class="stars">{{ stars }}</span></a
        >
        <a href="https://www.patreon.com/openupm" class="btn btn-sm"
          ><i class="fab fa-patreon"></i> Donate</a
        >
        <a :href="tweetUrl" class="btn btn-sm"
          ><i class="fab fa-twitter"></i> Tweet</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import util from "@root/docs/.vuepress/util";

export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    stars() {
      return this.$store.getters.siteInfo.stars || "...";
    },
    tweetUrl() {
      return util.tweetUrl;
    }
  }
};
</script>

<style lang="stylus">
.nav-links
  .nav-item
    &.growth
      margin-left 1.6rem
      display inline-block
      .btn
        font-size 12px
        padding-top 0

      .stars
        display inline-block
        min-width 1rem
</style>
