import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from "vuex-persist";
import {actions} from "@/store/actions";
import {mutations} from "@/store/mutations";
import {State} from "@/types/store";

Vue.use(Vuex)

const vuexPersist = new VuexPersistence({
  key: 'vuex-main',
  storage: window.localStorage,
  reducer() {
    return {};
  }
});

export const state: State = {
  user: undefined,
};

export default new Vuex.Store<State>({
  state,
  mutations,
  actions,
  plugins: [vuexPersist.plugin]
})
