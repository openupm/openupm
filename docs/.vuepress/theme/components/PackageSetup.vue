<template>
  <section class="col-12 install-section">
    <h2>
      Installation
      <i
        v-if="!isLoading && !version"
        class="fas fa-exclamation-triangle text-warning"
      ></i>
    </h2>
    <div v-if="!isLoading">
      <div v-if="version">
        <div class="install-option">
          <h3>
            via
            <a href="#modal-commandlinetool">command-line tool</a>
          </h3>
          <div class="install-cli">
            <div
              data-tooltip="Copied"
              class="tooltip tooltip-click"
              tabindex="-1"
              @click="copyCli"
            >
              <code>
                <i class="fas fa-angle-double-right"></i>
                {{ installCli }}
              </code>
            </div>
          </div>
        </div>
        <PackageSetupViaCLI :package-name="pkg.name" />
        <div class="install-option">
          <h3>
            via
            <a href="#modal-packageinstaller">package installer</a>
            <small
              ><span class="label label-secondary">experimental</span>
            </small>
            <div class="package-installer-btn-wrap btn-group btn-group-block">
              <a :href="installerLink.link" class="btn"
                >{{ installerLink.text }}
              </a>
            </div>
          </h3>
        </div>
        <PackageSetupViaInstaller
          :package-name="pkg.name"
          :installer-link="installerLink"
        />
      </div>
      <div v-else>
        <div>
          <span v-if="hasNotSucceededBuild"
            >The package has
            <RouterLink :to="pipelinesLink" :exact="false"
              >in-processing or failed builds.</RouterLink
            ></span
          >
          <span v-else>
            No valid <NavLink :item="repoTagsNavLink" /> detected. Please
            contact the package owner to create at least one valid Git tag.
          </span>
        </div>
      </div>
    </div>
    <div v-else>
      <VclList />
    </div>
  </section>
</template>

<script>
import copy from "copy-to-clipboard";
import { VclList } from "vue-content-loading";
import urljoin from "url-join";

import PackageSetupViaCLI from "@theme/components/PackageSetupViaCLI.vue";
import PackageSetupViaInstaller from "@theme/components/PackageSetupViaInstaller.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { PackageSetupViaCLI, PackageSetupViaInstaller, VclList },
  props: {
    isLoading: {
      type: Boolean,
      default: true
    },
    hasNotSucceededBuild: {
      type: Boolean,
      default: false
    },
    pkg: {
      type: Object,
      default: () => {}
    },
    version: {
      type: String,
      default: ""
    }
  },
  computed: {
    installCli() {
      return `openupm add ${this.pkg.name}`;
    },
    installerLink() {
      return {
        link: util.getPackageInstallerUrl(this.pkg.name, this.scopes),
        text: "Download installer.unitypackage"
      };
    },
    pipelinesLink() {
      return { path: "", query: { subPage: "pipelines" } };
    },
    repoTagsNavLink() {
      return {
        link: urljoin(this.pkg.repoUrl, "tags"),
        text: "GitHub tags"
      };
    }
  },
  methods: {
    copyCli() {
      copy(this.installCli, { format: "text/plain" });
    }
  }
};
</script>

<style lang="stylus" scoped>
.install-section
  padding 0.5rem !important;
  border 2px solid $borderColor !important;

  h3
    margin-bottom 0.4rem

  .install-option
    margin-bottom 0.5rem

    .btn
      max-width 100%
      text-overflow ellipsis
      overflow-x hidden

  .install-option:not(:last-child)
    margin-bottom 0.8rem

  .package-installer-btn-wrap
    margin-top 0.5rem

.install-cli
  position relative
  a
    &:hover
      text-decoration none !important
  code
    display block
    white-space nowrap
    overflow hidden
    padding 0.7rem
    font-size 0.75rem
    background-color transparent
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
</style>
