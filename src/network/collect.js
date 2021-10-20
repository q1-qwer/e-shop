import {request} from './request';

// 添加、取消收藏  201收藏成功 204取消收藏
export function addCollect(id) {
    console.log(id);
    return request({
        url:`/api/collects/goods/${id}`,
        method:'post',
    })
}

// 收藏列表 {page:1}
export function addCollectList(params) {
    return request({
        url:'/api/collects',
        params
    })
}
