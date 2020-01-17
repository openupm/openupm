<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="package-recent container">
    <div class="columns">
      <div class="column col-12 col-sm-12">
        <div class="columns">
          <div
            v-for="pkg in packages"
            :key="pkg.id"
            class="column col-4 col-md-6 col-sm-12"
          >
            <PackageCard :item="pkg" :show-created-at="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PackageCard from "@theme/components/PackageCard.vue";

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
    packages() {
      return this.$page.recentPackages.slice(0, this.count);
    }
  }
};
</script>

<style lang="stylus">
.package-recent
  margin-top 1rem
</style>
