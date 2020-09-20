<template>
  <VLazyImage v-bind="$attrs" :src-placeholder="placeholder" />
</template>

<script>
import VLazyImage from "v-lazy-image";

export default {
  components: {
    VLazyImage
  },
  props: {
    placeholder: {
      type: String,
      default:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
    }
  }
};
</script>

<style lang="stylus" scoped>
.v-lazy-image
  filter blur(5px)
  transition filter 0.3s
  will-change filter

.v-lazy-image-loaded
  filter blur(0)
</style>
