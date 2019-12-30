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
      .dropdown-title
        span
          font-size 0.7rem
          font-weight bold
          color $accentColor
          font-family $titleFontFamily
          &.arrow
            margin-left 2px
    &.packages-add
      margin-right 0.2rem
      a
        &:hover
          border-bottom none
    a
      &.external
        margin-right -0.7rem
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
</style>
