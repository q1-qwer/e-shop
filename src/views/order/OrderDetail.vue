<template>
    <div class="order-detail-box">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                订单详情
            </template>
        </nav-bar>

        <div class="order-status">
            <div class="status-item">
                <label>订单状态：</label>
                <span>{{statusString}}</span>
            </div>
            <div class="status-item">
                <label>订单编号：</label>
                <span>{{detail.order_no}}</span>
            </div>
            <div class="status-item">
                <label>下单时间：</label>
                <span>{{detail.created_at}}</span>
            </div>
            <van-button v-if="detail.status == 1" @click="showPayFn" style="margin-bottom:10px" color="#1baeae" block>去支付</van-button>
            <van-button v-if="detail.status == 1" @click="showConfirmOrder" block>确认订单</van-button>
        </div>
        <div class="order-price">
            <div class="price-item">
                <label>商品金额：</label>
                <span>{{total + '.00'}}</span>
            </div>
            <div class="price-item">
                <label>配送方式：</label>
                <span>普通快递</span>
            </div>
        </div>
        <van-card
            v-for="item in detail.orderDetails.data" :key="item.id"
            :num="item.num"
            :price="item.price+'.00'"
            desc="描述信息"
            :title="item.goods.title"
            thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
        />
        <!-- <div style="width:100%;height:50px"> -->
    </div>

    <van-popup
            closeable
            :close-on-click-overlay="false"
            v-model:show="showPay"
            position="bottom"
            :style="{ height: '40%' }"
            @click="close"
        >
            <van-grid :border="false" :column-num="2" square>
                <van-grid-item>
                    支付宝二维码<br>
                    <van-image :src="aliyu" />
                </van-grid-item>
                <van-grid-item>
                    微信二维码<br>
                    <van-image :src="wechat" />
                </van-grid-item>
            </van-grid>
    </van-popup>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { onMounted, reactive, toRefs, computed} from 'vue'
    import { getOrderDetail, payOrder, payOrderStatus, confirmOrder } from 'network/order'
    import { Toast, Dialog } from 'vant';
    import { useRoute, useRouter } from 'vue-router';
    import { clearInterval } from 'timers';
    
    // 路由器是用来跳转的，路由用来结收参数
    export default {
        name: "OrderDetail",
        setup() {
            const route = useRoute()
            const router = useRouter()

            const state = reactive({
                orderNo: '',  // 订单id
                detail: {
                    orderDetails:{
                        data:[]
                    }
                },
                showPay:false,
                aliyun:'',
                wechat:''
            })

            // 初始化不包含支付状态的订单信息
            const init = () =>{
                const {id} = route.query  // route对象中有多个参数时可以使用解构的方式来接收参数
                state.orderNo = id

                getOrderDetail(id).then(res=>{
                    console.log(res)
                    state.detail = res
                    console.log(res.orderDetails);
                })
            }

            onMounted(()=>{
                Toast.loading({sessage:'加载中...',forbidClick:true}) // forbidClick设置可以点击背景
                init()
                Toast.clear()
            })
            // 订单状态
            const statusString = computed(()=>{
                // 1下单 2支付 3发货 4收货 5过期
                let status = ['','已下单','已支付','等待发货','确认收货','已过期']
                return status[state.detail.status]
            })
            // 商品价格
            const total = computed(()=>{
                let  sum = 0
                state.detail.orderDetails.data.forEach(item=>{
                    sum += item.num*item.price
                })
                return sum
            })

            // 支付订单
            const showPayFn = () =>{
                state.showPay = true
                console.log('打印ID');
                console.log(state.orderNo);

                // 需要从接口传来的预览订单
                payOrder(state.orderNo,{type:'aliyun'}).then(res=>{
                    // state.aliyun = res.qr_code_url
                    console.log(res)
                    // 这里在测试时可以直接跳转到订单支付完成
                })
                // 轮询查看订单支付状态——每隔2s执行一次查看支付状态的接口
                const timer = setInterval(()=>{
                    payOrderStatus(state.orderNo).then(res=>{
                        if(res=='2'){
                            clearInterval(timer)
                            state.showPay = false
                            // 可以调用init或者跳给自己
                            router.push({path:'/orderdetail',query:{status:2}})
                        } 
                        // 支付完成后，自动关闭轮询、支付遮罩层
                    })
                },2000)    
            }

            // 确认订单
            const showConfirmOrder = () =>{
                Dialog.confirm({
                    title:'是否确认订单？'
                // 提示对话框是结合promise的，确认后进入then
                }).then(()=>{
                    confirmOrder(state.orderNo).then(res=>{
                        // 如果服务器发货了，那么可以确认
                        if(res.status_code == 204){
                            Toast('确认成功')
                            // 确认完成后重新初始化
                            init()
                        }
                    })
                })
            }
            // 定义关闭对话框的函数
            const close = () => {
                Dialog.close()
            }

            return {
                ...toRefs(state),
                statusString,
                total,
                showPayFn,
                showConfirmOrder,
                close,
            }
        },
        components: {
            NavBar
        },
    }
</script>

<style lang="scss" scoped>
    .order-detail-box{
        text-align: left;
        background: #f7f7f7;
        margin-top: 45px;
        label{
            color: rgb(156, 152, 152);
        }
        .order-status{
            padding: 15px;
            .status-item{
                padding-bottom: 10px;
            }
            background: white;
        }
        .order-price{
            padding: 25px 15px;
            background: white;
            margin: 20px 0;
        }
    }
</style>
