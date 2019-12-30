<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="package-detail">
      <div class="main-container container">
        <div class="columns breadcrumb-wrap">
          <div class="column col-12">
            <ul class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li class="breadcrumb-item">
                <a href="/packages/">Packages</a>
              </li>
              <li class="breadcrumb-item">
                <a href="#">{{ $package.name }}</a>
              </li>
            </ul>
          </div>
          <div class="column col-8 col-sm-12">
            <div class="theme-default-content">
              <div v-if="$data.readmeRaw" class="readme-wrap">
                <div v-html="readmeHtml"></div>
              </div>
              <p v-else class="readme-wrap">loading...</p>
              <div class="divider"></div>
              <p><NavLink :item="editNavLink" /></p>
            </div>
          </div>
          <div class="column col-4 col-sm-12">
            <div class="meta-section container">
              <div class="columns">
                <section class="col-12">
                  <h2>Install <small>(click to copy)</small></h2>
                  <div class="install-cli">
                    <div
                      data-tooltip="Copied"
                      class="tooltip tooltip-click"
                      tabindex="-1"
                      @click="onCopyCli"
                    >
                      <code>
                        <i class="fas fa-angle-double-right"></i>
                        {{ packageInstallCli }}
                      </code>
                    </div>
                  </div>
                </section>
                <section class="col-12">
                  <h2>Project</h2>
                  <div><NavLink :item="repoNavLink" /></div>
                  <div v-if="parentRepoNavLink" class="fork">
                    forked from
                    <NavLink :item="parentRepoNavLink" />
                  </div>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Author</h2>
                  <a
                    v-if="parentOwnerNavLink"
                    :href="parentOwnerNavLink.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="nav-link external"
                  >
                    <span class="chip">
                      <img
                        v-if="$package.parentOwnerAvatarUrl"
                        :src="$package.parentOwnerAvatarUrl"
                        :alt="$package.parentOwner"
                        class="avatar avatar-sm"
                      />
                      <i v-else class="fa fa-user"></i>
                      {{ parentOwnerNavLink.text }}
                    </span>
                  </a>
                  <a
                    :href="ownerNavLink.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="nav-link external"
                  >
                    <span class="chip">
                      <img
                        :src="$package.ownerAvatarUrl"
                        :alt="$package.owner"
                        class="avatar avatar-sm"
                      />
                      {{ ownerNavLink.text }}
                    </span>
                  </a>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Discovered by</h2>
                  <a
                    v-if="$package.hunterUrl"
                    :href="hunterNavLink.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="nav-link external"
                  >
                    <span class="chip">
                      <img
                        :src="$package.hunterAvatarUrl"
                        :alt="hunterNavLink.text"
                        class="avatar avatar-sm"
                      />
                      {{ hunterNavLink.text }}
                    </span>
                  </a>
                  <span v-else>{{ this.$package.hunter }}</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>License</h2>
                  <span>{{
                    $package.licenseSpdxId || $package.licenseName
                  }}</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Stars</h2>
                  <span>
                    <i class="fa fa-star"></i>
                    {{ packageStargazersCount }}
                  </span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Version</h2>
                  <span>{{ packageVersion }}</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Published</h2>
                  <span>{{ packagePublishedAt }}</span>
                </section>
                <section v-if="!noTagsFound" class="col-12">
                  <h2>Version history</h2>
                  <div class="container">
                    <ul class="build-history">
                      <li
                        v-for="build in packageSucceededBuilds"
                        :key="build.id"
                        class="columns"
                      >
                        <div class="col-6">
                          <i :class="build.class"></i>
                          {{ build.build.version }}
                        </div>
                        <div class="col-6">
                          {{ build.timeSince }}
                        </div>
                      </li>
                    </ul>
                  </div>
                </section>
                <section
                  v-if="noTagsFound || packageNotSucceededBuilds.length"
                  class="col-12"
                >
                  <h2>Build Issues</h2>
                  <div v-if="noTagsFound" class="toast">
                    <p>
                      No tags found in <NavLink :item="tagsNavLink" />. Please
                      checkout docs
                      <a
                        href="/docs/adding-upm-package.html#handling-repository-without-releases"
                      >
                        handling repository without releases.
                      </a>
                    </p>
                  </div>
                  <div class="container">
                    <ul class="build-history">
                      <li
                        v-for="build in packageNotSucceededBuilds"
                        :key="build.id"
                        class="columns"
                      >
                        <div class="col-6">
                          <i :class="build.class"></i>
                          {{ build.id }}
                        </div>
                        <div class="col-6">
                          <a
                            v-if="build.build.buildId"
                            :href="build.buildUrl"
                            target="_blank"
                            build="noopener noreferrer"
                            >{{ build.text }}</a
                          >
                          <span v-else>{{ build.text }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </section>
                <section v-if="packageInvalidTags.length" class="col-12">
                  <h2
                    class="tooltip tooltip-top"
                    data-tooltip="These tags are ignored by build pipelines"
                  >
                    Non-semver / duplicated tags
                    <i class="fa fa-info-circle"></i>
                  </h2>
                  <div>{{ packageInvalidTagsString }}</div>
                </section>
                <section class="col-12">
                  <h2>Badge <small>(click to copy)</small></h2>
                  <div class="container">
                    <div class="columns">
                      <div class="col-6">
                        <img :src="badgeVersionImageUrl" />
                      </div>
                      <div class="col-6">
                        <a
                          :href="badgeUrl"
                          data-tooltip="Copied"
                          class="tooltip tooltip-click"
                          @click.prevent="onCopyBadgeVersionHtml"
                        >
                          <small>
                            html
                          </small>
                        </a>
                        <span>·</span>
                        <a
                          :href="badgeUrl"
                          data-tooltip="Copied"
                          class="tooltip tooltip-click"
                          @click.prevent="onCopyBadgeVersionMarkdown"
                        >
                          <small>
                            markdown
                          </small>
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Content class="theme-default-content custom" />
    </main>
  </ParentLayout>
</template>

<script>
import axios from "axios";
import escape from "escape-html";
import copy from "copy-to-clipboard";
import marked from "marked";
import { noCase } from "change-case";
import urljoin from "url-join";

import util from "@root/docs/.vuepress/util";
import { ReleaseState, ReleaseReason } from "@root/app/models/common";
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";

const apiRepoUrl = "https://api.github.com/repos/";

const apiPackageUrl = urljoin(util.apiUrl, "/packages/");

const openupmCliRepoUrl = "https://github.com/openupm/openupm-cli#openupm-cli";

const openupmRepoUrl = "https://github.com/openupm/openupm";

const defaultData = function() {
  return {
    readmeRaw: "",
    repoInfo: {},
    packageInfo: {},
    noTagsFound: false,
    openupmCliRepoUrl
  };
};

export default {
  components: { ParentLayout, NavLink },
  data() {
    return defaultData();
  },
  computed: {
    $package() {
      return this.$page.frontmatter.package;
    },
    packageName() {
      return this.$package.displayName || this.$package.name;
    },
    packageVersion() {
      return this.packageCurrentBuild
        ? this.packageCurrentBuild.build.version
        : "-";
    },
    packagePublishedAt() {
      return this.packageCurrentBuild
        ? this.packageCurrentBuild.timeSince
        : "-";
    },
    packageBuilds() {
      let builds = this.$data.packageInfo.releases;
      const getTimeSince = function(epochTime) {
        try {
          const date = new Date(epochTime);
          return util.timeAgoFormat(date);
        } catch (error) {
          return "";
        }
      };
      if (builds && builds.length) {
        let objs = [];
        for (let build of builds) {
          let obj = {
            id: build.version,
            build,
            class: "",
            text: "",
            state: ReleaseState.get(build.state),
            reason: ReleaseReason.get(build.reason),
            buildUrl: util.getAzureWebBuildUrl(build.buildId),
            timeSince: getTimeSince(build.updatedAt)
          };
          if (obj.state == ReleaseState.Pending) {
            obj.class = "fa fa-clock-o";
            obj.text = "pending";
          } else if (obj.state == ReleaseState.Building) {
            obj.class = "fa fa-spinner fa-spin";
            obj.text = "building";
          } else if (obj.state == ReleaseState.Succeeded) {
            obj.class = "fa fa-check-circle text-success";
          } else if (obj.state == ReleaseState.Failed) {
            obj.class = "fa fa-times-circle text-error";
            let reasonText = noCase(obj.reason.key);
            if (reasonText == "none") reasonText = "unknown";
            obj.text = reasonText;
          }
          objs.push(obj);
        }
        return objs;
      }
      return [];
    },
    packageSucceededBuilds() {
      return this.packageBuilds.filter(x => x.state == ReleaseState.Succeeded);
    },
    packageNotSucceededBuilds() {
      return this.packageBuilds.filter(x => x.state != ReleaseState.Succeeded);
    },
    packageCurrentBuild() {
      const builds = this.packageSucceededBuilds;
      return builds.length ? builds[0] : null;
    },
    packageInvalidTags() {
      return this.$data.packageInfo.invalidTags || [];
    },
    packageInvalidTagsString() {
      let tags = this.packageInvalidTags;
      if (tags.length == 2) return `${tags[0]} and ${tags[1]}.`;
      else if (tags.length == 1) return tags[0];
      else if (tags.length == 0) return "";
      else {
        let num = tags.length - 2;
        return `${tags[0]}, ${tags[1]} and ${num} more`;
      }
    },
    packageStargazersCount() {
      const repoInfo = this.$data.repoInfo;
      let count = 0;
      count += repoInfo.stargazers_count || 0;
      count += (repoInfo.parent && repoInfo.parent.stargazers_count) || 0;
      return count;
    },
    packageInstallCli() {
      const name = this.$package.name;
      const repoUrl = this.$package.repoUrl;
      const repoBranch = this.$package.repoBranch;
      if (this.packageSucceededBuilds.length) return `openupm add ${name}`;
      else if (!this.$package.packageFolder) {
        let cli = `openupm add ${name}@${repoUrl}`;
        if (this.$package.repoBranch != "master") cli += `#${repoBranch}`;
        return cli;
      } else return "not available";
    },
    badgeVersionHtml() {
      return `<a href="${escape(this.badgeUrl)}"><img src="${escape(
        this.badgeVersionImageUrl
      )}" /></a>`;
    },
    badgeVersionMarkdown() {
      return `[![openupm](${this.badgeVersionImageUrl})](${this.badgeUrl})`;
    },
    readmeHtml() {
      if (!this.$data.readmeRaw) return "";
      else {
        const renderer = util.markedRenderer({
          linkBaseUrl: urljoin(this.$package.repoUrl, "blob/master"),
          imageBaseUrl: urljoin(this.$package.repoUrl, "raw/master/")
        });
        return marked(this.$data.readmeRaw, {
          renderer: renderer
        });
      }
    },
    repoNavLink() {
      return {
        link: this.$package.repoUrl,
        text: this.$package.repo
      };
    },
    parentRepoNavLink() {
      if (this.$package.parentRepoUrl)
        return {
          link: this.$package.parentRepoUrl,
          text: this.$package.parentRepo
        };
      return null;
    },
    ownerNavLink() {
      return {
        link: this.$package.ownerUrl,
        text: this.$package.owner
      };
    },
    parentOwnerNavLink() {
      if (this.$package.parentRepoUrl)
        return {
          link: this.$package.parentOwnerUrl,
          text: this.$package.parentOwner
        };
      return null;
    },
    hunterNavLink() {
      return {
        link: this.$package.hunterUrl,
        text: this.$package.hunter
      };
    },
    tagsNavLink() {
      return {
        link: urljoin(this.$package.repoUrl, "tags"),
        text: "Github Tags"
      };
    },
    editNavLink() {
      return {
        link: urljoin(
          openupmRepoUrl,
          "/blob/master/data/packages",
          this.$package.name + ".yml"
        ),
        text: "Edit this package"
      };
    },
    badgeUrl() {
      return urljoin(this.$site.themeConfig.domain, this.$page.path);
    },
    badgeVersionImageUrl() {
      return `https://img.shields.io/npm/v/${this.$package.name}?label=openupm&registry_uri=https://package.openupm.com`;
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      Object.assign(this.$data, defaultData());
      this.onStart();
    }
  },
  mounted() {
    this.onStart();
  },
  methods: {
    onStart() {
      this.fetchRepoReadme();
      this.fetchRepoInfo();
      this.fetchRepoTagsInfo();
      this.fetchPackageInfo();
    },
    async fetchRepoReadme() {
      // Fetch repo readme.
      const title = "# " + this.packageName + "\n";
      try {
        let resp = await axios.get(
          urljoin(apiRepoUrl, this.$package.repo, "readme"),
          { headers: { Accept: "application/vnd.github.v3.raw" } }
        );
        let readmeRaw = resp.data;
        // Insert h1 if need.
        if (
          !/^# /m.test(readmeRaw) &&
          !/^===/m.test(readmeRaw) &&
          !/^<h1/m.test(readmeRaw)
        ) {
          readmeRaw = title + readmeRaw;
        }
        this.$data.readmeRaw = readmeRaw;
      } catch (error) {
        console.error(error);
        // Rollback to default readme.
        this.$data.readmeRaw = `${title}
${this.$package.description}

See more in the [${this.$package.repo}](${this.$package.repoUrl}) repository.
`;
      }
    },
    async fetchRepoInfo() {
      try {
        let resp = await axios.get(urljoin(apiRepoUrl, this.$package.repo), {
          headers: { Accept: "application/vnd.github.v3.json" }
        });
        this.$data.repoInfo = resp.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchRepoTagsInfo() {
      try {
        let resp = await axios.get(
          urljoin(apiRepoUrl, this.$package.repo, "tags"),
          {
            headers: { Accept: "application/vnd.github.v3.json" }
          }
        );
        this.$data.noTagsFound = resp.data.length == 0;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPackageInfo() {
      try {
        let resp = await axios.get(urljoin(apiPackageUrl, this.$package.name), {
          headers: { Accept: "application/json" }
        });
        this.$data.packageInfo = resp.data;
      } catch (error) {
        console.error(error);
      }
    },
    onCopyCli() {
      copy(this.packageInstallCli, { format: "text/plain" });
    },
    onCopyBadgeVersionHtml() {
      copy(this.badgeVersionHtml, { format: "text/plain" });
    },
    onCopyBadgeVersionMarkdown() {
      copy(this.badgeVersionMarkdown, { format: "text/plain" });
    }
  }
};
</script>

<style lang="stylus">
.package-detail
  .main-container
    margin-top 1rem

    .readme-wrap
      margin-bottom 2rem

    .theme-default-content
      max-width auto
      margin 0
      padding 0 0 2.5rem
      font-size 0.75rem
      :first-child
        margin-top 0
      ol
        list-style decimal

    .meta-section
      padding-left 0.5rem

      h2
        font-weight 600
        border-bottom none

      a, h2, p, span, ul, li, div.toast
        font-size 0.75rem

      div.toast
        p
          font-size 0.7rem

      section:not(:first-child):not(:last-child)
        border-bottom 1px solid $borderColor
        padding-bottom 0.5rem
        margin-bottom 0.7rem

      ul.build-history
        margin 0;
        list-style none

      .install-cli
        position relative
        margin-bottom .8rem
        a
          &:hover
            text-decoration none !important
        code
          display block
          white-space nowrap
          overflow hidden
          margin-bottom 0.4rem
          padding 0.7rem
          font-size 0.75rem
          background-color #fff
          border 1px solid $borderColor
          color $accentColor
          cursor pointer
          &:hover
            background-color #fcf2f2
          &:before
            color #bcc3ce
            content attr(data-lang)
            font-size .6rem
            position absolute
            right .2rem
            top .1rem

      i, img
        vertical-align middle

      i.fa-user
        padding-right 0.2rem
        color $textColor

      .fork
        font-size 0.6rem
        a
          font-size 0.6rem
</style>
