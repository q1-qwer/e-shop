import { createStore } from "vuex"
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const state = {
  // 通过mutations中的方法修改数据，然后交给状态管理
  user:{
    isLogin: window.localStorage.getItem('token')?true : false
  },
  // 购物车中所有商品的总数————在多个页面需要用到
  cartCount:0
}
/* 
简单的两三个组件之间的通信使用父子组件之间的通信即可，涉及到全局的东西需要放到vuex里面;

1. 登录的token，不管在任何一个页面登录，服务器都会给你返回一个token，证明是你登录了，接着，你在
   任何一个组件操作都得带着这个token，只有登录之后才能操作，所以访问任何组件都得带着token字符串，
   那么你就可以把token这个字符串放在vuex里面；
2. 各个页面都得显示用户名和头像信息，有一个登陆的状态，所以，用户名用户头像信息就得放在vuex里面，
   这样，在所有组件里面都可以显示用户登陆的状态；
*/

export default createStore({
  state,
  mutations,
  actions,
  getters,
});
