<template>
  <main class="home" aria-labelledby="main-title">
    <header class="hero">
      <div class="inner">
        <div class="left">
          <img class="hero-logo"
            v-if="data.heroImage"
            :src="$withBase(data.heroImage)"
            alt="hero"
          >
        </div>
        <div class="right">
          <h1 id="main-title">{{ data.heroText }}</h1>
          <p class="action" v-if="data.actionText && data.actionLink">
            <NavLink
              class="action-button"
              :item="actionLink"
            />
            <NavLink
              class="action-button white"
              :item="githubLink"
            />
          </p>
        </div>
      </div>
    </header>

    <div
      class="features"
      v-if="data.features && data.features.length"
    >
      <div
        class="feature"
        v-for="(feature, index) in data.features"
        :key="index"
      >
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div>

    <Content class="theme-default-content custom"/>

    <div class="footer">
      <p>Released under the <a href="https://opensource.org/licenses/MIT">MIT License</a></p>
      <p>Copyright @ 2019 Favo Yang</p>
    </div>
  </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'

export default {
  components: { NavLink },

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
        text: this.data.githubText
      }
    },

    repoLink () {
      const { repo } = this.$site.themeConfig
      if (repo) {
        return /^https?:/.test(repo)
          ? repo
          : `https://github.com/${repo}`
      }
    },

  }
}
</script>

<style lang="stylus">
.home
  padding $navbarHeight 2rem 0
  max-width 960px
  margin 0px auto
  display block
  .hero
    padding 40px 40px 30px
    h2.openupm
      display none
    .inner
      margin 0 auto
    .left
      width 35%
      display inline-block
      vertical-align top
    .right
      width 64%;
      display inline-block
      vertical-align top
    .hero-logo
      width 215px
      display block
      float right
      margin-right 60px
    h1
      font-size 3rem
      font-weight 300
    h1, .description, .action
      margin 1.8rem auto
    .description
      max-width 35rem
      font-size 1.6rem
      line-height 1.3
      color lighten($textColor, 40%)
    .action-button
      margin 1em 1% 1em 0
      display inline-block
      font-size 1.05rem
      font-weight 600
      letter-spacing 0.1em
      color #fff
      background-color $accentColor
      padding 0.75rem 2rem
      border-radius 2rem
      transition background-color .1s ease
      box-sizing border-box
      border: 1px solid
      // border-bottom 1px solid darken($accentColor, 10%)
      &:hover
        background-color lighten($accentColor, 10%)
      &.white
        background-color white
        color: $accentColor
  .features
    padding 0 0 1.2rem 0
    display flex
    flex-wrap wrap
    align-items flex-start
    align-content stretch
    justify-content space-between
  .feature
    flex-grow 1
    flex-basis 30%
    max-width 30%
    h2
      font-size 1.4rem
      font-weight 500
      border-bottom none
      padding-bottom 0
      color lighten($textColor, 10%)
    p
      color lighten($textColor, 25%)
  .footer
    padding 2.5rem
    border-top 1px solid $borderColor
    text-align center
    color lighten($textColor, 25%)

@media (max-width: $MQMobile)
  .home
    .features
      flex-direction column
    .feature
      max-width 100%
      padding 0 2.5rem

@media (max-width: $MQMobileNarrow)
  .home
    padding-left 1rem
    padding-right 1rem
    .hero
      padding 20px 10px
      img
        max-height 210px
        margin 2rem auto 1.2rem
      h1
        font-size 1.7rem
        text-align center
      .action
        text-align center
      h1, .description, .action
        margin 1.2rem auto
      .description
        font-size 1.2rem
      .action-button
        font-size 1rem
        padding 0.6rem 1.2rem
      .left
        width 100%
      .right
        width 100%
      .hero-logo
        margin auto
        float: none

    .feature
      h2
        font-size 1.25rem
</style>