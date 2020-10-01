<template>
  <div v-if="active" class="ad-block">
    <a class="ad-img" :href="ad.link">
      <img v-if="ad.image" :src="ad.image" class="img-responsive" />
    </a>
    <a class="ad-link" :href="ad.link">
      {{ ad.text }}
    </a>
    <div class="ad-attr">{{ ad.attr }}</div>
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
  width 9rem
  margin-bottom 0.6rem
  font-size 0.6rem
  font-weight 400

  a:hover
    text-decoration none

  .ad-img
    display block
    padding 0 0 0.3rem 0
    width 100%

  .ad-link
    color #555

  .ad-attr
    color #999
    padding-top 0.2rem

// ad-placement
.adp-sidebar
  margin 1rem 0 0 1.7rem

.sidebar
  .adp-sidebar
    margin-left 3.0rem
</style>
