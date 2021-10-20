import {request} from './request';

// 请求首页中的所有数据————通过一个接口拿到了首页中的所有数据
export function getHomeAllData() {
    // 需要直接返回promise
    return request({ 
        url:'/api/index', // 配置一个请求的子地址
        // method: 'get', get方法可以不写，默认；
        // params:{},
    })
}

export function getHomeGoods(type='sales',page=1) {
    return request({
        // "https://api.shop.eduwork.cn/api/index?recommend=0&sales=1&new=0&page=1"
        url:'/api/index?'+type+'=1&page'+page,
    })
}
