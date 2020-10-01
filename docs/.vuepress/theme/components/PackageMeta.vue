<template>
  <ClientOnly>
    <div class="meta-section container">
      <div class="columns">
        <PackageSetup
          :has-not-succeeded-build="hasNotSucceededBuild"
          :is-loading="isLoadingPackageSetup"
          :pkg="pkg"
          :version="version"
        />
        <section class="col-12">
          <h2>Project</h2>
          <div>
            <span><NavLink :item="repoNavLink"/></span>
          </div>
          <div v-if="parentRepoNavLink" class="fork">
            forked from
            <NavLink :item="parentRepoNavLink" />
          </div>
        </section>
        <section class="col-6">
          <h2>Author</h2>
          <a
            v-if="parentOwnerNavLink"
            :href="parentOwnerNavLink.link"
            class="nav-link external"
          >
            <span class="chip">
              <img
                v-if="pkg.parentOwnerAvatarUrl"
                :src="pkg.parentOwnerAvatarUrl + '?size=48'"
                :alt="pkg.parentOwner"
                class="avatar avatar-sm"
              />
              <i v-else class="fa fa-user"></i>
              {{ parentOwnerNavLink.text }}
            </span>
          </a>
          <a :href="ownerNavLink.link" class="nav-link external">
            <span class="chip">
              <img
                :src="pkg.ownerAvatarUrl + '?size=48'"
                :alt="pkg.owner"
                class="avatar avatar-sm"
              />
              {{ ownerNavLink.text }}
            </span>
          </a>
        </section>
        <section class="col-6">
          <h2>Discovered by</h2>
          <a
            v-if="pkg.hunterUrl"
            :href="hunterNavLink.link"
            class="nav-link external"
          >
            <span class="chip">
              <img
                :src="pkg.hunterAvatarUrl"
                :alt="hunterNavLink.text"
                class="avatar avatar-sm"
              />
              {{ hunterNavLink.text }}
            </span>
          </a>
          <span v-else>{{ pkg.hunter }}</span>
        </section>
        <section class="col-6">
          <h2>License</h2>
          <span>{{ pkg.licenseSpdxId || pkg.licenseName || "-" }}</span>
        </section>
        <section class="col-6">
          <h2>Stars</h2>
          <span>
            <i class="fa fa-star"></i>
            {{ pkg.stars }}
            <br />
            <small v-if="pkg.pstars">
              <i class="fa fa-star"></i> {{ pkg.pstars }} on
              <NavLink
                :item="{
                  link: pkg.parentRepoUrl,
                  text: 'upstream'
                }"
              />
            </small>
          </span>
        </section>
        <section class="col-6">
          <h2>Version</h2>
          <span>{{ version || "-" }}</span>
        </section>
        <section class="col-6">
          <h2>Unity Version</h2>
          <span>{{ unityVersion || "-" }}</span>
        </section>
        <section class="col-6 col-sm-12">
          <h2>Published</h2>
          <span>{{ publishedAt || "-" }}</span>
        </section>
        <section class="col-6 hide-sm"></section>
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
                  @click.prevent="copyBadgeVersionHtml"
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
                  @click.prevent="copyBadgeVersionMarkdown"
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
  </ClientOnly>
</template>

<script>
import copy from "copy-to-clipboard";
import escape from "escape-html";
import urljoin from "url-join";

import NavLink from "@theme/components/NavLink.vue";
import PackageSetup from "@theme/components/PackageSetup.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: {
    NavLink,
    PackageSetup
  },

  props: {
    hasNotSucceededBuild: {
      type: Boolean,
      default: false
    },
    pkg: {
      type: Object,
      default: () => {}
    },
    packageInfo: {
      type: Object,
      default: () => {}
    },
    registryInfo: {
      type: Object,
      default: () => {}
    }
  },

  computed: {
    badgeUrl() {
      return urljoin(this.$site.themeConfig.domain, this.$page.path);
    },
    badgeVersionHtml() {
      return `<a href="${escape(this.badgeUrl)}"><img src="${escape(
        this.badgeVersionImageUrl
      )}" /></a>`;
    },
    badgeVersionImageUrl() {
      return `https://img.shields.io/npm/v/${this.pkg.name}?label=openupm&registry_uri=https://package.openupm.com`;
    },
    badgeVersionMarkdown() {
      return `[![openupm](${this.badgeVersionImageUrl})](${this.badgeUrl})`;
    },
    hunterNavLink() {
      return {
        link: this.pkg.hunterUrl,
        text: this.pkg.hunter
      };
    },
    isLoadingPackageSetup() {
      return !this.registryInfo.fetched || !this.packageInfo.fetched;
    },
    ownerNavLink() {
      return {
        link: this.pkg.ownerUrl,
        text: this.pkg.owner
      };
    },
    parentOwnerNavLink() {
      if (this.pkg.parentRepoUrl)
        return {
          link: this.pkg.parentOwnerUrl,
          text: this.pkg.parentOwner
        };
      return null;
    },
    parentRepoNavLink() {
      if (this.pkg.parentRepoUrl)
        return {
          link: this.pkg.parentRepoUrl,
          text: this.pkg.parentRepo
        };
      return null;
    },
    publishedAt() {
      const time = this.registryInfo.time || {};
      const dateTimeStr = time[this.version];
      if (!dateTimeStr) return null;
      return util.timeAgoFormat(dateTimeStr);
    },
    scopes() {
      return this.packageInfo.scopes;
    },
    repoNavLink() {
      return {
        link: this.pkg.repoUrl,
        text: this.pkg.repo
      };
    },
    unityVersion() {
      const versions = this.registryInfo.versions || {};
      const entry = versions[this.version];
      if (!entry) return null;
      return entry.unity;
    },
    version() {
      const distTags = this.registryInfo["dist-tags"];
      if (distTags && distTags.latest) return distTags.latest;
      else return null;
    }
  },

  methods: {
    copyBadgeVersionHtml() {
      copy(this.badgeVersionHtml, { format: "text/plain" });
    },
    copyBadgeVersionMarkdown() {
      copy(this.badgeVersionMarkdown, { format: "text/plain" });
    },
    copyCli() {
      copy(this.installCli, { format: "text/plain" });
    }
  }
};
</script>

<style lang="stylus">
.package-detail .meta-section
  font-size $fontSizeMD
  padding-left 0.5rem
  padding-bottom 1rem

  h2
    font-weight 600
    border-bottom none

  h2, h3
    font-size $fontSizeMD

  section
    border-bottom 1px solid $borderColor
    padding-bottom 0.5rem
    margin-bottom 0.7rem

  ul.section-list
    margin 0
    list-style none

  img
    vertical-align middle

  i.fa-user
    padding-right 0.2rem
    color $textColor

  .fork
    font-size 0.6rem
    a
      font-size 0.6rem
</style>
