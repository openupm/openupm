<template>
  <AppLayout class="package-detail">
    <template #sideview>
      <section class="subpage-section">
        <ul class="menu">
          <div class="columns">
            <div
              v-for="item in subPages"
              :key="item.value"
              class="column col-12"
            >
              <li v-show="item.visible" class="menu-item">
                <RouterLink :class="item.class" :to="item.link" :exact="false">
                  {{ item.text }}
                  <span
                    v-if="item.count"
                    class="label label-rounded text-small"
                    >{{ item.count }}</span
                  >
                  <i v-if="item.icon" :class="item.icon"></i>
                </RouterLink>
              </li>
            </div>
          </div>
        </ul>
      </section>
    </template>
    <template #breadcrumbview>
      <div class="column col-12">
        <ul class="breadcrumb">
          <li class="breadcrumb-item">
            <NavLink :item="homeLink" />
          </li>
          <li class="breadcrumb-item">
            <NavLink :item="packagesLink" />
          </li>
          <li class="breadcrumb-item">
            <a href="#">{{ $package.name }}</a>
          </li>
        </ul>
      </div>
    </template>
    <template #contentview>
      <div class="columns columns-contentview">
        <div class="column col-8 col-xl-8 col-lg-8 col-md-12 col-sm-12">
          <div v-if="$package.repoUnavailable" class="toast toast-error mb-2">
            {{ $t("the-repository-is-unavailable") }}
          </div>
          <div class="topics-wrap">
            <a v-for="item in topics" :key="item.slug" :href="item.link"
              ><span class="label label-rounded"> {{ item.text }}</span></a
            >
          </div>
          <!-- SubPages start -->
          <div v-if="isSubPageReadme">
            <PackageReadme
              :html="readmeHtml"
              :name="$package.name"
              :is-loading="isLoadingReadme"
            />
          </div>
          <div v-if="isSubPageDependencies">
            <PackageDependencies
              :dependencies="dependencies"
              :is-loading="isLoadingDependencies"
              :version="packageVersion"
            />
          </div>
          <div v-if="isSubPageVersions">
            <PackageVersions
              :versions="packageVersions"
              :is-loading="isLoadingVersions"
            />
          </div>
          <div v-if="isSubPagePipelines">
            <PackagePipelines
              :invalid-tags="invalidTags"
              :releases="packageReleases"
              :repo-url="$package.repoUrl"
              :is-loading="isLoadingPipelines"
            />
          </div>
          <div v-if="isSubPageRelated">
            <PackageRelated />
          </div>
          <!-- SubPages end -->
        </div>
        <div
          class="column column-meta col-4 col-xl-4 col-lg-4 col-md-12 col-sm-12"
        >
          <PackageMeta
            v-show="shouldShowMeta"
            :has-not-succeeded-build="hasNotSucceededBuild"
            :pkg="$package"
            :package-info="packageInfo"
            :registry-info="registryInfo"
          />
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<script>
import axios from "axios";
import urljoin from "url-join";
import VueScrollTo from "vue-scrollto";

import AppLayout from "@theme/layouts/AppLayout.vue";
import NavLink from "@theme/components/NavLink.vue";
import PackageDependencies from "@theme/components/PackageDependencies.vue";
import PackageMeta from "@theme/components/PackageMeta.vue";
import PackagePipelines from "@theme/components/PackagePipelines.vue";
import PackageReadme from "@theme/components/PackageReadme.vue";
import PackageRelated from "@theme/components/PackageRelated.vue";
import PackageVersions from "@theme/components/PackageVersions.vue";
import { ReleaseState } from "@root/app/common/constant";
import util from "@root/docs/.vuepress/util";

const SubPage = {
  deps: "deps",
  meta: "meta",
  pipelines: "pipelines",
  readme: "readme",
  related: "related",
  versions: "versions"
};

const defaultData = function() {
  return {
    packageInfo: {
      fetched: false
    },
    registryInfo: {
      fetched: false
    },
    subPage: SubPage.readme
  };
};

