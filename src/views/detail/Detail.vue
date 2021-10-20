<template>
<!-- 商品详情是在首页或者分类里面点数据转到的页面 -->
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>商品详情{{id}}</template>
        </nav-bar>

        <van-image style="margin-top:50px"
            width="100%"
            lazy-load
            :src="detail.cover_url"
        />

        <van-card style="text-align:left"
            :num="detail.stock"
            :price="detail.price+'.00'"
            :desc="detail.description"
            :title="detail.title"
        >
            <template #tags>
                <van-tag plain type="danger">标签</van-tag>
                <van-tag plain type="danger" v-show="detail.is_recommend">推荐</van-tag>
            </template>
            <template #footer>
                <!-- 使用到的组件都需要在main.js中注册 -->
                <div class="btn_icon"  @click="handleAddCollect">
                    <span v-show="!isShowIcon" @click="a"><van-button icon="like-o" type="primary" /></span>
                    <span v-show="isShowIcon" @click="b"><van-button icon="like" type="primary" /></span>
                </div>
                <van-button type="warning" @click="handleAddCart">加入购物车</van-button>
                <van-button type="danger" @click="goToCart">立即购买</van-button>
            </template>
        </van-card>

        <van-tabs v-model="active">
            <van-tab title="概述">
                <div class="content" v-html="detail.details"></div>
            <!-- 如果直接写在{{}}中，那么detail.details中的HTML内容是不会解析的,若需要解析富文本，则需要使用v-html -->
            <!-- 富文本加载时，没有按照手机屏幕，而是按照PC页面的，所以需要设置样式 -->
            </van-tab>
            <van-tab title="热评">
                <div 
                     v-for="(item,index) in comments"
                     :key="index">
                     {{item}}
                     <div v-html="item"></div>
                </div>
            </van-tab>
            <van-tab title="相关图书">
                <goods-list :goods="like_goods"></goods-list>
            </van-tab>
        </van-tabs>

    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import GoodsList from 'components/content/goods/GoodsList'
    import { useRoute, useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { ref,reactive,onMounted,toRefs } from 'vue'
    import { getDetail } from 'network/detail'
    import { addCart } from 'network/cart'
    import { addCollect } from 'network/collect'
    import { Toast } from 'vant'

    export default {
        name: "Detail",
        setup() { // router路由器是指定路径的；route可以接收参数，是当前激活的路由地址
            let isShowIcon = ref(false)
            let active = ref(1)
            const route = useRoute()
            const router = useRouter()
            const store = useStore()
            // 跳转到detail页面时需要在路由中传递id，通过$route.query.id可以接收到这个参数
            let id = ref(0)
            // 数据模型
            let book = reactive({
                detail:{},
                like_goods:[],
                comments:{}
            })

            // 如果页面上需要使用id则可以在外面接收
            onMounted(()=>{
                // 让id的value = 通过路由参数传递过来查询出的id
                // route中存放了当前路由中的所有信息
                id.value = route.query.id
                getDetail(id.value).then(res=>{
                    // 初始化数据模型
                    book.detail = res.goods
                    console.log(res);
                    console.log('res.goods');
                    console.log(res.goods);
                    book.like_goods = res.like_goods
                    book.comments = res.goods.comments[0]
                })
            })

            // 添加购物车（首次添加201，后续添加（更改数量）204）
            const handleAddCart = () => {
                addCart({goods_id:book.detail.id, num:1}).then(res=>{
                    if(res.status == '201' || res.status == '204'){
                        Toast.success('添加成功')
                        // 添加完购物车以后需要更新购物车；设置store中的cartCount数量
                        store.dispatch('updateCart')
                    }
                })
            }
            // 添加收藏列表
            const handleAddCollect =()=>{
                isShowIcon.value = !isShowIcon.value
                let id = route.query.id
                addCollect(id).then(res=>{
                    console.log(res);
                })
            }
            const a =()=>{
                console.log('收藏了')
            }
            const b =()=>{
                console.log('没收藏')
            }

            // 立即购买，加入购物车并转入购物车列表
            const goToCart = () => {
                addCart({goods_id:book.detail.id, num:1}).then(res=>{
                    if(res.status == '201' || res.status == '204'){
                        Toast.success('添加成功，显示购物车')
                        
                        store.dispatch('updateCart')
                        router.push({path:'/shopcart'})
                    }
                })
            }

            return {
                id,
                ...toRefs(book),
                active,
                handleAddCart,
                goToCart,
                handleAddCollect,
                isShowIcon,
                a,
                b
            }
        },
        components: {
            NavBar,
            GoodsList
        },
    }
</script>

<style scope lang="scss">
    .content{
        padding: 10px;
    }
    .btn_icon
    {
        display: inline-block
    }
</style>