import Vue from 'vue'
import Vuex from 'vuex'

// 根级别状态管理分装文件
import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})