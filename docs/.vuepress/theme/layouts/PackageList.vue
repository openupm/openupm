<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="package-list">
      <div class="main-container container">
        <div class="columns">
          <div class="column col-12">
            <div class="columns breadcrumb-wrap">
              <div class="column col-4 col-md-5">
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
                class="column col-8 col-md-7 breadcrumb-action-wrap text-right"
              >
                <NavLink :item="contributorLink" class="btn" />
                <NavLink :item="addPackageLink" class="btn btn-primary" />
                <PackageControl class="hide-sm" />
              </div>
            </div>
          </div>
          <div class="column col-3 col-sm-12 meta-column">
            <section class="state-section">
              <ul class="menu">
                <li class="divider" data-content="State"></li>
                <div class="columns">
                  <div
                    v-for="item in stateOptions"
                    :key="item.slug"
                    class="column col-12 col-sm-6"
                  >
                    <li class="menu-item">
                      <a
                        :href="item.link"
                        :class="item.class"
                        @click.prevent="onStateBtn(item)"
                        >{{ item.text }}</a
                      >
                    </li>
                  </div>
                </div>
              </ul>
            </section>
            <section class="sort-section">
              <ul class="menu">
                <li class="divider" data-content="Sort by"></li>
                <div class="columns">
                  <div
                    v-for="item in sortOptions"
                    :key="item.slug"
                    class="column col-12 col-sm-6"
                  >
                    <li class="menu-item">
                      <a
                        :href="item.link"
                        :class="item.class"
                        @click.prevent="onSortBtn(item)"
                        >{{ item.text }}</a
                      >
                    </li>
                  </div>
                </div>
              </ul>
            </section>
            <section class="topic-section">
              <ul class="menu">
                <li class="divider" data-content="Topics"></li>
                <div class="columns">
                  <div
                    v-for="item in topics"
                    :key="item.slug"
                    class="column col-12 col-sm-6"
                  >
                    <li class="menu-item">
                      <RouterLink
                        :class="['nav-link', item.class]"
                        :to="{ path: item.link, query }"
                        :exact="false"
                      >
                        {{ item.text }}
                      </RouterLink>
                    </li>
                  </div>
                </div>
              </ul>
            </section>
            <section class="unity-section">
              <ul class="menu">
                <li class="divider" data-content="Supported Unity Version"></li>
                <div class="columns">
                  <div
                    v-for="item in unityOptions"
                    :key="item.slug"
                    class="column col-12 col-sm-6"
                  >
                    <li class="menu-item">
                      <a
                        :href="item.link"
                        :class="item.class"
                        @click.prevent="onUnityBtn(item)"
                        >{{ item.text }}</a
                      >
                    </li>
                  </div>
                </div>
              </ul>
            </section>
          </div>
          <div class="column col-9 col-sm-12">
            <section class="package-section">
              <div class="columns">
                <div
                  v-for="pkg in packages"
                  :key="pkg.id"
                  :class="[
                    'column',
                    preferHorizontalLayout ? 'col-12' : 'col-6 col-sm-12'
                  ]"
                >
                  <PackageCard
                    :item="pkg"
                    :prefer-horizontal-layout="preferHorizontalLayout"
                    :time-field="timeField"
                  />
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
import _ from "lodash";
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@theme/components/NavLink.vue";
import PackageCard from "@theme/components/PackageCard.vue";
import PackageControl from "@theme/components/PackageControl.vue";
import util from "@root/docs/.vuepress/util";

const SortType = {
  name: "name",
  pop: "pop",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};

const StateType = {
  pending: "pending",
  ready: "ready"
};

