<template>
    <nav-bar class="nav-bar">
        <template v-slot:default>
            账号管理
        </template>
    </nav-bar>
    
    <div class="content">
        <van-cell value="待插入图片" is-link>
            <template #title>
                <span class="custom-title">头像</span>
            </template>
        </van-cell>
        <van-cell :value="user.name" is-link @click="toChangeName">
            <template #title>
                <span class="custom-title">昵称</span>
            </template>
        </van-cell>
    </div>   
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { getUser} from 'network/user'
    import { reactive, toRefs, onMounted } from 'vue' 
    import { useRouter } from 'vue-router';

    export default {
        name: "Setting",
        setup() {
            const router = useRouter()
            const state = reactive({
                user:{},
                value:''
            })

            onMounted(() => {
                getUser().then(res => {
                    console.log(res);
                    state.user = res
                })
            })
            const toChangeName = () =>{
                router.push({path:'/settingname'})
            }
            return {
                ...toRefs(state),
                toChangeName
            }
        },
        components: {
            NavBar
        },
    }
</script>

<style lang="scss" scoped>
    .content{
        margin-top: 45px;
        padding: 0 10px;
        span{
            float: left;
        }
    }
</style>
