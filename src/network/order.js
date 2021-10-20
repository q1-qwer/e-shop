import {request} from './request'

// 创建订单
export function createOrder(params) {
    return request({
        url:'/api/orders',
        method:'post',
        params
    })
}

// 获取生成订单预览
export function getOrderPreview() {
    return request({
        url:'/api/orders/preview'
    })
}

// 订单支付，获取二维码，order订单id,params支付方式：支付宝、二维码
export function payOrder(order,params) {
    return request({
        url:`/api/orders/${order}/pay`,
        params
    })
}

// 订单状态
export function payOrderStatus(order) {
    return request({
        url:`/api/orders/${order}/status`
    })
}

// 获取订单列表{page:1,status:2,include:'goods,user,orderDetail.goods}
// 获取订单详情，且其中包含关联的商品：include=orderDetails.goods
export function getOrderList(params) {
    // return request({
    //     url:'/api/orders',
    //     params
    // })
    console.log(params)
    return new Promise((resolve)=>{
        setTimeout(()=>{
            return resolve(
                {
                data:[
                    {
                        "id": 11,
                        "order_no": "123123",
                        "user_id": 1,
                        "amount": 111,
                        "status": 1,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": '2021-10-07 13:09:00',
                        "updated_at": '',
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        },
                        {
                            goods_id:333,
                            id:333,
                            num:2,
                            order_id:34,
                            price:300,

                            goods:{
                                id:13,
                                title:'《xxx》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 12,
                        "order_no": "123123",
                        "user_id": 3,
                        "amount": 111,
                        "status": 1,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 13,
                        "order_no": "123123",
                        "user_id": 3,
                        "amount": 111,
                        "status": 4,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 14,
                        "order_no": "123123",
                        "user_id": 4,
                        "amount": 111,
                        "status": 2,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 15,
                        "order_no": "123123",
                        "user_id": 5,
                        "amount": 111,
                        "status": 5,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 16,
                        "order_no": "123123",
                        "user_id": 6,
                        "amount": 111,
                        "status": 1,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 17,
                        "order_no": "123123",
                        "user_id": 7,
                        "amount": 111,
                        "status": 2,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 18,
                        "order_no": "123123",
                        "user_id": 8,
                        "amount": 111,
                        "status": 3,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 19,
                        "order_no": "123123",
                        "user_id": 9,
                        "amount": 111,
                        "status": 1,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 20,
                        "order_no": "123123",
                        "user_id": 10,
                        "amount": 111,
                        "status": 2,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    },
                    {
                        "id": 11120,
                        "order_no": "111123123",
                        "user_id": 10,
                        "amount": 111,
                        "status": 2,
                        "address_id": 1,
                        "express_type": null,
                        "express_no": null,
                        "pay_time": null,
                        "pay_type": null,
                        "trade_no": null,
                        "created_at": null,
                        "updated_at": null,
                        orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《xqwe》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
                    }
                ],
                // 接口中的分页信息
                "meta": {
                    "pagination": {
                        "total": 1,
                        "count": 1,
                        "per_page": 15,
                        "current_page": 1,
                        "total_pages": 2,
                        "links": null
                    }
                }
            }
            )
        },100)
    })
}

// 订单详情
export function getOrderDetail(order) {
    // return request({
    //     url:`/api/orders/${order}`,
    //     params:{
    //         include:'user,orderDetails.goods'
    //     }
    // })
    return new Promise((resolve)=>{
        console.log(order);
        setTimeout(()=>{
            return resolve({
                id:34, 
                "express_type": null,
                "created_at": '2021-01-15 09:45:40',
                "express_no": null,
                order_no:'12345676543',
                user_id:15,
                amount:78,
                status:1,
                "address_id": 1,
                orderDetails:
                    {
                        data:[{
                            goods_id:13,
                            id:37,
                            num:1,
                            order_id:34,
                            price:78,

                            goods:{
                                id:13,
                                title:'《x》',
                                category_id: 14,
                                user_id: 1,
                                "pay_time": null,
                                "pay_type": null,
                                "trade_no": null,
                                "updated_at": null
                            }
                        }]
                    }
            })
        },100)
    })
}

// 确认订单
export function confirmOrder(order) {
    return request({
        url:`/api/orders/${order}/confirm`,
        method:'patch'
    })
}

// 获取物流信息
export function ViewExpress(order) {
    return request({
        url:`/api/orders/${order}/express`
    })
}