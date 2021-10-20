<template>
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>商品分类</template>
        </nav-bar>

        <div id="mainbox">
            <div class="ordertab">
                <van-tabs v-model="active" @click="tabClick">
                    <van-tab title="销量排序"></van-tab>
                    <van-tab title="价格排序"></van-tab>
                    <van-tab title="评论排序"></van-tab>
                </van-tabs>
            </div>

            <van-sidebar class="leftmenu" v-model="activeKey">
                <van-collapse v-model="activeName" accordion>
                        <van-collapse-item v-for="item in categories" 
                                        :key="item.id" 
                                        :title="item.name" 
                                        :name="item.name">
                                <van-sidebar-item v-for="sub in item.children" 
                                                 :key="sub.id" 
                                                 :title="sub.name" 
                                                 @click="getGoods(sub.id)"
                                                 />
                        </van-collapse-item>
                </van-collapse>
            </van-sidebar>                

            <div class="goodslist">
                <div class="content">
                    <van-card
                        v-for="item in showGoods" :key="item.id"
                        @click="itemClick(item.id)"
                        :num="item.comments_count"
                        :tag="item.comments_count >= 0 ? '流行':'标签'"
                        :price="item.price"
                        :desc="item.updated_at"
                        :title="item.title"
                        :thumb="item.cover_url"
                        :lazy-load="true"
                    />
                </div>
            </div>
        </div>

        <back-top 
        v-show="isShowBackTop"
        @bTop="bTop"          
        ></back-top>
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import BackTop from 'components/common/backtop/BackTop'
    import {ref,onMounted,reactive,computed, watchEffect, nextTick} from 'vue'
    import {useRouter} from 'vue-router'
    import {getCategory, getCategoryGoods} from 'network/category'
    import BScroll from 'better-scroll'
    

    export default {
        name: "Category",
        setup() {
            const router = useRouter()
            let active = ref(1)
            let activeKey = ref(0)    
            let categories = ref([])
            let activeName = ref(1)
            let isShowBackTop = ref(false)

            // 当前的排序条件
            let currentOrder = ref('sales')
            // 当前的分类id，数据库中最小的id是1，为0则证明条件不成立
            // 不成立时获取所有的商品
            let currentCid = ref(0)
            // 数据模型
            const goods = reactive({
                sales:{page:1,list:[]},
                price:{page:1,list:[]},
                comments_count:{page:1,list:[]}
            })

            const showGoods = computed(()=>{
                return goods[currentOrder.value].list
            })

            let bscroll = reactive({})

            const init =()=>{
                getCategoryGoods('sales',currentCid.value).then(res=>{
                    goods.sales.list = res.goods.data
                })
                getCategoryGoods('price',currentCid.value).then(res=>{
                    goods.price.list = res.goods.data
                })
                getCategoryGoods('comments_count',currentCid.value).then(res=>{
                    goods.comments_count.list = res.goods.data
                })
            }

            onMounted(() => {
                getCategory().then(res=>{
                    categories.value = res.categories
                    console.log(categories.value);
                })
                // 默认初始化
                init()

                bscroll = new BScroll(document.querySelector('.goodslist'),{
                    probeType: 3, // 0,1,2,3  3表示只要在运动就触发scroll事件
                    click: true,  // 是否允许点击——在滚动区域如果有链接是默认不生效的
                    pullUpLoad: true// 是否允许上拉加载更多，默认是false不允许
                })

                // 注册滚动事件，每次滚动的时候都会把滚动的位置position传入
                bscroll.on('scroll',(position)=>{
                    // position是个对象，有x、y两个属性
                    isShowBackTop.value = (-position.y) > 300
                    // 当滚动的位置大于300时，'回到顶部'按钮就会出现
                })

                bscroll.on('pullingUp',()=>{ 
                    //滚动屏幕时会触发这个方法，在这个方法中加载数据，然后把数据渲染到页面上
                    console.log('上拉加载更多。。。')
                    // 去下一页
                    const page = goods[currentOrder.value].page +1
                    // 当前的排序类型，当前的id，去获取数据
                    getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                    // 直接赋值会替换原始第一页的数据；goods[currentOrder.value].list = res.goods.data
                    goods[currentOrder.value].list.push(...res.goods.data) 
                    // 如果不用...展开，则会以子数组的方式进入列表，需要把数组内容展开追加到列表里面；
                    // 加载完一页之后，当前页就会变，加1
                    goods[currentOrder.value].page += 1
                })

                    // 重新刷新数据
                    bscroll.finishPullUp()
                    // 【3.计算高度】每次拉动，页面刷新，就会调用这个函数重新计算高度
                    
                    // 重新计算高度
                    nextTick(()=>{
                        bscroll && bscroll.refresh()
                    })
                    // 内容的高度是变化的，客户端高度
                    // console.log('contentheight：'+document.querySelector('.content').clientHeight)
                    console.log('当前类型: '+currentOrder.value+',当前页：'+page)
                    
                })

                
            })

            // 【切换分类】排序选项卡，组件中默认会把选中的序列号传进来
            const tabClick = (index) =>{
                let orders = ['sales','price','comments_count']
                currentOrder.value = orders[index]
                getCategoryGoods(currentOrder.value,currentCid.value).then(res=>{
                    goods[currentOrder.value].list = res.goods.data
                    
                    // 重新获取数据后需要计算高度
                    nextTick(()=>{
                        bscroll && bscroll.refresh()
                    })
                })
                
                console.log(currentCid.value)
                console.log('排序的序号：'+ currentOrder.value)
            }

            // 通过分类得到商品
            const getGoods = (cid) =>{
                currentCid.value = cid
                init()
                console.log('当前分类id'+currentCid.value)
                console.log('排序的序号：'+currentOrder.value)
            }

            // 只要页面有变化就会调用监听计算页面高度
            watchEffect(()=>{
                // 当数据变化且页面也变化后，即DOM元素渲染完毕后，重新计算变化高度
                nextTick(()=>{
                    // 高度变化后需要触发‘重新计算内容区域高度’的事件
                    // 判断bscroll是否存在
                    bscroll && bscroll.refresh()
                })
            })

            const bTop =()=>{
                bscroll.scrollTo(0,0,300)
            }

            const itemClick =(id)=>{
                router.push({path:'./detail',query:{id:id}})
            }

            return {
                activeKey,
                categories,
                activeName,
                active,
                tabClick,
                currentOrder,
                currentCid,
                getGoods,
                goods,
                showGoods,
                bscroll,
                isShowBackTop,
                bTop,
                itemClick,
            }
        },
        components: {
            NavBar,
            BackTop
        },
    }
</script>

<style scope lang="scss">
    #mainbox{
        margin-top: 45px;
        display: flex;
        .ordertab{
            flex: 1;
            float: right;
            height: 50px;
            z-index: 9;
            position: fixed;
            top: 45px;
            right: 0;
            left: 130px;
        }

        .leftmenu{
            position: fixed;
            top: 95px;
            left: 0;
            width: 130px;
        }

        .goodslist{
            // 让这个占后面所有的区域
            flex:1;
            position: absolute;
            top: 100px;
            left: 130px;
            right: 0px;
            height: 100vh;
            padding: 10px;

            .van-card__content{
                text-align: left !important;
            }
        }
    }
    .van-image__img{
        width:68px;
    }
</style>