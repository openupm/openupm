import axios from "axios";
import createPersistedState from "vuex-persistedstate";
import urljoin from "url-join";
import Vue from "vue";
import Vuex from "vuex";

import constant from "@theme/constant";
import util from "@root/docs/.vuepress/util";

const SortType = constant.SortType;

Vue.use(Vuex);

let _store = null;

export function getStore(isServer) {
  if (!_store) {
    const plugins = [];
    if (!isServer) {
      plugins.push(createPersistedState());
    }
    _store = new Vuex.Store({
      plugins,
      state: {
        packagesExtra: [],
        recentPackages: [],
        preferHorizontalLayout: false,
        siteInfo: {},
        packageListSort: SortType.updatedAt
      },
      getters: {
        packagesExtra: state => state.packagesExtra,
        recentPackages: state => state.recentPackages,
        preferHorizontalLayout: state => state.preferHorizontalLayout,
        siteInfo: state => state.siteInfo,
        packageListSort: state => state.packageListSort
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
        },
        async fetchRecentPackages({ commit }) {
          try {
            const resp = await axios.get(
              urljoin(util.openupmPackagesApiUrl, "recent"),
              {
                headers: { Accept: "application/json" }
              }
            );
            commit("setRecentPackages", resp.data);
          } catch (error) {
            console.error(error);
          }
        },
        async fetchSiteInfo({ commit }) {
          try {
            const resp = await axios.get(
              urljoin(util.openupmApiUrl, "site/info"),
              {
                headers: { Accept: "application/json" }
              }
            );
            resp.data.__time = new Date().getTime();
            commit("setSiteInfo", resp.data);
          } catch (error) {
            console.error(error);
          }
        },
        setPreferHorizontalLayout({ commit }, { value }) {
          commit("setPreferHorizontalLayout", value);
        },
        setPackageListSort({ commit }, { value }) {
          commit("setPackageListSort", value);
        }
      },
      mutations: {
        setPackagesExtra: (state, data) => {
          state.packagesExtra = data;
        },
        setRecentPackages: (state, data) => {
          state.recentPackages = data;
        },
        setSiteInfo: (state, data) => {
          state.siteInfo = data;
        },
        setPreferHorizontalLayout: (state, preferHorizontalLayout) => {
          state.preferHorizontalLayout = preferHorizontalLayout;
        },
        setPackageListSort: (state, packageListSort) => {
          state.packageListSort = packageListSort;
        }
      }
    });
  }
  return _store;
}
