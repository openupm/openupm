<template>
  <ClientOnly>
    <div class="meta-section container">
      <div class="columns">
        <PackageSetup :has-not-succeeded-build="hasNotSucceededBuild" :is-loading="isLoadingPackageSetup" :pkg="pkg"
          :version="version" :scopes="scopes" />
        <section class="col-12">
          <h2>{{ $t("repository") }}</h2>
          <div>
            <span class="repo-link">
              <NavLink :item="repoNavLink" />
            </span>
          </div>
          <div v-if="parentRepoNavLink" class="fork">
            {{ $t("upstream") }}
            <NavLink :item="parentRepoNavLink" />
          </div>
        </section>
        <section class="col-6">
          <h2>Monthly Downloads</h2>
          <span class="monthly-downloads-count">{{ monthlyDownloadsCount }}</span>
        </section>
        <section class="col-6">
          <h2></h2>
          <sparkline v-bind:data="monthlyDownloadsList" class="monthly-downloads-chart"></sparkline>
        </section>
        <section class="col-6">
          <h2>{{ $t("version") }}</h2>
          <span>{{ version || "-" }}</span>
        </section>
        <section class="col-6">
          <h2>{{ $t("license") }}</h2>
          <span>{{ pkg.licenseSpdxId || pkg.licenseName || "-" }}</span>
        </section>
        <section class="col-6">
          <h2>{{ $t("unity-version") }}</h2>
          <span>{{ unityVersion || "-" }}</span>
        </section>
        <section class="col-6">
          <h2>{{ $t("stars") }}</h2>
          <span>
            <i class="fa fa-star"></i>
            {{ pkg.stars }}
          </span>
        </section>
        <section class="col-12">
          <h2>{{ $t("published") }}</h2>
          <span>{{ publishedAt || "-" }}</span>
        </section>
        <section class="col-6">
          <h2>{{ $t("authors") }}</h2>
          <a v-if="parentOwnerNavLink" :href="parentOwnerNavLink.link" class="nav-link external">
            <span class="chip">
              <LazyImage v-if="parentOwnerAvatarUrl" :src="parentOwnerAvatarUrl" :alt="pkg.parentOwner"
                class="avatar avatar-sm" />
              <i v-else class="fa fa-user"></i>
              {{ parentOwnerNavLink.text }}
            </span>
          </a>
          <a :href="ownerNavLink.link" class="nav-link external">
            <span class="chip">
              <LazyImage :src="ownerAvatarUrl" :alt="pkg.owner" class="avatar avatar-sm" />
              {{ ownerNavLink.text }}
            </span>
          </a>
        </section>
        <section class="col-6">
          <h2>{{ $t("discovered-by") }}</h2>
          <a v-if="pkg.hunterUrl" :href="hunterNavLink.link" class="nav-link external">
            <span class="chip">
              <LazyImage :src="hunterAvatarUrl" :alt="hunterNavLink.text" class="avatar avatar-sm" />
              {{ hunterNavLink.text }}
            </span>
          </a>
          <span v-else>{{ pkg.hunter }}</span>
        </section>
        <section class="col-12">
          <h2>
            {{ $t("badge") }}
          </h2>
          <div class="container">
            <div class="columns">
              <div class="col-6">
                <LazyImage :src="badgeVersionImageUrl" />
              </div>
              <div class="col-6">
                <CopyWrapper :copy-text="badgeVersionHtml">
                  <a>
                    <small> html </small>
                  </a>
                </CopyWrapper>
                <span><small>|</small></span>
                <CopyWrapper :copy-text="badgeVersionMarkdown">
                  <a>
                    <small> markdown </small>
                  </a>
                </CopyWrapper>
              </div>
            </div>
          </div>
        </section>
        <section class="col-12">
          <NavLink :item="reportLink" />
        </section>
      </div>
    </div>
  </ClientOnly>
</template>

<script>
import escape from "escape-html";
import urljoin from "url-join";

