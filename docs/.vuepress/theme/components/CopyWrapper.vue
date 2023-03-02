<template>
  <span
    :data-tooltip="copiedTooltip"
    class="copy-wrapper tooltip tooltip-click"
    @click="copyIt"
  >
    <slot></slot>
  </span>
</template>

<script>
import copy from "copy-to-clipboard";

export default {
  props: {
    copiedTooltip: {
      type: String,
      default: "Copied",
    },
    copyText: {
      type: String,
      default: "",
    },
  },
  methods: {
    copyIt() {
      copy(this.copyText, { format: "text/plain" });
    },
  },
};
</script>

<style lang="stylus">
.copy-wrapper {
  display: inline-block;
  max-width: 100%;
  cursor: pointer;
}
</style>
