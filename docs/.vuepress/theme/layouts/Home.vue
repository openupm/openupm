<template>
  <ParentLayout>
    <main class="home">
      <header class="hero">
        <div class="hero-body inner">
          <div>
            <h1 id="main-title">{{ $page.frontmatter.heroText }}</h1>
            <p class="action">
              <NavLink class="btn btn-lg btn-primary" :item="actionLink" />
              <a
                :href="githubLink.link"
                target="_blank"
                rel="noopener noreferrer"
                class="nav-link external btn btn-lg"
              >
                {{ githubLink.text }}
              </a>
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
              Hosting <strong>{{ $page.packageCount }}</strong> community
              selective open source UPM packages and counting
            </p>
          </div>
        </div>
      </section>
      <Content class="theme-default-content custom" />
    </main>
  </ParentLayout>
</template>

<script>
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";

export default {
  components: { ParentLayout, NavLink },

  computed: {
    actionLink() {
      return {
        link: this.$page.frontmatter.actionLink,
        text: this.$page.frontmatter.actionText
      };
    },
    githubLink() {
      return {
        link: this.$site.themeConfig.repo,
        text: "Star on GitHub"
      };
    }
  }
};
</script>

<style lang="stylus">
.home
  .hero
    padding-top 5.5rem
    padding-bottom 4rem

    .hero-body
      text-align center
      margin 0 auto

      h1
        margin-bottom 4rem

  .action
    .btn
      margin-right 1rem
      width 9rem

  .features
    margin-bottom 4rem

    h3
      font-size 1.1rem
      color $accentColor

  .social-share
    text-align center
    margin-bottom 1rem

// @media (max-width: $MQMobile)
@media (max-width: $MQMobileNarrow)
  .home
    .action
      .btn
        width auto
</style>
