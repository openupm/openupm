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
              <div v-if="$data.readmeRaw">
                <div v-html="readmeHtml"></div>
              </div>
              <p v-else>loading...</p>
            </div>
          </div>
          <div class="column col-4 col-sm-12">
            <div class="meta-section container">
              <div class="columns">
                <section class="col-12">
                  <h2>Project</h2>
                  <div><NavLink :item="repoNavLink" /></div>
                  <div v-if="parentNavLink" class="fork">
                    forked from
                    <NavLink :item="parentNavLink" />
                  </div>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Author</h2>
                  <NavLink :item="ownerNavLink" />
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Discovered by</h2>
                  <NavLink v-if="$package.hunterUrl" :item="hunterNavLink" />
                  <span v-else>{{ this.$package.hunter }}</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>License</h2>
                  <span>{{ $package.licenseName }}</span>
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
                <section class="col-12">
                  <h2>Installation</h2>
                  <div class="install-cli">
                    <code
                      class="bg-gray text-primary text-bold"
                      data-lang="shell"
                    >
                      openupm add {{ $package.name }}
                    </code>
                    <div class="action text-right">
                      <a
                        :href="openupmCliRepoUrl"
                        class="btn btn-secondary btn-sm "
                      >
                        Install openupm-cli
                      </a>
                      <button
                        class="btn btn-primary btn-sm tooltip tooltip-click"
                        data-tooltip="Copied"
                        @click="onCopyClick"
                      >
                        Copy text
                      </button>
                    </div>
                  </div>
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
                  v-if="noTagsFound || packageFailedBuilds.length"
                  class="col-12"
                >
                  <h2>Build Issues</h2>
                  <div v-if="noTagsFound">
                    No tags found in <NavLink :item="tagsNavLink" />
                  </div>
                  <div class="container">
                    <ul class="build-history">
                      <li
                        v-for="build in packageFailedBuilds"
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
                    data-tooltip="Non-semver and duplicated tags are ignored"
                  >
                    Non-semver and duplicated tags
                    <i class="fa fa-info-circle"></i>
                  </h2>
                  <div>{{ packageInvalidTagsString }}</div>
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
import copy from "copy-to-clipboard";
import marked from "marked";
import { noCase } from "change-case";
const urljoin = require("url-join");

import util from "@root/docs/.vuepress/util";
import { ReleaseState, ReleaseReason } from "@root/app/models/common";
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";

const apiRepoUrl = "https://api.github.com/repos/";

const apiPackageUrl = urljoin(util.apiUrl, "/packages/");

export default {
  components: { ParentLayout, NavLink },
  data() {
    return {
      readmeRaw: "",
      repoInfo: {},
      packageInfo: {},
      noTagsFound: false,
      openupmCliRepoUrl: "https://github.com/openupm/openupm-cli#openupm-cli"
    };
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
    packageFailedBuilds() {
      return this.packageBuilds.filter(x => x.state == ReleaseState.Failed);
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
    parentNavLink() {
      if (this.$package.parentUrl)
        return {
          link: this.$package.parentUrl,
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
    }
  },
  mounted() {
    this.fetchRepoReadme();
    this.fetchRepoInfo();
    this.fetchRepoTagsInfo();
    this.fetchPackageInfo();
  },
  methods: {
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
          !/^====/m.test(readmeRaw) &&
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
    onCopyClick() {
      const text = `openupm add ${this.$package.name}`;
      copy(text, { format: "text/plain" });
    }
  }
};
</script>

<style lang="stylus">
.package-detail
  .main-container
    margin-top 1rem

    .theme-default-content
      max-width auto
      margin 0
      padding 0 0 2.5rem
      font-size 0.75rem

      :first-child
        margin-top 0

    .meta-section
      padding-left 0.5rem

      h2
        font-weight 600
        border-bottom none

      a, h2, p, span, ul, li
        font-size 0.75rem

      section
        border-bottom 1px solid $borderColor
        padding-bottom 0.5rem
        margin-bottom 0.7rem

      ul.build-history
        margin 0;
        list-style none

      .install-cli
        position relative
        code
          display block
          margin-bottom 0.4rem
          padding 1.1rem 0.4rem 0.8rem
          &:before
            color #bcc3ce
            content attr(data-lang)
            font-size .7rem
            position absolute
            right .4rem
            top .1rem

      .fork
        font-size 0.6rem
        a
          font-size 0.6rem
</style>
