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
            via Package Manager
            <div class="package-installer-btn-wrap btn-group btn-group-block">
              <a href="#modal-manualinstallation" class="btn"
                >{{ $t("manual-installation") }}
              </a>
            </div>
          </h3>
        </div>
        <PackageSetupViaPackageManager
          :package-name="pkg.name"
          :package-version="version"
          :scopes="scopes"
        />
        <div class="install-option last">
          <h3>
            {{ $t("via") }}
            <a href="#modal-commandlinetool">{{
              $t("command-line-interface")
            }}</a>
          </h3>
          <div class="install-cli">
            <CopyWrapper :copy-text="installCli">
              <code>
                <i class="fas fa-angle-double-right"></i>
                {{ installCli }}
              </code>
            </CopyWrapper>
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
import { VclList } from "vue-content-loading";
import urljoin from "url-join";

import CopyWrapper from "@theme/components/CopyWrapper.vue";
import PackageSetupViaCLI from "@theme/components/PackageSetupViaCLI.vue";
import PackageSetupViaPackageManager from "@theme/components/PackageSetupViaPackageManager";

export default {
  components: {
    CopyWrapper,
    PackageSetupViaCLI,
    PackageSetupViaPackageManager,
    VclList,
  },
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
    hasNotSucceededBuild: {
      type: Boolean,
      default: false,
    },
    pkg: {
      type: Object,
      default: () => {},
    },
    version: {
      type: String,
      default: "",
    },
    scopes: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    installCli() {
      const cli =
        this.$site.themeConfig.region == "cn" ? "openupm-cn" : "openupm";
      return `${cli} add ${this.pkg.name}`;
    },
    pipelinesLink() {
      return { path: "", query: { subPage: "pipelines" } };
    },
    repoTagsNavLink() {
      return {
        link: urljoin(this.pkg.repoUrl, "tags"),
        text: this.$t("git-tag"),
      };
    },
  },
};
</script>

<style lang="stylus" scoped>
.install-section {
  padding: 0.5rem !important;
  border: 2px solid $borderColor !important;

  h3 {
    margin-bottom: 0.4rem;
  }

  .install-option {
    margin-bottom: 0.5rem;

    &.last {
      margin-bottom: 0.1rem;
    }

    .btn {
      max-width: 100%;
      text-overflow: ellipsis;
      overflow-x: hidden;
      font-size: $fontSizeMD;
    }
  }

  .package-installer-btn-wrap {
    margin-top: 0.5rem;
  }
}

.install-cli {
  position: relative;

  a {
    &:hover {
      text-decoration: none !important;
    }
  }

  code {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    padding: 0.7rem;
    font-size: 0.75rem;
    background-color: transparent;
    border: 1px solid $borderColor;
    color: $accentColor;
    cursor: pointer;

    &:hover {
      background-color: #fcf2f2;
    }

    &:before {
      color: #bcc3ce;
      content: attr(data-lang);
      font-size: 0.6rem;
      position: absolute;
      right: 0.2rem;
      top: 0.1rem;
    }
  }
}
</style>
