<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="package-recent">
    <div class="columns columns-title">
      <div class="column col-6 col-sm-12">
        <h3 id="package-recent">
          <a href="#package-recent" aria-hidden="true" class="header-anchor"
            >#</a
          >
          {{ $t("recently-updated") }}
          <a href="/packages/" class="btn btn-sm btn-more">{{
            $t("show-more")
          }}</a>
        </h3>
      </div>
      <div class="column col-6 col-sm-3 text-right hide-sm">
        <PackageLayoutControl />
      </div>
    </div>

    <div class="columns-package-wrapper container">
      <div class="columns">
        <div
          v-for="pkg in packages"
          :key="pkg.name"
          :class="[
            'column',
            preferHorizontalLayout ? 'col-12' : 'col-4 col-md-6 col-sm-12'
          ]"
        >
          <LazyPackageCard
            :item="pkg"
            :prefer-horizontal-layout="preferHorizontalLayout"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LazyPackageCard from "@theme/components/LazyPackageCard.vue";
import PackageLayoutControl from "@theme/components/PackageLayoutControl.vue";

export default {
  components: { LazyPackageCard, PackageLayoutControl },
  data() {
    return {};
  },
  computed: {
    packages() {
      return this.$store.getters.recentPackages;
    },
    preferHorizontalLayout() {
      return this.$store.getters.preferHorizontalLayout;
    }
  },
  mounted() {
    this.fetchRecentPackages();
  },
  methods: {
    fetchRecentPackages() {
      this.$store.dispatch("fetchRecentPackages");
    }
  }
};
</script>

<style lang="stylus">
.package-recent

  .columns-title
    align-items baseline

    .btn-more
      margin-left 0.3rem

  .columns-package-wrapper
    margin-top 1rem
</style>
