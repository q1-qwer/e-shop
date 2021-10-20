import { request } from './request' // 【——1.在这里引入默认请求前缀———】


// 添加购物车————后端添加购物车的接口API已经实现了点击添加后自动累加商品数量，不用前端计算数量
export function addCart(data){  /* 直接传参数对象用body体传过去 */
    return request({
        url:'/api/carts',  // 【——2.然后对接后端API——】
        method:'post',
        data
    })
}

// 修改购物车，修改数量通过对象的方式传入data={num:1}
export function modifyCart(id,data){
    return request({
        url:`/api/carts/${id}`,
        method:'put',
        data
    })
}

// 改变服务器数据表中商品的选中状态——页面上刷新后选择状态依然保存，data是所有选中的id，
// 传入的数据需要是一个对象的格式
// 这个方法会把提交过来的购物车中的商品数据设置为选中， 未提交过来的设置为非选中
export function checkedCart(data){
    return request({
        url:'/api/carts/checked',
        method:'patch',
        data
    })
}

// 获取购物车列表————指的是买了几种商品，不是所有商品的类型的总数和
// 传入数据为空时，默认获取全部数据，data是所有选中的id；
export function getCart(data=''){
    return request({
        // api/carts?include=goods
        url:'/api/carts?'+data
    })
}

// 删除购物车
export function deleteCartItem(id){
    return request({
        url:`/api/carts/${id}`,
        method:'delete'
    })
}

