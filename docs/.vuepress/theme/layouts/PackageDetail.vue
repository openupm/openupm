<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="package-detail">
      <div class="main-container container">
        <div class="columns">
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
                  <NavLink :item="repoNavLink" />
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Author</h2>
                  <NavLink v-if="$package.ownerUrl" :item="ownerNavLink" />
                  <span v-else>{{ $package.owner }}</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Discovered by</h2>
                  <NavLink v-if="$package.hunterUrl" :item="hunterNavLink" />
                  <span v-else>{{ this.$package.hunter }}</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>License</h2>
                  <NavLink v-if="$package.licenseUrl" :item="licenseNavLink" />
                  <span v-else>{{ $package.licenseName }}</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Stars</h2>
                  <span>
                    <i class="fa fa-star"></i>
                    {{ repoInfo.stargazers_count }}
                  </span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Version</h2>
                  <span>TODO</span>
                </section>
                <section class="col-6 col-sm-12">
                  <h2>Published</h2>
                  <span>TODO</span>
                </section>
                <section class="col-12">
                  <h2>Build History</h2>
                  <div class="container">
                    <div class="columns">
                      <div class="col-6">TODO</div>
                      <div class="col-6"></div>
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
import superagent from "superagent";
import marked from "marked";
const urljoin = require("url-join");
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

import util from "@source/.vuepress/util";
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";

const apiRepoUrl = "https://api.github.com/repos/";

export default {
  components: { ParentLayout, NavLink },
  data() {
    return {
      readmeRaw: "",
      repoInfo: {}
    };
  },
  computed: {
    $package() {
      return this.$page.frontmatter.package;
    },
    packageName() {
      return this.$package.displayName || this.$package.name;
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
    licenseNavLink() {
      return {
        link: this.$package.licenseUrl,
        text: this.$package.licenseName
      };
    }
  },
  mounted() {
    this.fetchRepoReadme();
    this.fetchRepoInfo();
  },
  methods: {
    async fetchRepoReadme() {
      // Fetch repo readme.
      const title = "# " + this.packageName + "\n";
      try {
        const resp = await superagent
          .get(urljoin(apiRepoUrl, this.$package.repo, "readme"))
          .set("accept", "application/vnd.github.v3.raw");
        let readmeRaw = resp.text;
        // Insert h1 if need.
        if (!/^# /m.test(readmeRaw)) {
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
        const resp = await superagent
          .get(urljoin(apiRepoUrl, this.$package.repo))
          .set("accept", "application/vnd.github.v3.json");
        this.$data.repoInfo = resp.body;
      } catch (error) {
        console.error(error);
      }
    },
    repoUpdateAt() {
      try {
        if (this.repoInfo.updated_at) {
          const date = new Date(Date.parse(this.repoInfo.updated_at));
          return timeAgo.format(date);
        }
      } catch (error) {
        return "";
      }
    }
  }
};
</script>

<style lang="stylus">
.package-detail
  .main-container
    margin-top 2rem

    .theme-default-content
      max-width auto
      margin 0
      padding 0 0 2.5rem

      :first-child
        margin-top 0

    .meta-section
      padding-left 0.5rem

      h2
        font-weight 600
        border-bottom none

      a, h2, p, span
        font-size 0.75rem

      section
        border-bottom 1px solid $borderColor
        padding-bottom 0.5rem
        margin-bottom 0.7rem
</style>
