<template>
  <div class="footer">
    <div class="inner container">
      <div class="columns">
        <div class="column col-3 col-md-6 col-sm-12">
          <h5>OpenUPM</h5>
          <p>{{ description }}</p>
        </div>
        <div class="column col-2 col-md-2 col-sm-4">
          <h5>About</h5>
          <ul>
            <li v-for="(link, index) in aboutLinks" :key="index">
              <NavLink class :item="link" />
            </li>
          </ul>
        </div>
        <div class="column col-2 col-md-2 col-sm-4">
          <h5>Connect</h5>
          <ul>
            <li v-for="(link, index) in connectLinks" :key="index">
              <NavLink class :item="link" />
            </li>
          </ul>
        </div>
        <div class="column col-2 col-md-2 col-sm-4">
          <h5>Operation</h5>
          <ul>
            <li v-for="(link, index) in opLinks" :key="index">
              <NavLink class :item="link" />
            </li>
          </ul>
        </div>
        <div class="column col-3 col-md-6 col-sm-12">
          <h5>Follow us to get the latest updates</h5>
          <div class="input-group">
            <input type="text" class="form-input" placeholder="email address" />
            <button class="btn btn-primary input-group-btn">Subscribe</button>
          </div>
        </div>
        <div class="column col-12">
          <small>Copyright @ 2019 Favo Yang</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from "@parent-theme/components/NavLink.vue";

export default {
  components: { NavLink },

  computed: {
    data() {
      return this.$page.frontmatter;
    },

    aboutLinks() {
      return [
        { link: "/about/", text: "Overview" },
        { link: "/legal/terms/", text: "Terms of Use" },
        { link: "/legal/privacy/", text: "Privacy Policy" }
      ];
    },

    connectLinks() {
      return [
        { link: this.$site.themeConfig.repo, text: "GitHub" },
        { link: "", text: "Blog" },
        { link: "", text: "Twitter" },
        { link: "", text: "Unity Connect" },
        { link: "mailto:hello@openupm.com", text: "Contact" }
      ];
    },

    opLinks() {
      return [{ link: "/status/", text: "Status" }];
    },

    description() {
      return this.$site.description;
    }
  }
};
</script>

<style lang="stylus">
.footer
  background-color $primaryColor
  color $lightTextColor
  padding 1.7rem 0

  .inner
    max-width $pageWidth
    margin 0 auto

    h5
      font-weight 600
      margin-bottom 1rem

    h5, p, ul, li
      font-size 0.7rem

    ul
      list-style none
      margin 0 0 0.7rem
      line-height 1.7

      li
        margin-top 0

    .input-group
      margin-bottom 0.7rem

      .form-input
        font-size 0.7rem
        border-color white

      .input-group-btn
        font-size 0.7rem
        padding-left 0.8rem
        padding-right 0.8rem
        border-color white

  a
    color $lightTextColor !important
</style>
