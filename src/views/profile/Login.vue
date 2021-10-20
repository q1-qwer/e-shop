<template>
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>用户登录</template>
        </nav-bar>

        <div style="margin-top:50px">
            <div style="text-align:center;padding-top=50px">
                <van-image
                    width="10rem"
                    height="5rem"
                    fit="contain"
                    src="https://www.lmonkey.com/_nuxt/img/logo.ca1ae0c.png"
                />
        </div>


        <van-form @submit="onSubmit">
            <van-field
                v-model="email"
                name="电子邮箱"
                label="电子邮箱"
                placeholder="请输入正确的电子邮箱格式"
                :rules="[{ required: true, message: '请填写email' }]"
            />
            <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            <div style="margin: 16px;">
                <!-- 在页面里面直接调用路由器 -->
                <div class="link-login-findpwd" @click="$router.push({path:'/register'})">
                    没有账号，立即注册
                </div>
                <div class="link-login-findpwd findpwd" @click="$router.push({path:'/findpassword'})">
                    找回密码
                </div>
                <van-button round block type="info" color="#44b883" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>

        

    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { reactive, toRefs } from 'vue'
    import { Login } from 'network/user'
    // 消息提示和轻提示在全局注册不好使，需要单独引入
    import { Toast } from 'vant'
    import { useRouter } from 'vue-router'
    import { setTimeout } from 'timers'
    import { useStore } from 'vuex'

    export default {
        name: "Login",
        setup() { 
            const store = useStore()
            const router = useRouter()
            // 声明一个变量，存储用户输入的信息并返回给数据库
            console.log(router);
            const userinfo = reactive({
                email:'',
                password:''
            })

            // 定义方法处理登录相关事件，若有验证码，也可以在这里面加
            const onSubmit = () => {
                // 把userinfo传给接口的data，再传给服务器，返回服务器的处理结果
                // 错误结果在request中的响应拦截中已经一起处理了
                Login(userinfo).then(res=>{
                    console.log(res);
                    // 服务器会返回一个token（服务器随机生成），授权就是在任何时候都带着这个token
                    // 文档中包括token、toke类型、过期时间

                    // 【 将token保存在本地 】
                    // vuex中的状态管理state使用没问题，但是一刷新就会初始化
                    // 需要用户在下次打开浏览器还是登陆的状态，所以需要保存在本地硬盘
                    // window.localStorage  保存setItem(key,value)  获取getItem(key) 
                    // 不能直接保存对象，但是可以将对象序列化或者只保存对象中的一个属性 
                    // 相当于一个本地的数据库，在任何页面请求接口时都可以去获取并携带
                    window.localStorage.setItem('token',res.access_token)
                    // 可以在vuex中声明一个isLogin状态临时保存登陆情况
                    
                    store.commit('setIsLogin',true)

                    Toast.success('登陆成功')
                    userinfo.email = ''
                    userinfo.password = ''

                    setTimeout(()=>{
                        router.go(-1)
                    },500)
                })
            }

            return {
                ...toRefs(userinfo),
                onSubmit,
            }
        },
        components: {
            NavBar
        }
    }
</script>

<style scope lang="scss">
    .link-login-findpwd{
        font-size: 14px;
        margin-bottom: 20px;
        color: #42b983;
        text-align: left;
        float: left;
    }
    .findpwd{
        float: right;
    }
</style>