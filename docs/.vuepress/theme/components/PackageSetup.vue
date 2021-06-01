<template>
  <section class="col-12 install-section">
    <h2>
      {{ $t("installation") }}
      <i
        v-if="!isLoading && !version"
        class="fas fa-exclamation-triangle text-warning"
      ></i>
    </h2>
    <div v-if="!isLoading">
      <div v-if="version">
        <div class="install-option">
          <h3>
            {{ $t("via") }}
            <a href="#modal-packageinstaller">{{ $t("package-installer") }}</a>
            <small
              ><span class="label label-secondary">{{
                $t("experimental")
              }}</span>
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
        <div class="install-option last">
          <h3>
            {{ $t("via") }}
            <a href="#modal-commandlinetool">{{
              $t("command-line-interface")
            }}</a>
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
      </div>
      <div v-else>
        <div>
          <span v-if="hasNotSucceededBuild"
            >{{ $t("has-not-succeeded-build") }}
            <RouterLink :to="pipelinesLink" :exact="false">{{
              $t("has-not-succeeded-build-2")
            }}</RouterLink></span
          >
          <span v-else>
            {{ $t("has-no-valid-tag") }} <NavLink :item="repoTagsNavLink" />
            {{ $t("has-no-valid-tag-2") }}
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
      const cli =
        this.$site.themeConfig.region == "cn" ? "openupm-cn" : "openupm";
      return `${cli} add ${this.pkg.name}`;
    },
    installerLink() {
      return {
        link: util.getPackageInstallerUrl(this.pkg.name, this.scopes),
        text: this.$t("get") + " installer.unitypackage"
      };
    },
    pipelinesLink() {
      return { path: "", query: { subPage: "pipelines" } };
    },
    repoTagsNavLink() {
      return {
        link: urljoin(this.pkg.repoUrl, "tags"),
        text: this.$t("git-tag")
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

    &.last
      margin-bottom 0.1rem

    .btn
      max-width 100%
      text-overflow ellipsis
      overflow-x hidden
      font-size $fontSizeMD

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
