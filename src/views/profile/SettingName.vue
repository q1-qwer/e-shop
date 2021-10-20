<template>
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>
                账号管理
            </template>
        </nav-bar>
        <div class="content">
            <van-cell-group inset>
                <van-field v-model="value" label="用户名" :placeholder="user.name" />
                <van-button square type="primary" @click="changeName">确认</van-button>
            </van-cell-group>
        </div>
        
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { getUser} from 'network/user'
    import { modifyName } from 'network/setting'
    import { reactive, toRefs, onMounted, ref} from 'vue' 

    export default {
        name: "Setting",
        setup() {
            const state = reactive({
                user:{},
                value:''
            })

            const fileList = ref([
                { url: '~assets/images/1.png' },
                // Uploader 根据文件后缀来判断是否为图片文件
                // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
                // { url: 'https://cloud-image', isImage: true },
            ]);

            onMounted(() => {
                getUser().then(res => {
                    console.log(res);
                    state.user = res
                })
            })

            const changeName =()=>{
                modifyName({name:state.value}).then(res=>{
                    console.log(res);
                })
            }
            return {
                ...toRefs(state),
                changeName,
            fileList,
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
        padding: 0 20px;
    }
    .van-button{
        width: 88px;
        background-color: var(--color-tint);
        border: none;
    }
</style>