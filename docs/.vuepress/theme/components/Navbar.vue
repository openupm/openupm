<template>
  <div>
    <ParentLayout></ParentLayout>
    <div class="wip label label-secondary">under development</div>
  </div>
</template>

<script>
import ParentLayout from '@parent-theme/components/Navbar.vue'

export default {
  components: {
    ParentLayout,
  }
}
</script>

<style lang="stylus">
  .wip
    position absolute
    z-index 1000
    left 200px
    top 8px
</style>