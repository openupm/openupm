<template>
  <VLazyImage
    v-bind="$attrs"
    :src-placeholder="placeholder"
    @error.native="imageNotFound"
  />
</template>

<script>
import VLazyImage from "v-lazy-image";

const DefaultImagePlaceholder =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII=";

export default {
  components: {
    VLazyImage
  },
  props: {
    placeholder: {
      type: String,
      default: DefaultImagePlaceholder
    }
  },
  methods: {
    imageNotFound(event) {
      event.target.src = DefaultImagePlaceholder;
      event.target.classList.add("v-lazy-image-loaded");
    }
  }
};
</script>

<style lang="stylus" scoped>
.v-lazy-image
  filter blur(5px)
  transition filter 0.5s
  will-change filter

.v-lazy-image-loaded
  filter blur(0)
</style>
