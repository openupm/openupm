import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import urljoin from "url-join";
import util from "@root/docs/.vuepress/util";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    packagesExtra: []
  },
  getters: {
    packagesExtra: state => state.packagesExtra
  },
  actions: {
    async fetchPackagesExtra({ commit }) {
      try {
        const resp = await axios.get(
          urljoin(util.openupmPackagesApiUrl, "extra"),
          {
            headers: { Accept: "application/json" }
          }
        );
        resp.data.__time = new Date().getTime();
        commit("setPackagesExtra", resp.data);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mutations: {
    setPackagesExtra: (state, data) => {
      state.packagesExtra = data;
    }
  }
});
