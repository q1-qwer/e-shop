<template>
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>
                我的订单
            </template>
        </nav-bar>
        <!-- 点击时调用onChangeTab方法，对应每个选项中的name（如果没有设置name，就自动把序列号传入） -->
        <van-tabs ref="tabs" @click="onChangeTab" class="order-tab">
            <van-tab title="全部"></van-tab>   <!-- 不指定默认是0 -->
            <van-tab title="代付款"></van-tab> <!-- 不指定默认是1 -->
            <van-tab title="已支付"></van-tab>
            <van-tab title="发货"></van-tab>
            <van-tab title="交易完成"></van-tab>
            <van-tab title="过期"></van-tab>
        </van-tabs>
        <div class="content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
                <van-list
                 v-model:loading="loading"
                 :finished="finished"
                 finished-text="没有更多了"
                 @load="onLoad"
                 @offset="10"
                >   <!-- 遍历所有订单并展示 -->
                    <div @click="goTo(item.id)" class="order-item-box" v-for="(item,index) in list" :key="index">
                        <div class="order-item-header">
                            <span style="line-height:30px">订单号：{{item.order_no}}<br>创建时间：{{item.created_at}}</span>
                        </div>
                        <!-- 遍历每一个订单的每一个商品 -->
                        <van-card v-for="sub in item.orderDetails.data" :key="sub.id"
                            :num="sub.num"
                            :price="sub.price+'.00'"
                            desc="描述信息"
                            :title="sub.goods.title"
                            thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
                        />
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>
    </div>
</template>

<script> 
    import NavBar from 'components/common/navbar/NavBar'
    import { onMounted, reactive, toRefs} from 'vue'
    import { getOrderList } from 'network/order'
    import { useRouter } from 'vue-router';
    /* 
        List 组件通过 loading 和 finished 两个变量控制加载状态，
        当组件滚动到底部时，会触发load事件并自动将loading设置成true；
        此时可以发起异步操作并更新数据，数据更新完毕后，在onLoad函数中手动将loading设置成false即可；
        若数据已全部加载完毕，则直接将finished设置成true即可。 
    */

    export default {
        name: "Order",
        setup() {
            const router = useRouter()
            // let tabs = ref(null)
            const state = reactive({
                loading: false,    // true 开始加载，false 停止加载
                finished: false,   // true 加载完毕停止加载， false 加载中
                refreshing: false, // true 处于加载状态，false 不处于加载状态
                list: [],
                page: 1,
                totalPage: 0,
                status: 0,
            })
            
            onMounted(()=>{
                onRefresh()
            })
            
            // 单独提出来可以多次加载每一页的数据：
            // 让页数+1可以加载后几页的数据； 让status的状态改变可以加载不同状态分类的订单列表
            const loadData =()=>{
                // 不加include参数拿到的是订单的外层，加了以后可以拿到买了哪些商品
                getOrderList({page:state.page,status:state.status,include:'orderDetails.goods'}).then(res=>{
                    state.list = state.list.concat(res.data) // 在列表中追加数据
                    state.loading = false  // 设置数据更新完成

                    state.totalPage = res.meta.pagination.total_pages // 设置总页数
                    // 判断当前类型的数据是否全部加载完
                    if(state.page >= state.totalPage){
                        state.finished = true  // 设置数据加载完成，此时不能加载数据
                    }
                    console.log(state.totalPage+'@@@@')
                })
            }
            
            const onLoad =()=>{ 

                // 【 每次到底部时调用 】
                //    如果不是第一次加载，且当前页面小于总页数
                if(!state.refreshing && state.page < state.totalPage){
                    // 第一次以后，每一次刷新状态都为假，如果不到最后一页，都会让当前page+1
                    state.page += 1  
                }

                // 【 页面第一次挂载时调用 】
                if(state.refreshing){ 
                    // 第一次刷新时，需要清除当前页面的列表
                    state.list = [] 
                    // 设置刷新状态为完成，可以开始加载数据 
                    state.refreshing = false  
                }
                loadData()
            }

            // 【页面第一次挂载时调用】
            const onRefresh = () => {
                // 将刷新状态设置为true，表示开始刷新
                // 页面挂载只有一次，这个状态只设置一次，第一页加载完后，以后都是false
                state.refreshing = true
                // 将加载完成状态设置为false，表示可以加载数据
                state.finished = false
                // 将开始加载设置为true，表示开始加载数据
                state.loading = true
                // 初始化当前页面为第一页，避免切换选项卡（每次页面挂载）时无法从第一页加载
                state.page = 1
                onLoad()
            }
            // tab 切换状态，name由选项卡自动传入
            const onChangeTab =(name)=>{
                state.status = name
                // 改变模型中status的数据，从而在请求接口时传入不同的status，请求到不同状态的列表
                onRefresh()
            }

            // 到订单详情页
            const goTo = (id) =>{
                router.push({path:'/orderdetail',query:{id}})
            }

            return {
                ...toRefs(state),
                onLoad,
                onRefresh,
                onChangeTab,
                goTo,
            }
        },
        components: {
            NavBar
        },
    }
</script>

<style lang="scss" scoped>
    .order-tab{
        margin-top: 45px;
    }
</style>