import CopyWrapper from "@theme/components/CopyWrapper.vue";
import NavLink from "@theme/components/NavLink.vue";
import PackageSetup from "@theme/components/PackageSetup.vue";
import util from "@root/docs/.vuepress/util";
import Sparkline from "@theme/components/Sparkline.vue";

export default {
  components: {
    CopyWrapper,
    NavLink,
    PackageSetup,
    Sparkline,
  },

  props: {
    hasNotSucceededBuild: {
      type: Boolean,
      default: false,
    },
    pkg: {
      type: Object,
      default: () => { },
    },
    packageInfo: {
      type: Object,
      default: () => { },
    },
    registryInfo: {
      type: Object,
      default: () => { },
    },
    monthlyDownloads: {
      type: Object,
      default: () => { },
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
    hunterAvatarUrl() {
      return this.pkg.hunter
        ? util.getAvatarImageUrl(this.pkg.hunter, 48)
        : null;
    },
    hunterNavLink() {
      return {
        link: this.pkg.hunterUrl,
        text: this.pkg.hunter,
      };
    },
    isLoadingPackageSetup() {
      return !this.registryInfo.fetched || !this.packageInfo.fetched;
    },
    monthlyDownloadsCount() {
      if (!this.monthlyDownloads.fetched) return "-";
      return this.monthlyDownloads.downloads.reduce((acc, curr) => acc + curr.downloads, 0).toLocaleString();
    },
    monthlyDownloadsList() {
      if (!this.monthlyDownloads.fetched) return Array(30).fill(0);
      return this.monthlyDownloads.downloads.map(item => item.downloads);
    },
    ownerAvatarUrl() {
      return util.getAvatarImageUrl(this.pkg.owner, 48);
    },
    ownerNavLink() {
      return {
        link: this.pkg.ownerUrl,
        text: this.pkg.owner,
      };
    },
    parentOwnerAvatarUrl() {
      return this.pkg.parentOwner
        ? util.getAvatarImageUrl(this.pkg.parentOwner, 48)
        : null;
    },
    parentOwnerNavLink() {
      if (this.pkg.parentRepoUrl)
        return {
          link: this.pkg.parentOwnerUrl,
          text: this.pkg.parentOwner,
        };
      return null;
    },
    parentRepoNavLink() {
      if (this.pkg.parentRepoUrl)
        return {
          link: this.pkg.parentRepoUrl,
          text: this.pkg.parentRepo,
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
        text: this.pkg.repo,
      };
    },
    reportLink() {
      return {
        link: "https://github.com/openupm/openupm/issues/new?title=Report%20package%20abuse&template=abuse.md",
        text: this.$t("report-malware-or-abuse"),
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
    },
  },

  methods: {
  },
};
</script>

<style lang="stylus">
.package-detail .meta-section {
  font-size: $fontSizeMD;
  padding-left: 0.5rem;

  h2 {
    font-weight: 600;
    color: $secondaryTextColor;
    border-bottom: none;
  }

  h2, h3 {
    font-size: $fontSizeMD;
  }

  section {
    border-bottom: 1px solid $borderColor;
    padding-bottom: 0.5rem;
    margin-bottom: 0.7rem;
    > span {
      font-size: 0.85rem;
      font-weight: bold;
    }
    span.monthly-downloads-count {
      display: block;
      height: 44px;
      padding-top: 22px;
    }
    span.chip {
      font-size: $fontSizeMD;
    }
    span.repo-link {
      font-size: $fontSizeMD;
      a {
        font-weight: bold;
      }
    }
  }

  ul.section-list {
    margin: 0;
    list-style: none;
  }

  img {
    vertical-align: middle;
  }

  i.fa-user {
    padding-right: 0.2rem;
    color: $textColor;
  }

  .fork {
    font-size: 0.7rem;

    a {
      font-size: 0.7rem;
    }
  }
}
</style>
