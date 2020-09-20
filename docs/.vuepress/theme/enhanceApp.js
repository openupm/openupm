/* eslint-disable no-unused-vars */
/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

import VueLazyComponent from "@xunlei/vue-lazy-component";
import VueMq from "vue-mq";
import Vuex from "vuex";
// import PerfectScrollbar from "vue2-perfect-scrollbar";
import { getStore } from "./store";

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer // is this enhancement applied in server-rendering or client
}) => {
  Vue.use(VueLazyComponent);
  Vue.use(Vuex);
  const store = getStore(isServer);
  Vue.mixin({ store });
  Vue.use(VueMq, {
    breakpoints: {
      xs: 480,
      sm: 600,
      md: 840,
      lg: 960,
      xl: 1200
    }
  });
  // Vue.use(PerfectScrollbar);
};
