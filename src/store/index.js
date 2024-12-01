import { createStore } from "vuex";

import { __API_URL } from "../usecases/URL";
import apiClient from "../usecases/utils/fetch";

export const store = createStore({
  state() {
    return {
      data: [],
      premises: [],

      loading: true,
      loading_premises: true,

      filter: {
        search: null,
        premise_id: null,
      },
      pagination: {
        page: 1,
        limit: 10,
      },
    };
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_LIST(state, list) {
      state.data = list;
    },
    SET_FILTER_SEARCH(state, search) {
      state.filter.search = search;
    },
    SET_FILTER_PREMISES(state, premise_id) {
      state.filter.premise_id = premise_id;
    },
    SET_PAGINATION(state, { page }) {
      state.pagination = { ...state.pagination, page };
    },
    SET_LIMIT(state, { page_size }) {
      state.pagination.limit = page_size;
    },
    SET_PREMISES(state, data) {
      state.premises = data;
    },
    SET_LOADING_PREMISES(state, loading) {
      state.loading_premises = loading;
    },
  },
  actions: {
    async fetchData({ commit, state }) {
      try {
        commit("SET_LOADING", true);
        const filteredParams = Object.entries({
          ...state.filter,
          page: state.pagination.page,
          page_size: state.pagination.limit,
        }).reduce((acc, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {});

        const params = new URLSearchParams(filteredParams).toString();

        const response = await apiClient.get(
          `${__API_URL}/appeals/v1.0/appeals/?${params}`
        );

        if (response.status === 200) {
          commit("SET_LIST", response.data);
          commit("SET_LIMIT", { page_size: response.data.page_size });
        }
      } catch (e) {
        return Promise.reject(e.message);
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async fetchPremises({ commit, state }) {
      try {
        commit("SET_LOADING_PREMISES", true);
        const filteredParams = Object.entries({
          premise_id: state.filter?.premise_id,
          page: state.pagination.page,
        }).reduce((acc, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {});

        const params = new URLSearchParams(filteredParams).toString();

        const response = await apiClient.get(
          `${__API_URL}/geo/v2.0/user-premises/?${params}`
        );

        if (response.status === 200) {
          commit("SET_PREMISES", response.data);
          commit("SET_LOADING_PREMISES", false);
        }
      } catch (e) {
        return Promise.reject(e.message);
      }
    },
    setSearch({ commit, dispatch }, { search }) {
      commit("SET_FILTER_SEARCH", search);
      dispatch("fetchData");
    },
    setPremises({ commit, dispatch }, { premise_id }) {
      commit("SET_FILTER_PREMISES", premise_id);
      dispatch("fetchPremises");
    },
    setPagination({ commit, dispatch }, page) {
      commit("SET_PAGINATION", page);
      dispatch("fetchData");
    },
    setLimit({ commit, dispatch }, { page_size }) {
      commit("SET_LIMIT", { page_size });
      dispatch("fetchData");
    },
  },

  getters: {
    data: (state) => state.data,
    list: (state) => state.data.results,
    premises: (state) => state.premises.results,
    loading: (state) => state.loading,
    limit: (state) => state.pagination.limit,
  },
});
