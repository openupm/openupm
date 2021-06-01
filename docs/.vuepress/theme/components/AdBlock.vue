<template>
  <div v-if="active" class="ad-block">
    <a class="ad-img" :href="ad.link">
      <LazyImage v-if="ad.image" :src="ad.image" class="img-responsive" />
    </a>
    <div class="ad-text">
      <a class="ad-link" :href="ad.link">
        {{ ad.text }}
      </a>
      <div class="ad-attr">
        <small>{{ ad.attr }}</small>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import urljoin from "url-join";
import util from "@root/docs/.vuepress/util";

export default {
  data() {
    return {
      ad: {
        active: false
      }
    };
  },
  computed: {
    active() {
      return (
        this.ad.active &&
        Date.now() > Date.parse(this.ad.start) &&
        Date.now() < Date.parse(this.ad.end)
      );
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        let resp = await axios.get(urljoin(util.openupmApiUrl, "ads/custom"), {
          headers: { Accept: "application/json" }
        });
        this.ad = resp.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="stylus">
// ad-block
.ad-block
  width 100%
  max-width 12rem
  display flex
  flex-wrap wrap
  margin-bottom 0.6rem
  font-size 0.6rem
  font-weight 400

  a:hover
    text-decoration none

  .ad-img
    padding 0
    width 50%

  .ad-text
    padding 0.2rem 0 0 0.4rem
    width 50%
    .ad-link
      padding-bottom 0.3rem
      display inline-block
      color #555
      height 3.7rem
    .ad-attr
      color #aaa

// ad-placement
.adp-sidebar
  margin 1rem 0 0 0

.sidebar
  .adp-sidebar
    margin 1rem 0 0 1.5rem
</style>
