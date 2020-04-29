<template>
  <RouterLink
    v-if="isInternal && !item.raw"
    class="nav-link"
    :to="link"
    :exact="exact"
    @focusout.native="focusoutAction"
  >
    <i v-if="item.iconBefore" :class="item.iconBefore" aria-hidden="true"></i>
    {{ item.text }}
    <i v-if="item.icon" :class="item.icon" aria-hidden="true"></i>
  </RouterLink>
  <a
    v-else
    :href="link"
    class="nav-link external"
    :target="target"
    :rel="rel"
    @focusout="focusoutAction"
  >
    <i v-if="item.iconBefore" :class="item.iconBefore" aria-hidden="true"></i>
    {{ item.text }}
    <i v-if="item.icon" :class="item.icon" aria-hidden="true"></i>
    <OutboundLink v-if="isOutboundLink" />
  </a>
</template>

<script>
import { isExternal, isMailto, isTel, ensureExt } from "@parent-theme/util";

export default {
  name: "NavLink",

  props: {
    item: {
      type: Object,
      required: true
    }
  },

  computed: {
    link() {
      return this.item.raw ? this.item.link : ensureExt(this.item.link);
    },

    exact() {
      if (this.$site.locales) {
        return Object.keys(this.$site.locales).some(
          rootLink => rootLink === this.link
        );
      }
      return this.link === "/";
    },

    isNonHttpURI() {
      return isMailto(this.link) || isTel(this.link);
    },

    isBlankTarget() {
      return this.target === "_blank";
    },

    isInternal() {
      return !isExternal(this.link) && !this.isBlankTarget;
    },

    isOutboundLink() {
      return (
        !this.item.iconBefore &&
        !this.item.icon &&
        !this.item.raw &&
        this.isBlankTarget
      );
    },

    target() {
      if (this.isNonHttpURI) {
        return null;
      }
      if (this.item.target) {
        return this.item.target;
      }
      return isExternal(this.link) ? "_blank" : "";
    },

    rel() {
      if (this.isNonHttpURI) {
        return null;
      }
      if (this.item.rel) {
        return this.item.rel;
      }
      return this.isBlankTarget ? "noopener noreferrer" : "";
    }
  },

  methods: {
    focusoutAction() {
      this.$emit("focusout");
    }
  }
};
</script>
