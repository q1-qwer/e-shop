const mutations = {
    setIsLogin(state,payload){
        state.user.isLogin = payload
    },
    addCart(state,payload){
        state.cartCount = payload.count  // 传一个对象，对象中有数量属性
    }
}

export default mutations;