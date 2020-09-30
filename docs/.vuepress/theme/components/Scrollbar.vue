<!-- wrap vue-custom-scrollbar for SSR -->
<template>
  <component :is="scrollbar" v-if="scrollbar" v-bind="$attrs">
    <slot></slot>
  </component>
</template>

<script>
export default {
  computed: {
    scrollbar() {
      if (!this.$isServer)
        return () => import('vue-custom-scrollbar');
      return null;
    }
  }
};
</script>
