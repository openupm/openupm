<!-- SponsorFeatured -->
<template>
  <section class="sponsor-featured container">
    <div class="columns">
      <div
        v-for="sponsorData in sponsors"
        :key="sponsorData.key"
        class="column col-12"
      >
        <div :id="sponsorData.key">
          <h3>{{ $t(sponsorData.key) }}</h3>
          <SponsorList :level="sponsorData.level" :items="sponsorData.items" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SponsorList from "@theme/components/SponsorList.vue";

export default {
  components: { SponsorList },
  data() {
    return {};
  },
  computed: {
    sponsors() {
      return ["diamond", "gold", "silver"]
        .map(level => {
          return {
            key: "sponsor-" + level,
            level,
            items: this.$page.frontmatter.sponsors.filter(x => x.level == level)
          };
        })
        .filter(x => {
          return x.items.length;
        });
    },
    moreLink() {
      return {
        text: this.$t("show-more"),
        link: "/contributors/"
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.sponsor-featured
  margin-bottom 1rem

  section
    margin-bottom 1rem
</style>
