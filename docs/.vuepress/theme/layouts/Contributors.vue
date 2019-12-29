<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="contributors">
      <div class="main-container container">
        <div class="columns">
          <div class="column col-12">
            <div class="columns breadcrumb-wrap">
              <div class="column col-10 col-md-7">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li class="breadcrumb-item">
                    <a href="#">Contributors</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="column col-12">
            <section id="package-hunters" class="avatar-wall">
              <h2>Package Hunters</h2>
              <figure
                v-for="(profile, index) in hunters"
                :key="index"
                class="avatar avatar-xl tooltip"
                :data-tooltip="profile.label"
              >
                <img :src="profile.img" alt:="profile.user" />
              </figure>
            </section>
          </div>
          <div class="column col-12">
            <section id="package-owners" class="avatar-wall">
              <h2>Package Owners</h2>
              <figure
                v-for="(profile, index) in owners"
                :key="index"
                class="avatar avatar-xl tooltip"
                :data-tooltip="profile.label"
              >
                <img :src="profile.img" alt:="profile.user" />
              </figure>
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

const getUserData = function(entry, action) {
  return {
    ...entry,
    img: `https://github.com/${entry.user}.png?size=128`,
    label: `${entry.user} ${action} ${entry.count} ${
      entry.count > 1 ? "packages" : "package"
    }`
  };
};

export default {
  components: { ParentLayout, NavLink },
  data() {
    return {};
  },
  computed: {
    owners() {
      return this.$page.frontmatter.owners.map(x => {
        return getUserData(x, "owns");
      });
    },
    hunters() {
      return this.$page.frontmatter.hunters.map(x => {
        return getUserData(x, "hunts");
      });
    }
  },
  methods: {}
};
</script>

<style lang="stylus">
.contributors
  .main-container
    margin-top 1rem
  .avatar-wall
    margin-bottom 2rem
    .avatar
      margin: 0 0.3rem 0.3rem 0
</style>
