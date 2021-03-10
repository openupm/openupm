<!-- Sponsor List -->
<template>
  <div>
    <div v-for="(profile, index) in sponsors" :key="index" :class="classList">
      <figure
        v-if="profile.githubUser"
        class="avatar avatar-xl tooltip custom"
        :data-tooltip="profile.name"
        :data-initial="profile.abbr"
      >
        <a :href="profile.url">
          <LazyImage v-if="profile.image" :src="profile.image"
          alt:="profile.name" />
        </a>
      </figure>
      <a v-else :href="profile.url">
        <LazyImage
          v-if="profile.image"
          :src="profile.image"
          :alt="profile.name"
          :class="[profile.slug, 'img-responsive']"
          :style="{ minWidth: profile.minWidth || '0' }"
        />
      </a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    level: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    classList() {
      return ["sponsor-item", "sponsor-" + this.level];
    },
    sponsors() {
      return this.items
        .filter(x => {
          if (x.level != this.level) return false;
          if (x.expires) {
            return Date.parse(x.expires) >= new Date().getTime();
          }
          return true;
        })
        .map(x => {
          const data = {
            ...x
          };
          if (this.$site.themeConfig.region == "cn") {
            if (data.urlCN) data.url = data.urlCN;
            if (data.imageCN) data.image = data.imageCN;
          }
          return data;
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.sponsor-item
  display inline-block
  vertical-align middle;
  margin 0 1rem 0 0
  max-width 10rem
  &.sponsor-diamond
    max-width 15rem
  &.sponsor-gold
    max-width 15rem
  &.sponsor-silver
    max-width 12rem
  &.sponsor-bronze
    max-width 9rem
  &.sponsor-service
    max-width 9rem
</style>
