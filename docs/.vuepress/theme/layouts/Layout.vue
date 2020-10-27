<!-- Override @parent-theme/layouts/Layouts
- Add unnamed slot for extending.
- Add footer
- Add inital loading
-->

<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <InitialLoading />
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>

    <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <slot slot="top" name="sidebar-top">
        <div v-if="shouldShowSidebarAds" class="adp adp-sidebar hide-sm">
          <AdBlock />
        </div>
      </slot>
      <slot slot="bottom" name="sidebar-bottom" />
    </Sidebar>

    <GrowthBlock />

    <!-- unnamed slot for main content -->
    <slot></slot>

    <Page v-if="!$page.frontmatter.layout" :sidebar-items="sidebarItems">
      <slot slot="top" name="page-top" />
      <slot slot="bottom" name="page-bottom" />
    </Page>

    <!-- named slot for footer -->
    <slot name="footer">
      <Footer v-if="shouldShowFooter"></Footer>
    </slot>
    <script
      src="/vendors/cookieconsent@3.1.1/build/cookieconsent.min.js"
      data-cfasync="false"
    ></script>
  </div>
</template>

<script>
import AdBlock from "@theme/components/AdBlock.vue";
import Footer from "@theme/components/Footer.vue";
import GrowthBlock from "@theme/components/GrowthBlock.vue";
import InitialLoading from "@theme/components/InitialLoading.vue";
import Navbar from "@theme/components/Navbar.vue";
import util from "@root/docs/.vuepress/util";
import Page from "@parent-theme/components/Page.vue";
import { resolveSidebarItems } from "@parent-theme/util";
import Sidebar from "@parent-theme/components/Sidebar.vue";

export default {
  components: {
    AdBlock,
    Footer,
    GrowthBlock,
    InitialLoading,
    Navbar,
    Page,
    Sidebar
  },

  data() {
    return {
      isSidebarOpen: false
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        (frontmatter.sidebar !== undefined ? frontmatter.sidebar : false) &&
        this.sidebarItems.length
      );
    },

    shouldShowAds() {
      const { frontmatter } = this.$page;
      return frontmatter.ads !== undefined ? frontmatter.ads : true;
    },

    shouldShowSidebarAds() {
      return this.shouldShowAds && this.shouldShowSidebar;
    },

    shouldShowFooter() {
      const { frontmatter } = this.$page;
      return frontmatter.showFooter !== false;
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      );
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar
        },
        userPageClass,
        `region-${this.$site.themeConfig.region}`
      ];
    }
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
    window.addEventListener("load", () => {
      this.initCookieConsent();
    });
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
      this.$emit("toggle-sidebar", this.isSidebarOpen);
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },

    initCookieConsent() {
      window.cookieconsent.initialise({
        palette: {
          popup: {
            background: "#3937a3"
          },
          button: {
            background: "#e62576"
          }
        },
        content: {
          message: this.$t("cookie-consent-message"),
          dismiss: this.$t("cookie-consent-dismiss"),
          link: this.$t("learn-more"),
          href: util.getDocsUrl("/docs/privacy")
        },
        // eslint-disable-next-line no-unused-vars
        onStatusChange: function(status) {},
        // eslint-disable-next-line no-unused-vars
        onInitialise: function(status) {}
      });
    }
  }
};
</script>
