<template>
  <ParentLayout>
    <main class="home">
      <header class="hero">
        <div class="hero-body inner">
          <div>
            <h1 id="main-title">{{ $page.frontmatter.heroText }}</h1>
            <p class="action">
              <NavLink class="btn btn-lg btn-primary" :item="actionLink" />
              <NavLink class="btn btn-lg" :item="githubLink" />
            </p>
          </div>
        </div>
      </header>

      <section
        v-if="$page.frontmatter.features && $page.frontmatter.features.length"
        class="features container"
      >
        <div class="columns">
          <div
            v-for="(feature, index) in $page.frontmatter.features"
            :key="index"
            class="feature column col-4 col-md-12"
          >
            <h3>{{ feature.title }}</h3>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <p v-if="index != 0" v-html="feature.details"></p>
            <p v-else>
              {{ $t("hosting") }}
              <strong class="pkg-count">{{
                readyPackageCount || "..."
              }}</strong>
              {{ $t("hosting-2") }}
            </p>
          </div>
        </div>
      </section>
      <Content class="theme-default-content custom" />
      <SponsorFeatured />
      <ClientOnly>
        <PackageRecent />
      </ClientOnly>
      <social-share />
    </main>
  </ParentLayout>
</template>

<script>
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@theme/components/NavLink.vue";
import PackageRecent from "@theme/components/PackageRecent.vue";

export default {
  components: { PackageRecent, ParentLayout, NavLink },

  computed: {
    actionLink() {
      return {
        link: this.$page.frontmatter.actionLink,
        text: this.$page.frontmatter.actionText
      };
    },
    githubLink() {
      return {
        link:
          this.$site.themeConfig.region == "cn"
            ? "https://github.com/openupm/openupm/blob/master/README.zh-cn.md"
            : this.$site.themeConfig.repo,
        text: "GitHub",
        icon: "fab fa-github",
        iconLeft: true
      };
    },
    readyPackageCount() {
      var cnt = 0;
      const packagesExtra = this.$store.getters.packagesExtra;
      for (var name in packagesExtra) {
        const pkg = packagesExtra[name];
        if (pkg.ver) {
          cnt += 1;
        }
      }
      return cnt;
    }
  }
};
</script>

<style lang="stylus">
.home
  .hero
    padding-top 5.5rem
    padding-bottom 2rem

    .hero-body
      text-align center
      margin 0 auto
      h1
        margin-bottom 4rem

  .action
    .btn
      width 9rem
    .btn:not(:last-child)
      margin-right 1rem

  .features
    margin-bottom 3rem

    h3
      font-size 1.1rem
      color $accentColor

    .pkg-count
      display inline-block
      min-width 1.5rem
      text-align center

  h3
    margin-top 2rem

  .social-share
    text-align center
    margin-bottom 1rem

// @media (max-width: $MQMobile)
@media (max-width: $MQMobileNarrow)
  .home
    .action
      .btn
        width auto
        min-width 8rem
      .btn:not(:last-child)
        margin-right 0.6rem

    section, .theme-default-content
      padding 0 1rem!important

    .social-share
      margin-bottom 0.4rem

  .warning.custom-block
    margin: 0 -1rem !important
</style>
