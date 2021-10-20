import {request} from './request';

export function getCategory() {
    // 需要直接返回promise
    return request({ 
        url:'/api/goods', // 配置一个请求的子地址
    })
}

export function getCategoryGoods(order='sales',cid=0,page=1) {
    // 需要直接返回promise
    return request({ 
        url:'/api/goods?category_id'+cid+'&page='+page+'&'+order+'=1', 
    })
}