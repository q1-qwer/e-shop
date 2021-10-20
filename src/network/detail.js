import {request} from './request';

export function getDetail(id) {
    // 需要直接返回promise
    return request({ 
        url:'/api/goods/'+id, // 配置一个请求的子地址
    })
}