<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="package-list">
      <div class="main-container container">
        <div class="columns">
          <div class="column col-12">
            <div class="columns breadcrumb-wrap">
              <div class="column col-8 col-md-7 col-sm-12">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li class="breadcrumb-item">
                    <a href="#">Packages</a>
                  </li>
                </ul>
              </div>
              <div
                class="column col-4 col-md-5 col-sm-12 breadcrumb-action-wrap text-right"
              >
                <NavLink :item="contributorLink" class="btn" />
                <NavLink :item="addPackageLink" class="btn btn-primary" />
              </div>
            </div>
          </div>
          <div class="column col-3 col-sm-12">
            <section class="topic-section">
              <ul class="menu">
                <li class="divider" data-content="TOPICS"></li>
                <li v-for="item in topics" :key="item.slug" class="menu-item">
                  <NavLink :item="item" :class="item.class" />
                </li>
              </ul>
            </section>
          </div>
          <div class="column col-9 col-sm-12">
            <section class="package-section">
              <div class="columns">
                <div
                  v-for="pkg in packages"
                  :key="pkg.id"
                  class="column col-6 col-md-12 tile-wrap"
                >
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
                          {{ pkg.licenseSpdxId || pkg.licenseName }}
                        </span>
                        <span v-if="pkg.parentRepoUrl" class="chip">
                          <i class="fa fa-code-branch"></i>Fork
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Content class="theme-default-content custom" />
    </main>
  </ParentLayout>
</template>

<script>
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";

export default {
  components: { ParentLayout, NavLink },
  data() {
    return {};
  },
  computed: {
    packages() {
      return this.$page.frontmatter.packages;
    },
    topics() {
      return this.$page.frontmatter.topics
        .filter(topic => topic.count > 0)
        .map(topic => {
          return {
            link: topic.link,
            text: topic.name,
            class: topic.slug == this.topic.slug ? "active" : ""
          };
        });
    },
    topic() {
      return this.$page.frontmatter.topic;
    },
    addPackageLink() {
      return {
        link: "/packages/add/",
        text: "Add Package"
      };
    },
    contributorLink() {
      return {
        link: "/contributors/",
        text: "Contributors"
      };
    }
  }
};
</script>

<style lang="stylus">
.package-list
  .main-container
    margin-top 1rem

    .breadcrumb-wrap
      margin-bottom 0.8rem

    .breadcrumb-action-wrap
      padding-top 0.34rem

    .topic-section
      margin-bottom 1.5rem

    .package-section
      margin-bottom 1.5rem

      .tile-wrap
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
