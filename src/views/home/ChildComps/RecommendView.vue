<template>
    <div class="recommend">
        <div class="recommend-item" v-for="item in recommends.slice(0,4)" :key="item.id">
            <a href="" @click.prevent = "goD(item.id)"> 
                <!-- 点击链接触发事件：转到商品详情页；不是首页的导航，需要通过路由的方式 -->
                <img v-lazy="item.cover_url" alt=""/>
                <div>{{item.title}}</div>
            </a>
        </div>
        <!-- 通过遍历数据库中数据的方式来拿到4个这样的数据 -->
        <!-- 数据一般都是在首页里面请求，然后通过属性存起来； -->
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'

    export default {
        name: "RecommendView",
        props:{
            // 传过来的属性名：{ }
            recommends:{
                type:Array,
                dafault(){
                    // 设置不传数据时的缺省值
                    return []
                }
            }
        },
        setup() {
            const router = useRouter()
            const goD = (id) => {
                router.push({path:'./detail',query:{id}})
            }
            return {
                goD
            }
        },
        components: {
            
        },
    }
</script>

<style scoped lang="scss">
    .recommend {
        display:flex;
        width:100%;
        text-align:center;
        padding:15px 0 30px;
        border-bottom:8px solid #EEE;
        font-size:12px;
    }
    .recommend-item {
        flex:1;
        img {
            width:70px;
            height:70px;
            margin-bottom:10px;
        }
    }
</style>