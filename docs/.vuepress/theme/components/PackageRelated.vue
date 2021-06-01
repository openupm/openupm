<template>
  <div class="subpage-pipelines">
    <h2>
      {{ $t("related-packages") }}
      <span class="label label-rounded text-small">
        {{ relatedPackages.length }}
      </span>
    </h2>
    <section v-if="relatedPackages.length">
      <table class="table">
        <thead>
          <tr>
            <th class="td-icon"></th>
            <th>{{ $t("name") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in relatedPackages" :key="entry.name">
            <td>
              <i :class="entry.icon"></i>
            </td>
            <td><NavLink :item="entry.link" /></td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";

export default {
  components: { NavLink },

  props: {},

  computed: {
    relatedPackages() {
      return this.$page.frontmatter.relatedPackages.map(x => {
        return {
          name: x.name,
          link: {
            text: x.text,
            link: `/packages/${x.name}/`
          },
          icon: "fa fa-box-open text-primary"
        };
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.subpage-pipelines
  font-size $fontSizeMD

  .table
    display table

    .td-icon
      width 1rem
</style>
