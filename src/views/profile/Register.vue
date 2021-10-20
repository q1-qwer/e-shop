<template>
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>新用户注册</template>
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
                v-model="name"
                name="用户名"
                label="用户名"
                placeholder="用户名"
                :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
                v-model="password"
                type="password"
                name="密码"
                label="密码"
                placeholder="密码"
                :rules="[{ required: true, message: '请填写密码' }]"
            />
            <van-field
                v-model="password_confirmation"
                type="password"
                name="密码"
                label="确认密码"
                placeholder="确认密码"
                :rules="[{ required: true, message: '请确认密码' }]"
            />
            <van-field
                v-model="email"
                name="电子邮箱"
                label="电子邮箱"
                placeholder="请输入正确的电子邮箱格式"
                :rules="[{ required: true, message: '请填写email' }]"
            />
            <div style="margin: 16px;">
                <!-- 在页面里面直接调用路由器 -->
                <div class="link-login" @click="$router.push({path:'/login'})">
                    已有账号，立即登录
                </div>
                <van-button round block type="info" color="#44b883" native-type="submit">提交</van-button>
            </div>
        </van-form>
    </div>

        

    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import {reactive,toRefs} from 'vue'
    import {register} from 'network/user'
    // 消息提示和轻提示在全局注册不好使
    import { Notify, Toast } from 'vant'
    import { useRouter } from 'vue-router'
    import { setTimeout } from 'timers';

    export default {
        name: "Register",
        setup() { 
            const router = useRouter()
            // 声明一个变量，存储用户输入的信息并返回给数据库
            const userinfo = reactive({
                name:'',
                password:'',
                password_confirmation:'',
                email:''
            })
            // 定义触发后的事件————把输入的数据交给服务器
            const onSubmit = () => {
                // 先验证
                if(userinfo.password != userinfo.password_confirmation){
                    Notify('两次密码不一致！')
                    userinfo.password_confirmation = ''
                }else{
                    // 如果密码一致则提交服务器处理数据
                    register(userinfo).then(res=>{
                        // qwer@lmonkey.com  qwer123
                        // console.log(res);
                        if(res.status == '201'){
                            Toast.success('注册成功')
                            // 注册成功后到登录页面，不用带参数
                            setTimeout(()=>{
                                router.push({path:'/login'})
                            },1000)
                        }
                        // 提前清空密码和确认密码（组件自己也会清空所有消息）
                        userinfo.password_confirmation = ''
                        userinfo.password = ''
                    })
                }
            }

            return {
                ...toRefs(userinfo),
                onSubmit,
            }
        },
        components: {
            NavBar
        },
    }
</script>

<style scope lang="scss">
    .link-login{
        font-size: 14px;
        margin-bottom: 20px;
        color: #42b983;
        text-align: left;
        float: left;
    }
</style>