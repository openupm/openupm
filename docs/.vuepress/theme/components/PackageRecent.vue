<!-- eslint-disable vue/no-v-html -->
<template>
  <section class="package-recent container">
    <div class="columns columns-title">
      <div class="column col-6 col-sm-12">
        <h3 id="package-recent">
          <a href="#package-recent" aria-hidden="true" class="header-anchor"
            >#</a
          >
          {{ $t("last-publish") }}
          <NavLink :item="moreLink" :class="'btn btn-sm btn-more'" />
        </h3>
      </div>
      <div class="column col-6 col-sm-3 text-right hide-sm">
        <PackageLayoutControl />
      </div>
    </div>

    <div class="columns columns-packages">
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
  </section>
</template>

<script>
import LazyPackageCard from "@theme/components/LazyPackageCard.vue";
import NavLink from "@theme/components/NavLink.vue";
import PackageLayoutControl from "@theme/components/PackageLayoutControl.vue";

import util from "@root/docs/.vuepress/util";

export default {
  components: { LazyPackageCard, PackageLayoutControl, NavLink },
  data() {
    return {};
  },
  computed: {
    packages() {
      return this.$store.getters.recentPackages.map(x => {
        return util.joinPackageExtra(x, {});
      });
    },
    preferHorizontalLayout() {
      return this.$store.getters.preferHorizontalLayout;
    },
    moreLink() {
      return {
        text: this.$t("show-more"),
        link: "/packages/"
      };
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

<style lang="stylus" scoped>
.package-recent

  .columns-title
    align-items baseline

    .btn-more
      margin-left 0.3rem

  .columns-packages
    margin-top 1rem

  @media (max-width: $MQMobileNarrow)
    .columns-packages
      margin-left -1rem
      margin-right -1rem
      width calc(100% + 2rem)
</style>
