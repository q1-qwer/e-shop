/* 声明并暴露路由器 */

import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
// import Home from "../views/Home.vue"; 这种导入不能使用懒加载，不推荐；

// 1. 引入、声明组件
const Home = () => import("../views/home/Home")
const Category = () => import("../views/category/Category")
const Detail = () => import("../views/detail/Detail")
const Profile = () => import("../views/profile/Profile")
const ShopCart = () => import("../views/shopcart/ShopCart")
const Register = () => import("../views/profile/Register")
const Login = () =>  import("../views/profile/Login")
const Collect = () =>  import("../views/profile/Collect")
const Order = () =>  import("../views/order/Order")
const Setting = () =>  import("../views/profile/Setting")
const Address = () =>  import("../views/profile/Address")
const AddressEdit = () =>  import("../views/profile/AddressEdit")
const About = () =>  import("../views/About")
const CreateOrder = () => import("../views/order/CreateOrder")
const OrderDetail = () => import("../views/order/OrderDetail")
const SettingName = () => import("../views/profile/SettingName")
const SettingPic = () => import("../views/profile/SettingPic")
const Findpassword = () => import("../views/profile/Findpassword")

import { Notify } from 'vant'


// 2. 创建子路由：设置路径后会绑定组件与路由路径的关系，路径为 BASE_URL + path
const routes = [
    {// 创建路由器的子路由：
        path: "/",  // 默认访问空路由时加载home组件
        name: "DefaultHome",
        component: Home,
        meta:{  // 添加元元素
            title:'图书兄弟'
        }
    },
    {
        path: "/home",  // 跟路由是home
        name: "Home",
        component: Home,
        meta:{
            title:'图书兄弟'
        }
    },
    {
        path: "/category",
        name: "Category",
        component: Category,
        meta:{
            title:'图书兄弟-商品分类'
        }
    },
    {
        path: "/detail",
        name: "Detail",
        component: Detail,
        meta:{
            title:'图书兄弟-商品详情'
        }
    },
    {
        path: "/shopcart",
        name: "ShopCart",
        component: ShopCart,
        meta:{
            title:'图书兄弟-购物车',
            isAuthRequired:true
        }
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
        meta:{
            title:'图书兄弟-个人中心',
            isAuthRequired:true
        }
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta:{
            title:'图书兄弟-用户注册'
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta:{
            title:'图书兄弟-用户登录'
        }
    },
    {
        path: "/collect",
        name: "Collect",
        component: Collect,
        meta:{
            title:'图书兄弟-我的收藏'
        }
    },
    {
        path: "/order",
        name: "Order",
        component: Order,
        meta:{
            title:'图书兄弟-我的订单'
        }
    },
    {
        path: "/setting",
        name: "Setting",
        component: Setting,
        meta:{
            title:'图书兄弟-账号管理'
        }
    },
    {
        path: "/settingname",
        name: "SettingName",
        component: SettingName,
        meta:{
            title:'图书兄弟-设置昵称'
        }
    },
    {
        path: "/settingpic",
        name: "SettingPic",
        component: SettingPic,
        meta:{
            title:'图书兄弟-设置头像'
        }
    },
    {
        path: "/address",
        name: "Address",
        component: Address,
        meta:{
            title:'图书兄弟-地址管理'
        }
    },
    {
        path: "/addressedit",
        name: "AddressEdit",
        component: AddressEdit,
        meta:{
            title:'图书兄弟-编辑地址'
        }
    },
    {
        path: "/about",
        name: "About",
        component: About,
        meta:{
            title:'图书兄弟-关于我们'
        }
    },
    {
        path: "/createorder",
        name: "CreateOrder",
        component: CreateOrder,
        meta:{
            title:'图书兄弟-订单预览'
        }
    },
    {
        path: "/orderdetail",
        name: "OrderDetail",
        component: OrderDetail,
        meta:{
            title:'图书兄弟-订单详情'
        }
    },
    {
        path: "/findpassword",
        name: "Findpassword",
        component: Findpassword,
        meta:{
            title:'图书兄弟-订单详情'
        }
    }
];

// 3. 创建一个路由器实例并传递routes配置
const router = createRouter({   
    history: createWebHistory(process.env.BASE_URL),  // 路由器工作模式为history，路径不带#
    routes  // 声明子路由为routes
})

// 声明全局路由守卫；
// 跳转之前，加上路由守卫，回调方法有to到哪去和from从哪来；
router.beforeEach((to,from,next)=>{
    // 如果需要授权，在登录状态中为假
    if(to.meta.isAuthRequired && store.state.user.isLogin === false){
        Notify('您还未登录，请先登录')
        return next('/login')
    }else{
        next()
    }
    // 放行之后设置标题为 到的那个页面的元元素的title
    document.title = to.meta.title
})

export default router;
