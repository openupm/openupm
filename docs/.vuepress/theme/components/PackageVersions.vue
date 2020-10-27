<template>
  <div class="subpage-versions">
    <h2>
      {{ $t("versions") }}
      <span class="label label-rounded text-small">
        {{ versions.length }}
      </span>
    </h2>
    <section v-if="versions.length" class="col-12">
      <div v-if="!isLoading">
        <table class="table">
          <thead>
            <tr>
              <th>{{ $t("version") }}</th>
              <th>{{ $t("lowest-unity-version") }}</th>
              <th>{{ $t("published-time") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in versions" :key="entry.version">
              <td>
                {{ entry.version }}
                <span v-if="entry.latest" class="label label-rounded text=small"
                  >latest</span
                >
              </td>
              <td>{{ entry.unity }}</td>
              <td>{{ entry.timeSince }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="skeleton-wrap">
        <VclList />
      </div>
    </section>
  </div>
</template>

<script>
import { VclList } from "vue-content-loading";

export default {
  components: { VclList },

  props: {
    versions: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.subpage-versions
  font-size $fontSizeMD

  .table
    display table
</style>
