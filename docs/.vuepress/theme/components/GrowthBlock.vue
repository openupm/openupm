<template>
  <div class="growth-block show-sm">
    <div class="columns">
      <div class="column col-12">
        <div class="btn-group">
          <NavLink :item="packagesLink" class="btn btn-sm" />
          <a href="https://github.com/openupm/openupm" class="btn btn-sm"
            ><i class="fa fa-star"></i> Star</a
          >
          <a href="https://www.patreon.com/openupm" class="btn btn-sm"
            ><i class="fab fa-patreon"></i> Donate</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";

export default {
  components: { NavLink },
  data() {
    return {};
  },
  computed: {
    packagesLink() {
      return {
        link: "/packages/",
        text: "Packages",
        icon: "fa fa-box-open",
        iconLeft: true
      };
    }
  }
};
</script>

<style lang="stylus">
// ad-block
.growth-block
  margin $navbarHeight 0 -4.5rem
  font-size 12px
  font-weight 400
  padding 0.4rem

  .btn-group
    width 100%
</style>
