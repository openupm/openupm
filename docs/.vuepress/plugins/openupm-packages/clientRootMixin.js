// Client root mixin

export default {
  mounted() {
    this.fetchPackagesExtra({ force: true });
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      this.fetchPackagesExtra({ force: false });
    }
  },

  methods: {
    fetchPackagesExtra({ force }) {
      const timeElapsed =
        new Date().getTime() - (this.$store.getters.packagesExtra.__time || 0);
      const cacheTime = 5 * 60 * 1000;
      if (force || timeElapsed > cacheTime) {
        this.$store.dispatch("fetchPackagesExtra");
      }
    }
  }
};
