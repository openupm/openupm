<template>
  <vue-lazy-component>
    <PackageCard v-bind="$attrs" />
    <div slot="skeleton" class="skeleton">
      <VclList />
    </div>
  </vue-lazy-component>
</template>

<script>
import { VclList } from "vue-content-loading";

import PackageCard from "@theme/components/PackageCard.vue";

export default {
  components: {
    PackageCard,
    VclList
  }
};
</script>

<style lang="stylus" scoped>
.skeleton
  max-width $maxPackageCardSkeletonWidth
</style>
