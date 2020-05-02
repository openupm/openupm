<template>
  <div class="package-control btn-group">
    <button
      :class="{ 'btn btn-action': true, active: !preferHorizontalLayout }"
      @click="setPreferHorizontalLayout(false)"
    >
      <i class="fa fa-th"></i></button
    ><button
      :class="{ 'btn btn-action': true, active: preferHorizontalLayout }"
      @click="setPreferHorizontalLayout(true)"
    >
      <i class="fa fa-bars"></i>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    preferHorizontalLayout() {
      return this.$store.getters.preferHorizontalLayout;
    }
  },
  methods: {
    setPreferHorizontalLayout(value) {
      this.$store.dispatch("setPreferHorizontalLayout", { value });
    }
  }
};
</script>

<style lang="stylus">
.package-control.btn-group
  display inline-block
</style>
