<template>
  <div>
    <ParentLayout @toggle-sidebar="$emit('toggle-sidebar')"></ParentLayout>
  </div>
</template>

<script>
import ParentLayout from "@parent-theme/components/Navbar.vue";
export default {
  components: { ParentLayout }
};
</script>

<style lang="stylus">
.navbar
  .logo
    height 2.1rem
    width 2.1rem
    min-width auto
    margin-right 0.3rem

  .site-name
    font-family $titleFontFamily
    font-size 1.1rem
    color $accentColor

  a.router-link-active, .nav-item a
    &, &:focus, &:hover, &:visited, &:active, &.active, &.router-link-active
      color $accentColor
      text-decoration none

  .links
    right 0.4rem

  .nav-links
    .nav-item
      line-height 1.8rem

    a
      font-family $titleFontFamily
      font-size 0.7rem
      font-weight 600
      color $accentColor

    .repo-link
      display none

  .search-box
    input
      height 1.8rem
      line-height 1.8rem
      font-size 0.7rem
      background-size 0.8rem

    .suggestions
      top 1.2rem
      padding 0.3rem

    .suggestion
      margin-top 0.2rem
      padding 0.3rem 0.5rem
      line-height 1.2

      a
        font-size 0.7rem

.sidebar
  .nav-links
    a.repo-link
      display none

.region-cn
  .wip
    left 265px

@media (max-width: $MQMobileNarrow)
  .wip
    left 132px
    top 22px
  .region-cn
    .wip
      left 132px
</style>
