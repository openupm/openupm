<!-- eslint-disable vue/no-v-html -->
<template>
  <AppLayout class="package-list">
    <template #sideview>
      <section class="state-section">
        <ul class="menu">
          <li class="divider" :data-content="$t('state')"></li>
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
          <li
            class="divider"
            :data-content="$t('supported-unity-version')"
          ></li>
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
          <li class="divider show-sm" :data-content="$t('topics')"></li>
          <li class="menu-item show-sm">
            <div class="form-group">
              <select
                v-model="topicValue"
                class="form-select"
                @change="updateRouter()"
              >
                <option
                  v-for="option in topics"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.text }}</option
                >
              </select>
            </div>
          </li>
          <li class="divider" :data-content="$t('sort-by')"></li>
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
      <section class="topic-section hide-sm">
        <ul class="menu">
          <li class="divider" :data-content="$t('topics')"></li>
          <div class="columns">
            <div
              v-for="item in topics"
              :key="item.value"
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
            <a href="/">{{ $t("home") }}</a>
          </li>
          <li class="breadcrumb-item">
            <a href="#">{{ $t("packages") }}</a>
          </li>
        </ul>
      </div>
      <div class="column col-8 col-md-7 breadcrumb-action-wrap text-right">
        <NavLink :item="contributorLink" class="btn btn-sm" />
        <NavLink :item="addPackageLink" class="btn btn-sm btn-primary" />
        <PackageLayoutControl class="hide-sm" />
      </div>
    </template>
    <template #contentview>
      <div class="columns">
        <div class="column col-12">
          <section class="package-section">
            <div class="columns">
              <div
                v-for="pkg in packages"
                :key="pkg.name"
                :class="[
                  'column',
                  preferHorizontalLayout
                    ? 'col-12'
                    : 'col-3 col-xl-4 col-lg-6 col-md-6 col-sm-12'
                ]"
              >
                <LazyPackageCard
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
import constant from "@theme/constant";
import LazyPackageCard from "@theme/components/LazyPackageCard.vue";
import NavLink from "@theme/components/NavLink.vue";
import PackageLayoutControl from "@theme/components/PackageLayoutControl.vue";
import util from "@root/docs/.vuepress/util";

const SortType = constant.SortType;

export default {
  components: {
    AppLayout,
    LazyPackageCard,
    NavLink,
    PackageLayoutControl
  },

  data() {
    return {
      active: true,
      topicValue: "",
      sortList: [
        { text: this.$t("name"), value: SortType.name },
        { text: this.$t("popularity"), value: SortType.pop },
        { text: this.$t("published-date"), value: SortType.createdAt },
        { text: this.$t("recently-updated"), value: SortType.updatedAt }
      ],
      unity: ""
    };
  },

  computed: {
    addPackageLink() {
      const item = {
        link: "/packages/add/",
        text: this.$t("add-package"),
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
        text: this.$t("contributors"),
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

    sort: {
      get() {
        return this.$store.getters.packageListSort;
      },
      set(value) {
        this.$store.dispatch("setPackageListSort", { value });
      }
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

    stateText() {
      return this.active ? this.$t("ready-to-use") : this.$t("pending");
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
          const transKey = topic.slug || "all";
          return {
            link: topic.link,
            text: this.$te(transKey) ? this.$t(transKey) : topic.name,
            value: topic.slug,
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
          text: x ? x : this.$t("all"),
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
      if (this.sortList.map(x => x.value).includes(sort) && sort != this.sort)
        this.$store.dispatch("setPackageListSort", { value: sort });
      // unity
      const unity = this.$route.query.unity;
      if (this.unityOptions.map(x => x.value).includes(unity))
        this.unity = unity;
      else this.unity = "";
      // topic
      this.topicValue = this.topic.slug;
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
      let path = this.$route.path;
      if (this.topicValue != this.topic.slug) {
        if (this.topicValue) path = "/packages/topics/" + this.topicValue + "/";
        else path = "/packages/";
      }
      this.$router.push({
        path,
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
