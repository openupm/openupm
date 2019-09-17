<template>
  <div>
    <main class="home">
      <header class="hero">
        <div class="hero-body inner">
          <div>
            <h1 id="main-title">{{ data.heroText }}</h1>
            <p class="action" v-if="data.actionText && data.actionLink">
              <NavLink
                class="btn btn-lg btn-primary"
                :item="actionLink" />
              <NavLink
                class="btn btn-lg"
                :item="githubLink" />
            </p>
          </div>
        </div>
      </header>

      <section class="features container"
        v-if="data.features && data.features.length">
        <div class="columns">
          <div class="feature column col-4 col-md-12"
            v-for="(feature, index) in data.features"
            :key="index">
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.details }}</p>
          </div>
        </div>
      </section>
      <Content class="theme-default-content custom"/>
    </main>
    <Footer></Footer>
  </div>
</template>

<script>
import NavLink from '@parent-theme/components/NavLink.vue'
import Footer from './Footer.vue'

export default {
  components: { NavLink, Footer },

  computed: {
    data () {
      return this.$page.frontmatter
    },

    actionLink () {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      }
    },

    githubLink () {
      return {
        link: this.repoLink,
        text: 'GitHub'
      }
    },

    repoLink () {
      return this.$site.themeConfig.repo;
    },

  }
}
</script>

<style lang="stylus">
.home
  .hero
    padding-top 5.5rem
    padding-bottom 4rem
    .hero-body
      text-align center
      margin 0 auto;
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

// @media (max-width: $MQMobile)

@media (max-width: $MQMobileNarrow)
  .home
    .action
      .btn
        width auto


</style>