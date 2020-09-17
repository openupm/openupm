<!-- eslint-disable vue/no-v-html -->
<template>
  <AppLayout class="package-list">
    <template #sideview>
      <section class="state-section">
        <ul class="menu">
          <li class="divider" data-content="State"></li>
          <li class="menu-item">
            <label class="form-switch">
              <input
                v-model="active"
                type="checkbox"
                @change="updateRouter()"
              /><i class="form-icon"></i>
              {{ stateText }}
            </label>
          </li>
          <li class="divider" data-content="Supported Unity Version"></li>
          <li class="menu-item">
            <div class="form-group">
              <select
                v-model="unity"
                class="form-select"
                @change="updateRouter()"
              >
                <option
                  v-for="option in unityOptions"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.text }}</option
                >
              </select>
            </div>
          </li>
          <li class="divider" data-content="Sort by"></li>
          <li class="menu-item">
            <div class="form-group">
              <select
                v-model="sort"
                class="form-select"
                @change="updateRouter()"
              >
                <option
                  v-for="option in sortOptions"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.text }}</option
                >
              </select>
            </div>
          </li>
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
    </template>
    <template #breadcrumbview>
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
      <div class="column col-8 col-md-7 breadcrumb-action-wrap text-right">
        <NavLink :item="contributorLink" class="btn btn-sm" />
        <NavLink :item="addPackageLink" class="btn btn-sm btn-primary" />
        <PackageControl class="hide-sm" />
      </div>
    </template>
    <template #contentview>
      <div class="columns">
        <div class="column col-12">
          <section class="package-section">
            <div class="columns">
              <div
                v-for="pkg in packages"
                :key="pkg.id"
                :class="[
                  'column',
                  preferHorizontalLayout
                    ? 'col-12'
                    : 'col-3 col-xl-4 col-lg-6 col-md-6 col-sm-12'
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
    </template>
  </AppLayout>
</template>

<script>
import { orderBy } from "lodash/collection";
import { reverse, uniq } from "lodash/array";
import { trim } from "lodash/string";
import AppLayout from "@theme/layouts/AppLayout.vue";
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

export default {
  components: { AppLayout, NavLink, PackageCard, PackageControl },

  data() {
    return {
      active: true,
      sort: SortType.updatedAt,
      sortList: [
        { text: "Name", value: SortType.name },
        { text: "Popularity", value: SortType.pop },
        { text: "Published Date", value: SortType.createdAt },
        { text: "Recently Updated", value: SortType.updatedAt }
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
      if (this.$mq == "xs" || this.$mq == "sm" || this.$mq == "md") {
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
      if (this.$mq == "xs" || this.$mq == "sm" || this.$mq == "md") {
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
      pkgs = pkgs.filter(x => x.pending != this.active);
      // Sort
      if (this.sort == SortType.updatedAt)
        pkgs = orderBy(pkgs, ["updatedAt"], ["desc"]);
      else if (this.sort == SortType.createdAt)
        pkgs = orderBy(pkgs, ["createdAt"], ["desc"]);
      else if (this.sort == SortType.pop)
        pkgs = orderBy(pkgs, ["stars"], ["desc"]);
      else if (this.sort == SortType.name)
        pkgs = orderBy(pkgs, ["sortName"], ["asc"]);
      return pkgs;
    },

    preferHorizontalLayout() {
      return this.$store.getters.preferHorizontalLayout;
    },

    query() {
      const query = {};
      query.active = this.active ? 1 : 0;
      if (this.sort) query.sort = this.sort;
      if (this.unity) query.unity = this.unity;
      return query;
    },

    stateText() {
      return this.active ? "Ready to Use" : "Pending";
    },

    sortOptions() {
      return this.sortList.map(x => {
        return {
          ...x,
          link: "",
          class: x.value == this.sort ? "active" : ""
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
        ([key, value]) => trim(value.unity)
      );
      unityList = reverse(
        uniq(unityList)
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
          value: x,
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
      this.parseQuery();
    }
  },

  mounted() {
    this.parseQuery();
  },

  methods: {
    /**
     * Parse query to set initial values.
     */
    parseQuery() {
      // state
      this.active = this.$route.query.active != "0";
      // sort
      const sort = this.$route.query.sort;
      if (this.sortList.map(x => x.value).includes(sort)) this.sort = sort;
      else this.sort = SortType.updatedAt;
      // unity
      const unity = this.$route.query.unity;
      if (this.unityOptions.map(x => x.value).includes(unity))
        this.unity = unity;
      else this.unity = "";
    },

    /**
     * Convert unity string to number value.
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
    },

    /**
     * Update router for current data
     */
    updateRouter() {
      this.$router.push({
        path: this.$route.path,
        query: this.query
      });
    }
  }
};
</script>

<style lang="stylus">
.package-list
  .mainview
    .breadcrumb-action-wrap
      padding-top 0.34rem
</style>
