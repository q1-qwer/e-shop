import {request} from './request';

// 注册接口：把data通过接口传给服务器
export function register(data) {
    // 把相关配置传给request方法后将其返回
    return request({ 
        url:'/api/auth/register', 
        method:'post',
        data
    })
}

// 登录接口，用于向数据库提交数据
export function Login(data) {
    // 把相关配置传给request方法后将其返回
    return request({ 
        url:'/api/auth/login', 
        method:'post',
        data
    })
}

// 退出接口
export function Logout() {
    // 在request中已经携带了token完成了授权
    return request({ 
        url:'/api/auth/logout', 
        method:'post',
    })
}

// 获取用户信息接口
export function getUser() {
    // 在request中已经携带了token完成了授权
    return request({ 
        url:'/api/user', 
    })
}

// 找回密码
export function findPassword(params) {
    return request({ 
        url:'/api/auth/reset/password/email/code', 
        method:'post',
        params
    })
}