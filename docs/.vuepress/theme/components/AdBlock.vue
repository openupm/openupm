<template>
  <div v-if="active" class="ad-block">
    <a class="ad-text" :href="ad.link">
      <img v-if="ad.image" :src="ad.image" />
      {{ ad.text }}</a
    >
    <span class="ad-attr">{{ ad.attr }}</span>
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
  font-size 12px
  font-weight 400
  padding 0.4rem

  a
    &:hover
      text-decoration none

  .ad-text
    display inline-block
    padding-right 0.3rem
    padding-bottom 0.3rem
    color #444

  .ad-attr
    color #999

  img
    display none

.adp-sidebar
  margin 1rem 0 -1.2rem 0.9rem
  width 12rem

@media (min-width: $MQNormal)
  .ad-block
    padding-top 0
    padding-left 0.6rem

    .ad-attr
      display block

    img
      display block
      width 100%
      margin-bottom 0.2rem

// ad-placement
.adp-topleftfloat
  margin 5rem 0
  width 9.2rem
  float left
  display block
  position fixed
</style>
