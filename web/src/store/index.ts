import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import actions from '@/store/actions'
import state from '@/store/state'
import getters from '@/store/getter'
Vue.use(Vuex)


const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
export default store