export default {
  components: {
    AppLayout,
    NavLink,
    PackageDependencies,
    PackageMeta,
    PackagePipelines,
    PackageReadme,
    PackageRelated,
    PackageVersions
  },
  data() {
    return defaultData();
  },
  computed: {
    $package() {
      const pkg = this.$page.frontmatter.package;
      const extra = this.$store.getters.packagesExtra[pkg.name];
      return util.joinPackageExtra(pkg, extra);
    },
    dependencies() {
      const versions = this.registryInfo.versions || {};
      const versionInfo = versions[this.packageVersion];
      const obj =
        versionInfo && versionInfo.dependencies ? versionInfo.dependencies : {};
      return Object.entries(obj).map(([name, version]) => {
        return { name, version };
      });
    },
    dependenciesIcon() {
      let isError = false;
      let isWarning = false;
      for (const { name, version } of this.dependencies) {
        // TODO: verify org.nuget.* packages
        if (name.startsWith("org.nuget.")) continue;
        const isGit = version.startsWith("git");
        if (isGit) isWarning = true;
        const url = util.getPackageUrl(this.$site.pages, name);
        if (!url) isError = true;
      }
      if (isError) return "fas fa-exclamation-triangle text-error";
      else if (isWarning) return "fas fa-exclamation-triangle text-warning";
      else return "";
    },
    hasNotSucceededBuild() {
      return (
        this.packageReleases.filter(
          x => x.state != ReleaseState.Succeeded.value
        ).length > 0
      );
    },
    homeLink() {
      return {
        link: "/",
        text: this.$t("home")
      };
    },
    invalidTags() {
      return this.$data.packageInfo.invalidTags || [];
    },
    isLoadingDependencies() {
      return !this.registryInfo.fetched;
    },
    isLoadingPipelines() {
      return !this.packageInfo.fetched;
    },
    isLoadingReadme() {
      return !this.$data.packageInfo.fetched;
    },
    isLoadingVersions() {
      return !this.$data.registryInfo.fetched;
    },
    isSubPageDependencies() {
      return this.subPage == SubPage.deps;
    },
    isSubPagePipelines() {
      return this.subPage == SubPage.pipelines;
    },
    isSubPageReadme() {
      return this.subPage == SubPage.readme;
    },
    isSubPageRelated() {
      return this.subPage == SubPage.related;
    },
    isSubPageVersions() {
      return this.subPage == SubPage.versions;
    },
    packagesLink() {
      return {
        link: "/packages/",
        text: this.$t("packages")
      };
    },
    packageReleases() {
      return this.$data.packageInfo.releases || [];
    },
    packageVersion() {
      const distTags = this.registryInfo["dist-tags"];
      if (distTags && distTags.latest) return distTags.latest;
      else return null;
    },
    packageVersions() {
      const versions = this.registryInfo.versions || {};
      const times = this.registryInfo.time;
      const versionKeys = Object.keys(versions).reverse();
      return versionKeys.map(x => {
        return {
          latest: x == this.packageVersion,
          timeSince: util.timeAgoFormat(times[x]),
          unity: versions[x].unity,
          version: x
        };
      });
    },
    pipelinesIcon() {
      if (!this.packageReleases.length) return "";
      const rel = this.packageReleases[0];
      if (rel.state == ReleaseState.Pending.value)
        return "far fa-clock text-warning";
      else if (rel.state == ReleaseState.Building.value)
        return "fa fa-circle-notch fa-spin";
      else if (rel.state == ReleaseState.Failed.value)
        return "fas fa-exclamation-triangle text-warning";
      return "";
    },
    readmeHtml() {
      const html =
        this.$site.themeConfig.region == "cn"
          ? this.$data.packageInfo.readmeHtml_zhCN
          : this.$data.packageInfo.readmeHtml;
      return html || this.$data.packageInfo.readmeHtml;
    },
    shouldShowMetaSubpageEntry() {
      return this.$mq == "xs" || this.$mq == "sm" || this.$mq == "md";
    },
    shouldShowMeta() {
      return !this.shouldShowMetaSubpageEntry || this.subPage == SubPage.meta;
    },
    subPages() {
      const ls = [
        { text: this.$t("readme"), value: SubPage.readme, visible: true },
        {
          text: this.$t("installation"),
          value: SubPage.meta,
          visible: this.shouldShowMetaSubpageEntry
        },
        {
          text: this.$t("dependencies"),
          value: SubPage.deps,
          visible: true,
          icon: this.dependenciesIcon,
          count: this.dependencies.length
        },
        {
          text: this.$t("versions"),
          value: SubPage.versions,
          visible: true,
          count: this.packageVersions.length
        },
        {
          text: this.$t("build-pipelines"),
          value: SubPage.pipelines,
          visible: true,
          icon: this.pipelinesIcon,
          count: this.packageReleases.length
        },
        {
          text: this.$t("related-packages"),
          value: SubPage.related,
          visible: true,
          count: (this.$page.frontmatter.relatedPackages || []).length
        }
      ];
      return ls.map(x => {
        return {
          ...x,
          link: { path: "", query: this.getQuery(x.value) },
          class: ["nav-link", x.value == this.subPage ? "active" : ""]
        };
      });
    },
    topics() {
      return this.$page.frontmatter.topics.map(topic => {
        const transKey = topic.slug;
        return {
          ...topic,
          text: this.$te(transKey) ? this.$t(transKey) : topic.name
        };
      });
    }
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      if (to.name != from.name) {
        Object.assign(this.$data, defaultData());
        this.onStart();
      }
      this.parseQuery();
    }
  },

  mounted() {
    this.onStart();
    this.parseQuery();
  },

  methods: {
    onStart() {
      this.fetchPackageInfo();
      this.fetchRegistryInfo();
    },
    /**
     * Fetch package info data.
     */
    async fetchPackageInfo() {
      try {
        let resp = await axios.get(
          urljoin(util.openupmPackagesApiUrl, this.$package.name),
          {
            headers: { Accept: "application/json" }
          }
        );
        this.$data.packageInfo = { ...resp.data };
      } catch (error) {
        console.error(error);
      } finally {
        this.$data.packageInfo.fetched = true;
      }
    },
    /**
     * Fetch registry info data.
     */
    async fetchRegistryInfo() {
      try {
        let resp = await axios.get(
          urljoin(util.openupmRegistryUrl, this.$package.name),
          {
            headers: { Accept: "application/json" }
          }
        );
        this.$data.registryInfo = { ...resp.data };
      } catch (error) {
        console.error(error);
      } finally {
        this.$data.registryInfo.fetched = true;
      }
    },
    /**
     * Get query data.
     */
    getQuery(subPage) {
      const query = { subPage };
      return query;
    },
    /**
     * Parse query to set initial values.
     */
    parseQuery() {
      // subPage
      const subPage = this.$route.query.subPage;
      if (this.subPages.map(x => x.value).includes(subPage)) {
        // Back to top if sub page changed
        if (this.subPage !== subPage)
          VueScrollTo.scrollTo("#contentview", 500, { offset: -150 });
        this.subPage = subPage;
      } else this.subPage = SubPage.readme;
    }
  }
};
</script>

<style lang="stylus">
.package-detail
  .mainview

    .tooltip-click, .tooltip-click a
      cursor pointer

    .topics-wrap
      margin-bottom 0.8rem
      .label
        font-size 0.7rem
        margin-right 0.3rem

    .skeleton-wrap
      max-width 28rem

    .column-meta
      max-width 17rem

    // hide the search field
    .content__default
      h6
        display none

  .sideview
    .subpage-section
      .menu-item
        label
          padding-right 0.2rem

@media (max-width: $MQMobile)
  .package-detail
    .mainview
      .column-meta
        max-width 100%
</style>
