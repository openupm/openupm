<template>
  <div>
    <div class="nav-links">
      <div class="nav-item packages-add">
        <a href="/packages/add/" class="nav-link">
          <i class="fas fa-plus-circle"></i>
        </a>
      </div>
    </div>
    <ParentLayout></ParentLayout>
  </div>
</template>

<script>
import ParentLayout from "@parent-theme/components/Navlinks.vue";
export default {
  components: { ParentLayout }
};
</script>

<style lang="stylus">
.nav-links
  .nav-item
    &.packages-add
      margin-right 0.2rem
      a
        &:hover
          border-bottom none
    a
      &.external
        margin-right -0.7rem
</style>
