import {request} from './request';

// 更改昵称
export function modifyName(params) {
    // 把相关配置传给request方法后将其返回
    return request({ 
        url:'/api/user', 
        method:'put',
        params
    })
}

// 更改头像
export function modifyPic(data) {
    return request({ 
        url:'/api/user/avatar', 
        method:'patch',
        data
    })
}