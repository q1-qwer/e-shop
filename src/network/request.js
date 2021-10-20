// 这个文件封装通用的网络请求
// 首页中的网络请求、购物车的网络请求等，可以分别写在页面对应的文件下
import axios from 'axios';
import { Notify, Toast } from 'vant'
import router from '../router'

/* 暴露函数request，返回axios的实例对象（promise结果） */
export function request(config) {/*需要接收配置文件：因为有home的封装、购物车的封装等
     每个封装单独调用的时候都有自己的配置，如get、post请求等，请求的子地址等*/

    const instance = axios.create({  /* 创建一个实例，做基础配置 */
        baseURL:'http://localhost:8080/api', /* 基础url将自动加在请求url前面 */
        timeout:10000, /* 设置超时，请求超过了timeout时间将被中断 */
    }) 
    // 创建完实例后，初始化时，需要做：请求拦截、响应拦截；
    
    // 请求拦截————响应还没达到目的地，带着请求头过去；
    // 有些接口是需要认证之后才能访问的，请求时，不带token不能通过；
    // 这样就不用在每个地方都设置请求头信息了，直接在请求拦截里设置即可；

    // 添加请求拦截器
    instance.interceptors.request.use(config=>{
        // 1. 成功，————如果有一些接口，必须有认证才能访问，就在这统一设置；

        const token = window.localStorage.getItem('token')
        if(token){
            // 在配置文件的请求头中加上Authorization属性，按照Bearer类型把token带到服务器中
            config.headers.Authorization = 'Bearer '+token
        }
        // console.log(config)
        // 2. 或者直接放行
        return config
    },error=>{
        // 2. 对错误请求做些什么，一般没有错误，不用处理；
        console.log(error);
    })


    // 响应拦截————可以打印所有想看的数据

    // 添加响应拦截器
    instance.interceptors.response.use(res=>{
        // 对响应数据做点什么
        // 正常响应时直接放行，正确数据不需要处理
        // console.log('响应拦截');
        // console.log(res);
        return res.data?res.data:res  // res中的data里是所有的商品数据，后面就不用.data了
    },
    err=>{
        console.log(err);
        // 对错误响应做点什么
        // 出错误的方法 显示错误信息
        // 如果有需要授权才可以访问的接口，统一跳转登录去授权
        if(err.response.status == '401'){
            Toast.fail('请先登录')
            router.push({path:'/login'})
        }
        // 统一处理接口中返回的错误信息
        // 获取到一个对象里面所有的键，errors对象的所有键装到一个数组中，这个数组第一个值是email
        // 拿到它的第一个值
        // console.log(err.response.data);
        Notify(err.response.data.errors[Object.keys(err.response.data.errors)[0]][0])
    }
    )
    return instance(config)
    
}