export default {
  components: { ParentLayout, NavLink, PackageCard, PackageControl },

  data() {
    return {
      sort: SortType.updatedAt,
      sortList: [
        { text: "Name", slug: SortType.name },
        { text: "Popularity", slug: SortType.pop },
        { text: "Published Date", slug: SortType.createdAt },
        { text: "Recently Updated", slug: SortType.updatedAt }
      ],
      state: StateType.ready,
      stateList: [
        { text: "Pending", slug: StateType.pending },
        { text: "Ready to Use", slug: StateType.ready }
      ],
      unity: ""
    };
  },

  computed: {
    addPackageLink() {
      const item = {
        link: "/packages/add/",
        text: "Add Package",
        icon: "fas fa-plus-circle",
        iconLeft: true
      };
      if (this.$mq == "xs" || this.$mq == "sm") {
        item.text = undefined;
      }
      return item;
    },
    contributorLink() {
      const item = {
        link: "/contributors/",
        text: "Contributors",
        icon: "fas fa-user-astronaut",
        iconLeft: true
      };
      if (this.$mq == "xs" || this.$mq == "sm") {
        item.text = undefined;
      }
      return item;
    },

    packagesExtra() {
      return this.$store.getters.packagesExtra;
    },

    packages() {
      // Join extra data
      let pkgs = this.$page.frontmatter.packages.map(x => {
        return util.joinPackageExtra(x, this.packagesExtra[x.name] || {});
      });
      // Filter by supported unity version.
      if (this.unity) {
        pkgs = pkgs.filter(
          x =>
            this.unityVersionToValue(x.unity) <=
            this.unityVersionToValue(this.unity)
        );
      }
      // Filter by state.
      if (this.state) {
        pkgs = pkgs.filter(x => x.pending == (this.state == "pending"));
      }
      // Sort
      if (this.sort == SortType.updatedAt)
        pkgs = _.orderBy(pkgs, ["updatedAt"], ["desc"]);
      else if (this.sort == SortType.createdAt)
        pkgs = _.orderBy(pkgs, ["createdAt"], ["desc"]);
      else if (this.sort == SortType.pop)
        pkgs = _.orderBy(pkgs, ["stars"], ["desc"]);
      else if (this.sort == SortType.name)
        pkgs = _.orderBy(pkgs, ["sortName"], ["asc"]);
      return pkgs;
    },

    preferHorizontalLayout() {
      return this.$store.getters.preferHorizontalLayout;
    },

    query() {
      const query = {};
      if (this.sort) query.sort = this.sort;
      if (this.unity) query.untiy = this.unity;
      if (this.state) query.state = this.state;
      return query;
    },

    stateOptions() {
      return this.stateList.map(x => {
        return {
          ...x,
          link: "",
          class: x.slug == this.state ? "active" : ""
        };
      });
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

    timeField() {
      if (this.sort == SortType.createdAt) {
        return SortType.createdAt;
      }
      return SortType.updatedAt;
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
    },

    unityOptions() {
      let unityList = Object.entries(this.packagesExtra).map(
        // eslint-disable-next-line no-unused-vars
        ([key, value]) => _.trim(value.unity)
      );
      unityList = _.reverse(
        _.uniq(unityList)
          // Remove empty element.
          .filter(x => x)
          // Sort.
          .sort()
      );
      // Insert "" at the beginning.
      unityList.splice(0, 0, "");
      // Convert to an option list.
      return unityList.map(x => {
        return {
          slug: x,
          text: x ? x : "All",
          link: "",
          class: x == this.unity ? "active" : ""
        };
      });
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.setSortOption(this.$route.query.sort);
      this.setUnityOption(this.$route.query.unity);
    }
  },

  mounted() {
    this.setSortOption(this.$route.query.sort);
    this.setUnityOption(this.$route.query.unity);
  },

  methods: {
    onStateBtn(item) {
      if (item.class == "active") return;
      this.state = item.slug;
      this.$router.push({
        path: this.$route.path,
        query: this.query
      });
    },

    onSortBtn(item) {
      if (item.class == "active") return;
      this.sort = item.slug;
      this.$router.push({
        path: this.$route.path,
        query: this.query
      });
    },

    onUnityBtn(item) {
      if (item.class == "active") return;
      this.unity = item.slug;
      this.$router.push({
        path: this.$route.path,
        query: this.query
      });
    },

    setSortOption() {
      const sort = this.$route.query.sort;
      const choices = this.sortList.map(x => x.slug);
      if (choices.includes(sort)) this.sort = sort;
    },

    setUnityOption() {
      const unity = this.$route.query.unity;
      const choices = this.unityOptions.map(x => x.slug);
      if (choices.includes(unity)) this.unity = unity;
    },

    /**
     * convert unity string to number value.
     */
    unityVersionToValue(unity) {
      if (!unity) {
        return 0;
      }
      const segs = unity.split(".");
      try {
        if (segs.length == 1) {
          return parseInt(segs[0]) * 1000;
        } else if (segs.length == 2) {
          return parseInt(segs[0]) * 1000 + parseInt(segs[1]);
        } else {
          return 0;
        }
      } catch (err) {
        return 0;
      }
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
