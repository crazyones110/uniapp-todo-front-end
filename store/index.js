import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		/**
		 * 是否需要强制登录
		 */
		// forcedLogin: false,
		// hasLogin: false,
		// userName: ""
    tab: 0,
    currentMemoCreateTime: 0,
    currentTodoCreateTime: 0,
    currentMemo: '',
    currentTodo: '',
    isLogin: false,
    openid: ''
	},
	mutations: {
		// login(state, userName) {
		// 	state.userName = userName || '新用户';
		// 	state.hasLogin = true;
		// },
		// logout(state) {
		// 	state.userName = "";
		// 	state.hasLogin = false;
		// }
    switchTab(state, newTab) {
      state.tab = newTab
    },
    changeMemo(state, newMemo) {
      state.currentMemo = newMemo
    },
    changeTodo(state, newTodo) {
      state.currentTodo = newTodo
    },
    changeTodoCreateTime(state, newCreateTime) {
      state.currentTodoCreateTime = newCreateTime
    },
    changeMemoCreateTime(state, newCreateTime) {
      state.currentMemoCreateTime = newCreateTime
    },
    changeLoginStatus(state, loginState) {
      state.isLogin = loginState
    },
    changeOpenid(state, openid) {
      state.openid = openid
    }
	}
})

export default store
