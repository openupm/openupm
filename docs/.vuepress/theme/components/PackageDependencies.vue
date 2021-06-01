<template>
  <div class="subpage-deps">
    <h2>
      {{ $t("dependencies") }}
      <span class="label label-rounded text-small">
        {{ dependencyList.length }}
      </span>
    </h2>
    <div v-if="!isLoading">
      <table v-if="dependencyList.length" class="table">
        <thead>
          <tr>
            <th class="td-icon"></th>
            <th class="td-name">{{ $t("name-at-version") }}</th>
            <th class="td-note">{{ $t("note") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in dependencyList" :key="entry.name">
            <td class="td-icon"><i :class="entry.icon"></i></td>
            <td class="td-name">
              <NavLink v-if="entry.link" :item="entry.link" class="dep-text" />
              <span v-else>{{ entry.nameWithVersion }}</span>
            </td>
            <td class="td-note">
              <div class="inner">{{ entry.helpText }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="skeleton-wrap">
      <VclList />
    </div>
  </div>
</template>

<script>
import { VclList } from "vue-content-loading";

import util from "@root/docs/.vuepress/util";

export default {
  components: { VclList },

  props: {
    dependencies: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    dependencyList() {
      if (!this.dependencies) return [];
      else
        return this.dependencies.map(({ name, version }) => {
          const nameWithVersion = `${name}@${version}`;
          const isNuGet = name.startsWith("org.nuget.");
          const isGit = version.startsWith("git");
          const url = util.getPackageUrl(this.$site.pages, name);
          let helpText = null;
          let icon = null;
          // TODO: verify org.nuget.* packages
          if (isNuGet) {
            helpText = this.$t('git-deps-nuget');
            icon = "fa fa-arrow-up";
          } else if (isGit) {
            if (url) {
              helpText = this.$t("git-deps-replaced");
              icon = "fab fa-git text-warning";
            } else {
              helpText = this.$t("git-deps-missing");
              icon = "fab fa-git text-error";
            }
          } else if (url) {
            icon = "fa fa-box-open";
          } else {
            helpText = this.$t("deps-missing");
            icon = "fas fa-exclamation-triangle text-error";
          }
          return {
            icon,
            name,
            nameWithVersion,
            helpText,
            link: url
              ? {
                  link: url,
                  text: nameWithVersion
                }
              : null,
            version
          };
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.subpage-deps
  font-size $fontSizeMD

  .table
    display table

    .td-icon
      width 1rem

    .td-name
      word-break break-all

    .td-note
      .inner
        max-width 18rem
</style>
