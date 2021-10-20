<template>
    <nav-bar class="nav-bar">
        <template v-slot:default>找回密码</template>
    </nav-bar>
    <div class="content">
        <van-form @submit="onSubmit" @failed="onFailed">
            <van-cell-group inset>
                <van-field
                v-model="email"
                name="email"
                placeholder="请输入正确的电子邮箱格式"
                :rules="[{trigger:'onChange', pattern, required: true, message: '请填写email' }]"
                />
                
            </van-cell-group>
            <div style="margin: 16px;">
                <van-button class="btn" round block type="primary" native-type="submit">
                提交
                </van-button>
            </div>
        </van-form>
    </div>

</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { ref } from 'vue'
    import { findPassword } from 'network/user'

    export default {
        setup() {
            const email = ref('')
            const pattern = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;


            const onFailed = (errorInfo) => {
                console.log('failed', errorInfo);
            }
            const onSubmit = (values) => {
                console.log('submit', values)
                console.log(typeof values)
                findPassword(values).then(res=>{
                    console.log(res)
                })
            }

            return {
                email,
                onSubmit,
                onFailed,
                pattern
            }
        },
        components:{
            NavBar
        }
    }
</script>

<style scope lang="scss">
    .content{
        margin-top: 45px;
        .btn{
            background-color: var(--color-tint);
            border: none;
        }
    }
</style>















