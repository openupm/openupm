<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="package-card">
    <div class="tile bg-gray">
      <div class="tile-content">
        <h3 class="tile-title">
          <NavLink :item="pkg.link" />
        </h3>
        <p class="tile-subtitle">
          {{ pkg.description }}
        </p>
        <div>
          <span class="chip">
            <img
              :src="pkg.ownerAvatarUrl"
              :alt="pkg.owner"
              class="avatar avatar-sm"
            />
            {{ pkg.owner }}
          </span>
          <span v-if="pkg.parentOwner" class="chip">
            <img
              v-if="pkg.parentOwnerAvatarUrl"
              :src="pkg.parentOwnerAvatarUrl"
              :alt="pkg.parentOwner"
              class="avatar avatar-sm"
            />
            <i v-else class="fa fa-user"></i>
            {{ pkg.parentOwner }}
          </span>
          <span class="chip">
            <i class="fa fa-scroll"></i>
            {{ pkg.licenseSpdxId || pkg.licenseName || "No License" }}
          </span>
          <span v-if="pkg.parentRepoUrl" class="chip">
            <i class="fa fa-code-branch"></i>Fork
          </span>
          <span v-if="showCreatedAt" class="chip">
            <i class="fas fa-clock"></i>{{ pkg.createdAtText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from "@parent-theme/components/NavLink.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { NavLink },
  props: {
    item: {
      type: Object,
      required: true
    },
    showCreatedAt: {
      type: Boolean
    }
  },
  data() {
    return {};
  },
  computed: {
    pkg() {
      return {
        ...this.item,
        createdAtText: util.timeAgoFormat(new Date(this.item.createdAt))
      };
    }
  }
};
</script>

<style lang="stylus">
.package-card
  margin-bottom 0.8rem

  .tile
    padding 0.6rem 0.6rem
    height 100%

    .tile-subtitle
      height 3.6rem
      overflow hidden
      text-overflow ellipsis

    .chip
      i
        padding-right 0.3rem

    h3
      font-size 0.9rem
      margin 0 0 0.8rem

    p
      margin 0 0 0.5rem
</style>
