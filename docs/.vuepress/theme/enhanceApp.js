/* eslint-disable no-unused-vars */
/**
 * Client app enhancement file.
 *
 * https://v1.vuepress.vuejs.org/guide/basic-config.html#app-level-enhancements
 */

import VueMq from "vue-mq";
import VueI18n from "vue-i18n";
import Vuex from "vuex";
import axios from "axios";
import nprogress from "nprogress";

import LazyImage from "@theme/components/LazyImage.vue";
import VueLazyComponent from "@xunlei/vue-lazy-component";
import { getStore } from "./store";

const axiosHook = function() {
  // Request interceptor
  axios.interceptors.request.use(
    function(config) {
      nprogress.start();
      return config;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    function(response) {
      nprogress.done();
      return response;
    },
    function(error) {
      return Promise.reject(error);
    }
  );
};

export default ({
  Vue, // the version of Vue being used in the VuePress app
  options, // the options for the root Vue instance
  router, // the router instance for the app
  siteData, // site metadata
  isServer // is this enhancement applied in server-rendering or client
}) => {
  // Load lazy-image
  Vue.component("LazyImage", LazyImage);

  // Load lazy-component
  Vue.use(VueLazyComponent);

  // Load vuex
  Vue.use(Vuex);
  const store = getStore(isServer);
  Vue.mixin({ store });

  // load vue-i18n
  Vue.use(VueI18n);
  const i18nConf = {
    locale: siteData.locales["/"].lang,
    fallbackLocale: "en-US",
    // localeMessages is prepared in config.js
    messages: siteData.themeConfig.localeMessages
  };
  options.i18n = new VueI18n(i18nConf);

  // Load vue-mq
  Vue.use(VueMq, {
    breakpoints: {
      xs: 480,
      sm: 600,
      md: 840,
      lg: 960,
      xl: 1200
    }
  });

  if (!isServer) axiosHook();
};
