import { getCart } from 'network/cart'

const actions = {
    updateCart({commit}){
        getCart().then(res=>{
            commit('addCart',{count:res.data.length || 0})  // 最后会把购物车的长度值传给cartCount
        })
    }
}

export default actions;