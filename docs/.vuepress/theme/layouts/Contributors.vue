<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="contributors">
      <div class="mainview container">
        <div class="columns">
          <div class="column col-12">
            <div class="columns breadcrumbview">
              <div class="column col-10 col-md-7">
                <ul class="breadcrumb">
                  <li class="breadcrumb-item">
                    <a href="/">{{ $t("home") }}</a>
                  </li>
                  <li class="breadcrumb-item">
                    <a href="#">{{ $t("contributors") }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div v-if="bronzeSponsors.length" class="column col-12">
            <section id="sponsors-bronze" class="avatar-wall">
              <h2>{{ $t("sponsors-bronze") }}</h2>
              <div
                v-for="(profile, index) in bronzeSponsors"
                :key="index"
                class="sponsor-item sponsor-bronze"
              >
                <a :href="profile.url">
                  <LazyImage v-if="profile.image" :src="profile.image"
                  alt:="profile.name" class="img-responsive" />
                </a>
              </div>
            </section>
          </div>
          <div v-if="backers.length" class="column col-12">
            <section id="backers" class="avatar-wall">
              <h2>{{ $t("backers") }}</h2>
              <figure
                v-for="(profile, index) in backers"
                :key="index"
                class="avatar avatar-xl tooltip custom"
                :data-tooltip="profile.name"
                :data-initial="profile.abbr"
              >
                <a :href="profile.url">
                  <LazyImage v-if="profile.image" :src="profile.image"
                  alt:="profile.name" />
                </a>
              </figure>
            </section>
          </div>
          <div class="column col-12">
            <section id="package-hunters" class="avatar-wall">
              <h2>{{ $t("top-package-hunters") }}</h2>
              <figure
                v-for="(profile, index) in hunters"
                :key="index"
                class="avatar avatar-xl tooltip"
                :data-tooltip="profile.label"
              >
                <a :href="profile.url">
                  <LazyImage :src="profile.image" alt:="profile.user" />
                </a>
              </figure>
            </section>
          </div>
          <div class="column col-12">
            <section id="package-owners" class="avatar-wall">
              <h2>{{ $t("top-package-owners") }}</h2>
              <figure
                v-for="(profile, index) in owners"
                :key="index"
                class="avatar avatar-xl tooltip"
                :data-tooltip="profile.label"
              >
                <a :href="profile.url">
                  <LazyImage :src="profile.image" alt:="profile.user" />
                </a>
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

const getUserData = function(entry, action) {
  return {
    ...entry,
    image: `https://github.com/${entry.user}.png?size=128`,
    url: `https://github.com/${entry.user}`,
    label: `${entry.user} ${action} ${entry.count} ${
      entry.count > 1 ? "packages" : "package"
    }`
  };
};

export default {
  components: { ParentLayout },
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
      return this.$page.frontmatter.backers
        .filter(x => {
          if (x.expires) {
            return Date.parse(x.expires) >= new Date().getTime();
          }
          return true;
        })
        .map(x => {
          const data = {
            ...x
          };
          if (x.githubUser) {
            data.url = `https://github.com/${x.githubUser}`;
            data.image = `${data.url}.png?size=128`;
          }
          const segs = x.name.split(" ");
          data.abbr =
            segs.length == 1 ? data.name.slice(0, 2) : segs[0][0] + segs[1][0];
          return data;
        });
    },
    bronzeSponsors() {
      return this.sponsorsForLevel("bronze");
    }
  },
  methods: {
    sponsorsForLevel(level) {
      return this.$page.frontmatter.sponsors
        .filter(x => {
          if (x.level != level) return false;
          if (x.expires) {
            return Date.parse(x.expires) >= new Date().getTime();
          }
          return true;
        })
        .map(x => {
          const data = {
            ...x
          };
          if (this.$site.themeConfig.region == "cn") {
            if (data.urlCN) data.url = data.urlCN;
            if (data.imageCN) data.image = data.imageCN;
          }
          return data;
        });
    }
  }
};
</script>

<style lang="stylus">
.contributors
  .mainview
    margin-top 1rem
  .avatar-wall
    margin-bottom 2rem
    .avatar
      margin: 0 0.3rem 0.3rem 0
      a
        width: 100%
        height: 100%
        display: block
  .sponsor-item
    display inline-block
    margin 0 1rem 0 0
    max-width 10rem
    &.sponsor-bronze
      max-width 10rem
</style>
