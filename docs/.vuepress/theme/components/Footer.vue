<template>
  <div class="footer">
    <div class="inner container">
      <div class="columns">
        <div class="column col-4 col-md-6 col-sm-12">
          <h5>OpenUPM</h5>
          <p>{{ description }}</p>
        </div>
        <div class="column col-5 col-md-6 col-sm-12">
          <div class="columns">
            <div class="column col-4 col-md-4 col-sm-6">
              <h5>{{ $t("about") }}</h5>
              <ul>
                <li v-for="(link, index) in aboutLinks" :key="index">
                  <NavLink class :item="link" />
                </li>
              </ul>
            </div>
            <div class="column col-4 col-md-4 col-sm-6">
              <h5>{{ $t("connect") }}</h5>
              <ul>
                <li v-for="(link, index) in connectLinks" :key="index">
                  <NavLink :item="link" />
                </li>
              </ul>
            </div>
            <div class="column col-4 col-md-4 col-sm-6">
              <h5>{{ $t("region") }}</h5>
              <ul>
                <li v-for="(link, index) in regionLinks" :key="index">
                  <NavLink :item="link" />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- <div class="column col-4 col-md-6 col-sm-12">
          <h5>Follow us to get the latest updates</h5>
          <div class="input-group">
            <input type="text" class="form-input" placeholder="email address" />
            <button class="btn btn-primary input-group-btn">Subscribe</button>
          </div>
        </div> -->
        <div
          v-if="$site.themeConfig.region != 'cn'"
          class="column col-3 col-md-12 col-sm-12"
        >
          <h5>&nbsp;</h5>
          <div>
            <ul>
              <li class="mb-2">
                <a href="https://m.do.co/c/50e7f9860fa9">
                  <img
                    src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_white.svg"
                    width="180px"
                  />
                </a>
              </li>
              <li class="mb-2">
                <a href="https://www.netlify.com">
                  <img
                    src="https://www.netlify.com/img/global/badges/netlify-dark.svg"
                    alt="Deploys by Netlify"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div class="column column col-4 col-md-6 col-sm-12">
          <small>{{ $t("footer-copyright") }}</small>
        </div>
        <div
          v-if="$site.themeConfig.region == 'cn'"
          class="column column col-5 col-md-6 col-sm-12"
        >
          <small>
            <span>
              &nbsp;|&nbsp;
              <NavLink class :item="icpLink" />
            </span>
          </small>
          <small>
            <span>
              &nbsp;|&nbsp;
              <img src="/images/guohui.png">
              <NavLink class :item="nismspLink" />
            </span>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";
import util from "@root/docs/.vuepress/util";

export default {
  components: { NavLink },
  computed: {
    data() {
      return this.$page.frontmatter;
    },

    aboutLinks() {
      return [
        { link: util.getDocsUrl("/docs/team"), text: this.$t("team") },
        {
          link: util.getDocsUrl("/docs/code-of-conduct"),
          text: this.$t("code-of-conduct")
        },
        { link: util.getDocsUrl("/docs/terms"), text: this.$t("terms-of-use") },
        {
          link: util.getDocsUrl("/docs/privacy"),
          text: this.$t("privacy-policy")
        },
        {
          link: "https://openupm.github.io/upptime/",
          text: this.$t("status")
        }
      ];
    },

    connectLinks() {
      const links = [
        {
          link:
            this.$site.themeConfig.region == "cn"
              ? "https://github.com/openupm/openupm/blob/master/README.zh-cn.md"
              : this.$site.themeConfig.repo,
          text: this.$t("github"),
          icon: "fab fa-github",
          iconLeft: true
        }
      ];
      if (this.$site.themeConfig.region != "cn") {
        links.push({
          link: "https://medium.com/openupm",
          text: this.$t("medium"),
          icon: "fab fa-medium",
          iconLeft: true
        });
        links.push({
          link: "https://twitter.com/openupmupdate",
          text: this.$t("twitter"),
          icon: "fab fa-twitter",
          iconLeft: true
        });
        links.push({
          text: this.$t("discord"),
          link: "https://discord.gg/FnUgWEP",
          icon: "fab fa-discord",
          iconLeft: true
        });
      }
      links.push({
        link: "mailto:hello@openupm.com",
        text: this.$t("contact-us"),
        icon: "fas fa-envelope",
        iconLeft: true
      });
      links.push({
        link: `https://api.${this.$site.themeConfig.baseDomain}/feeds/updates/rss`,
        text: this.$t("package-updates"),
        icon: "fa fa-rss-square",
        raw: true,
        iconLeft: true
      });
      return links;
    },

    description() {
      return this.$localeConfig.description;
    },

    nismspLink() {
      return {
        link: "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502045830",
        text: this.$t("nismspText")
      };
    },

    icpLink() {
      return {
        link: "https://beian.miit.gov.cn/#/Integrated/index",
        text: this.$t("icpText")
      };
    },

    poweredByLink() {
      if (this.$site.themeConfig.region != "cn")
        return {
          link: "https://www.netlify.com",
          text: this.$t("powered-by-netlify")
        };
      else
        return {
          link: this.$site.themeConfig.jdCloudUrl,
          text: this.$t("powered-by-jd-cloud")
        };
    },

    regionLinks() {
      return [
        {
          link:
            this.$site.themeConfig.region == "us" ? "/" : "https://openupm.com",
          text: this.$t("region-us")
        },
        {
          link:
            this.$site.themeConfig.region == "cn" ? "/" : "https://openupm.cn",
          text: this.$t("region-cn")
        }
      ];
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

        i
          padding-right 0.1rem

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
