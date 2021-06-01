<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="theme-default-content custom">
    <ClientOnly>
      <div v-if="!isLoading">
        <div v-if="html" v-html="html"></div>
        <p v-else>{{ $t("readme-to-found") }}</p>
      </div>
      <div v-else class="skeleton-wrap">
        <VclList />
      </div>
    </ClientOnly>
    <div class="editlink-wrap">
      <div class="divider"></div>
      <p><NavLink :item="editNavLink" /></p>
    </div>
  </div>
</template>

<script>
import urljoin from "url-join";
import { VclList } from "vue-content-loading";

import util from "@root/docs/.vuepress/util";

export default {
  components: { VclList },
  props: {
    name: {
      type: String,
      required: true
    },
    html: {
      type: String,
      default: ""
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    editNavLink() {
      return {
        link: urljoin(
          util.openupmRepoUrl,
          "/blob/master/data/packages",
          this.name + ".yml"
        ),
        text: this.$t("edit-package")
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.theme-default-content
  margin 0
  padding 0 0 2.5rem
  font-size $fontSizeMD

  :first-child
    margin-top 0

  ol
    list-style decimal

  .editlink-wrap
    margin-top 2rem
</style>
