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
    <div class="nav-links hide-md">
      <div class="nav-item growth">
        <div class="btn-group">
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
import ParentLayout from "@parent-theme/components/NavLinks.vue";
export default {
  components: { ParentLayout }
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

    &.growth
      margin-left 1.6rem
      display inline-block
      .btn
        font-size 12px
        padding-top 0

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
