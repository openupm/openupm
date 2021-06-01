<template>
  <div>
    <div class="nav-links hide-sm">
      <div class="nav-item packages-add">
        <a href="/packages/add/" class="nav-link">
          <i class="fas fa-plus-circle"></i>
        </a>
      </div>
    </div>
    <ParentLayout></ParentLayout>
    <GrowthNavbar />
  </div>
</template>

<script>
import ParentLayout from "@parent-theme/components/NavLinks.vue";
import GrowthNavbar from "./GrowthNavbar.vue";

export default {
  components: { ParentLayout, GrowthNavbar }
};
</script>

<style lang="stylus">
.nav-links
  .nav-item
    .dropdown-wrapper
      .nav-dropdown
        overflow  hidden
        padding 0.4rem 0
        .dropdown-item
          list-style none
          a
            line-height 1.1rem
            i
              padding-right 0.1rem
              min-width 1rem

      .dropdown-title
        span
          font-size 0.7rem
          font-weight bold
          color $accentColor
          font-family $titleFontFamily
          &.arrow
            margin-left 2px

    .dropdown-subitem-wrapper
      margin 0

      .dropdown-subitem
        margin-top 0.3rem

    &.packages-add
      margin-right 0.2rem
      a
        &:hover
          border-bottom none

    a
      &.external
        margin-right -0.7rem

    h4
      font-size 0.7rem
      font-weight 800

.sidebar
  .nav-links
    .nav-item
      a.nav-link, .dropdown-wrapper .title
        font-family $titleFontFamily
        color #3b4351
        font-size 0.8rem

        &.router-link-active
          color $accentColor

      .dropdown-wrapper
        .dropdown-item
          a
            font-size 0.7rem
            line-height 1.6rem

      .nav-dropdown
        padding 0
</style>
