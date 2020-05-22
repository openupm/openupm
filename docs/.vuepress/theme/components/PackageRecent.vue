<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="package-recent">
    <div class="columns columns-title">
      <div class="column col-6 col-sm-12">
        <h3 id="package-recent">
          <a href="#package-recent" aria-hidden="true" class="header-anchor"
            >#</a
          >
          Recently Updated
          <a href="/packages/" class="btn btn-sm btn-more">Show more</a>
        </h3>
      </div>
      <div class="column col-6 col-sm-3 text-right hide-sm">
        <PackageControl />
      </div>
    </div>

    <div class="columns-package-wrapper container">
      <div class="columns">
        <div
          v-for="pkg in packages"
          :key="pkg.id"
          :class="[
            'column',
            preferHorizontalLayout ? 'col-12' : 'col-4 col-md-6 col-sm-12'
          ]"
        >
          <PackageCard
            :item="pkg"
            :prefer-horizontal-layout="preferHorizontalLayout"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import PackageCard from "@theme/components/PackageCard.vue";
import PackageControl from "@theme/components/PackageControl.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { PackageCard, PackageControl },
  props: {
    count: {
      type: Number,
      default: 3
    }
  },
  data() {
    return {};
  },
  computed: {
    packagesExtra() {
      return this.$store.getters.packagesExtra;
    },
    packages() {
      let pkgs = this.$page.packages.map(x => {
        return util.joinPackageExtra(x, this.packagesExtra[x.name] || {});
      });
      pkgs = _.orderBy(pkgs, ["updatedAt"], ["desc"]);
      return pkgs.slice(0, this.count);
    },
    preferHorizontalLayout() {
      return this.$store.getters.preferHorizontalLayout;
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
