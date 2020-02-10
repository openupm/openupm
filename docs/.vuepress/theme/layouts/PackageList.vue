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
          <div class="column col-3 col-sm-12 meta-column">
            <section class="sort-section">
              <ul class="menu">
                <li class="divider" data-content="SORT BY"></li>
                <li
                  v-for="item in sortOptions"
                  :key="item.slug"
                  class="menu-item"
                >
                  <a
                    :href="item.link"
                    :class="item.class"
                    @click.prevent="onSortBtn(item)"
                    >{{ item.text }}</a
                  >
                </li>
              </ul>
            </section>
            <section class="topic-section">
              <ul class="menu">
                <li class="divider" data-content="TOPICS"></li>
                <li v-for="item in topics" :key="item.slug" class="menu-item">
                  <RouterLink
                    class="nav-link"
                    :to="{ path: item.link, query: { sort } }"
                    :exact="false"
                  >
                    {{ item.text }}
                  </RouterLink>
                </li>
              </ul>
            </section>
          </div>
          <div class="column col-9 col-sm-12">
            <section class="package-section">
              <masonry :cols="{ default: 2, 840: 1 }" :gutter="16">
                <div v-for="pkg in packages" :key="pkg.id">
                  <PackageCard
                    :item="pkg"
                    :show-created-at="$data.sort == 'date'"
                  />
                </div>
              </masonry>
            </section>
          </div>
        </div>
      </div>
      <Content class="theme-default-content custom" />
    </main>
  </ParentLayout>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import urljoin from "url-join";
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";
import PackageCard from "@theme/components/PackageCard.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { ParentLayout, NavLink, PackageCard },
  data() {
    return {
      sort: "date",
      sortList: [
        { text: "Name", slug: "name" },
        { text: "Popularity", slug: "pop" },
        { text: "Recently Added", slug: "date" }
      ],
      packagesExtra: {}
    };
  },
  computed: {
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
    },
    packages() {
      // Join extra data
      let pkgs = this.$page.frontmatter.packages.map(x => {
        const extra = this.$data.packagesExtra[x.name] || {};
        return {
          ...x,
          ...extra,
          sortName: x.link.text
        };
      });
      // Sort
      if (this.sort == "date") pkgs = _.orderBy(pkgs, ["createdAt"], ["desc"]);
      else if (this.sort == "pop") pkgs = _.orderBy(pkgs, ["stars"], ["desc"]);
      else if (this.sort == "name")
        pkgs = _.orderBy(pkgs, ["sortName"], ["asc"]);
      return pkgs;
    },
    sortOptions() {
      return this.sortList.map(x => {
        return {
          ...x,
          link: "",
          class: x.slug == this.sort ? "active" : ""
        };
      });
    },
    topic() {
      return this.$page.frontmatter.topic;
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
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.setSortOption(this.$route.query.sort);
    }
  },
  mounted() {
    this.setSortOption(this.$route.query.sort);
    this.fetchPackagesExtra();
  },
  methods: {
    async fetchPackagesExtra() {
      try {
        let resp = await axios.get(
          urljoin(util.openupmPackagesApiUrl, "extra"),
          {
            headers: { Accept: "application/json" }
          }
        );
        this.packagesExtra = resp.data;
      } catch (error) {
        console.error(error);
      }
    },
    onSortBtn(item) {
      if (item.class == "active") return;
      this.$router.push({
        path: this.$route.path,
        query: { sort: item.slug }
      });
    },
    setSortOption() {
      const sort = this.$route.query.sort;
      const choices = this.sortList.map(x => x.slug);
      if (choices.includes(sort)) this.sort = sort;
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

    .meta-column
      section
        margin-bottom 1rem

    .package-section
      margin-bottom 1.5rem
</style>
