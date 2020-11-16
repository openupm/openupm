<template>
  <div class="growth-block show-sm">
    <div class="columns">
      <div class="column col-12">
        <div class="btn-group">
          <NavLink :item="packagesLink" class="btn btn-sm" />
          <a :href="gitHubUrl" class="btn btn-sm"
            ><i class="fa fa-star"></i> {{ $t("star") }} <span>|</span>
            <span class="stars">{{ stars }}</span></a
          >
          <!-- <a href="https://www.patreon.com/openupm" class="btn btn-sm"
            ><i class="fab fa-patreon"></i> Donate</a
          > -->
          <a
            v-if="$site.themeConfig.region != 'cn'"
            :href="tweetUrl"
            class="btn btn-sm"
            ><i class="fab fa-twitter"></i> {{ $t("tweet") }}</a
          >
          <a
            v-if="$site.themeConfig.region == 'cn'"
            :href="weiboUrl"
            class="btn btn-sm"
            ><i class="fab fa-weibo"></i> {{ $t("weibo-share") }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { NavLink },
  data() {
    return {};
  },
  computed: {
    packagesLink() {
      return {
        link: "/packages/",
        text: this.$t("packages"),
        icon: "fa fa-box-open",
        iconLeft: true
      };
    },
    stars() {
      return this.$store.getters.siteInfo.stars || "...";
    },
    gitHubUrl() {
      if (this.$site.themeConfig.region == "cn")
        return "https://github.com/openupm/openupm/blob/master/README.zh-cn.md";
      else return "https://github.com/openupm/openupm";
    },
    tweetUrl() {
      return util.tweetUrl;
    },
    weiboUrl() {
      return util.weiboUrl;
    }
  }
};
</script>

<style lang="stylus">
// ad-block
.growth-block
  position relative
  margin $navbarHeight 0 -4.5rem
  font-size 12px
  font-weight 400
  padding 0.4rem
  z-index 9

  .btn-group
    width 100%

  .stars
    display inline-block
    min-width 1rem
</style>
