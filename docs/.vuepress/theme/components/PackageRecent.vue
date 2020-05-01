<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="package-recent container">
    <div class="columns">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="column col-4 col-md-6 col-sm-12"
      >
        <PackageCard :item="pkg" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import PackageCard from "@theme/components/PackageCard.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { PackageCard },
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
      pkgs = _.orderBy(pkgs, ["time"], ["desc"]);
      return pkgs.slice(0, this.count);
    }
  }
};
</script>

<style lang="stylus">
.package-recent
  margin-top 1rem
</style>
