<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="package-card">
    <div class="card">
      <div class="card-content">
        <div v-if="pkg.image" class="card-image">
          <img :src="pkg.image" class="img-responsive" />
        </div>
        <div class="card-header">
          <div class="card-title h5">
            <NavLink :item="pkg.link" />
          </div>
        </div>
        <div class="card-body">
          {{ pkg.description }}
        </div>
        <div class="card-footer">
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
  padding-bottom 0.8rem
  height calc(100% - 0.5rem)

  .card
    border 0
    box-shadow 0 .25rem .5rem rgba(48, 55, 66, .15)
    height 100%

    .chip
      margin-bottom 0.2rem
      i
        padding-right 0.3rem
</style>
