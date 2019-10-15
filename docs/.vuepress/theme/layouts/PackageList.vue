<!-- eslint-disable vue/no-v-html -->
<template>
  <ParentLayout>
    <main class="package-list">
      <div class="main-container container">
        <div class="columns">
          <div class="column col-12">
            <ul class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li class="breadcrumb-item">
                <a href="/packages">Packages</a>
              </li>
            </ul>
            <h1 class="hide">Packages</h1>
          </div>
          <div class="column col-2 col-sm-12">
            <section class="category-section container">
              <h2>category</h2>
            </section>
          </div>
          <div class="column col-10 col-sm-12">
            <div class="package-section container">
              <div class="columns">
                <section
                  v-for="pkg in $packages"
                  :key="pkg.name"
                  class="col-6 package-card"
                >
                  <h3>{{ pkg.displayName || pkg.name }}</h3>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Content class="theme-default-content custom" />
    </main>
  </ParentLayout>
</template>

<script>
import ParentLayout from "@theme/layouts/Layout.vue";
import NavLink from "@parent-theme/components/NavLink.vue";

export default {
  components: { ParentLayout, NavLink },
  data() {
    return {};
  },
  computed: {
    $packages() {
      return this.$page.frontmatter.packages;
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="stylus">
.package-list
  .main-container
    margin-top 1rem
</style>
