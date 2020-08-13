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
          <div v-if="backers.length" class="column col-12">
            <section id="backers" class="avatar-wall">
              <h2>Backers</h2>
              <figure
                v-for="(profile, index) in backers"
                v-on:click="openUrl(profile)"
                :key="index"
                class="avatar avatar-xl tooltip custom clickable"
                :data-tooltip="profile.name"
                :data-initial="profile.abbr"
              >
                <img v-if="profile.img" :src="profile.img" alt:="profile.name" onerror="this.style.display='none'"
                />
              </figure>
            </section>
          </div>
          <div class="column col-12">
            <section id="package-hunters" class="avatar-wall">
              <h2>Top Package Hunters</h2>
              <figure
                v-for="(profile, index) in hunters"
                v-on:click="openUrl(profile)"
                :key="index"
                class="avatar avatar-xl tooltip clickable"
                :data-tooltip="profile.label"
              >
                <img :src="profile.img" alt:="profile.user" onerror="this.style.display='none'"/>
              </figure>
            </section>
          </div>
          <div class="column col-12">
            <section id="package-owners" class="avatar-wall">
              <h2>Top Package Owners</h2>
              <figure
                v-for="(profile, index) in owners"
                v-on:click="openUrl(profile)"
                :key="index"
                class="avatar avatar-xl tooltip clickable"
                :data-tooltip="profile.label"
              >
                <img :src="profile.img" alt:="profile.user" onerror="this.style.display='none'"/>
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
import NavLink from "@theme/components/NavLink.vue";

const getUserData = function(entry, action) {
  return {
    ...entry,
    img: `https://github.com/${entry.user}.png?size=128`,
    url: `https://github.com/${entry.user}`,
    label: `${entry.user} ${action} ${entry.count} ${
      entry.count > 1 ? "packages" : "package"
    }`
  };
};

const getBackerData = function(entry) {
  const data = {
    ...entry
  };
  if (entry.githubUser) {
    data.url = `https://github.com/${entry.githubUser}`;
    data.img = `${data.url}.png?size=128`;
  }
  const segs = entry.name.split(" ");
  data.abbr =
    segs.length == 1 ? data.name.slice(0, 2) : segs[0][0] + segs[1][0];
  return data;
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
    },
    backers() {
      return this.$page.frontmatter.backers.map(getBackerData);
    }
  },
  methods: {
    openUrl(profile) {
      window.open(profile.url, "_blank");
    }
  }
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

.clickable:hover {
  cursor: pointer;
}
</style>
