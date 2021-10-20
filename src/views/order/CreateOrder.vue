<template>
    <div class="create-order">
        <nav-bar class="nav-bar">
            <template v-slot:default>
                订单预览
            </template>
        </nav-bar>
        
        <div class="address-wrap">
            <div class="name">
                <span>{{address.name}}</span>
                <span>{{address.phone}}</span>
            </div>
            <div class="address">
                {{address.province}}{{address.city}}{{address.county}}{{address.address}}
            </div>
            <van-icon @click="goTo" class="arrow" name="arrow" />
        </div>
        <div class="good">
            <div class="good-item" v-for="(item,index) in cartList" :key="index">
                <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
                <div class="good-desc">
                    <div class="good-title">
                        <span>{{item.goods.title}}</span>
                        <span>{{item.num}}</span>
                    </div>
                    <div class="good-btn">
                        <div class="price"><small>￥</small>{{item.goods.price+'.00'}}</div>
                    </div>
                </div>
            </div>
        </div>

        <van-submit-bar 
                class="submit-all"
                :price="total*100" 
                button-text="生成订单" 
                @submit="handleCreateOrder"
        >
            商品金额
        </van-submit-bar>

        <van-popup
            closeable
            :close-on-click-overlay="false"
            v-model:show="showPay"
            position="bottom"
            :style="{ height: '40%' }"
            @click="close"
        >
            <!-- <div :style="{ width:'90%',margin:'0 auto',padding:'50px 0'}">
                <van-button :style="{ marginBottom:'10px'}" color="#1989fa" block>
                    支付宝支付
                </van-button>
                <van-button color="#4fc08d" block>
                    微信支付
                </van-button>
            </div> -->
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
    </div>
</template>

<script>
    import NavBar from 'components/common/navbar/NavBar'
    import { onMounted, reactive, toRefs, computed} from 'vue'
    import { useRouter} from 'vue-router' //, useRoute 
    import { useStore } from 'vuex'  
    import { getOrderPreview, createOrder, payOrderStatus, payOrder} from 'network/order'
    import { Toast } from 'vant'
    export default {
        name: "CreateOrder",
        setup() {
            const store = useStore()
            const router = useRouter()
            // const route = useRoute()
            // toRefs可以批量创建多个ref对象，这些对象可以在模板中直接使用
            const state = reactive({
                cartList:[],  //购物车选中的商品列表
                address: {},  //默认地址信息
                showPay: false, // 是否显示弹出层
                orderNo:'',
                aliyu:'',
                wechat:''
            })
            // 在onMounted中拿到的数据可能需要在别的地方使用，所以，可以定义一个init函数来初始化数据
            const init = () => {
                Toast.loading({message:'加载中...',forbidClick:true})

                getOrderPreview().then(res=>{
                    console.log(res);
                    let address = res.address.filter(n=>n.is_default == '1')
                    if(address.length == 0){
                        state.address = {
                            address:'还没有设置默认地址，请选择或添加地址信息'
                        }
                    }else{
                        state.address = address[0]
                    }
                    state.cartList = res.carts
                    Toast.clear()
                })
            }
            // 计算选中商品的总价
            const total = computed(()=>{
                let sum = 0
                state.cartList.forEach(item => {
                    sum += parseInt(item.num)*parseFloat(item.goods.price)
                })
                return sum
            })
            
            onMounted(() => {
                init()
            })

            const goTo =()=> {
                router.push({path:'/address'})
            }

            const handleCreateOrder =()=>{
                // 先获取默认收货地址（已存入state）的id形成参数
                const params = {
                    address_id : state.address.id
                }
                createOrder(params).then(res=>{
                    Toast('创建订单成功')
                    // 订单创建完成后，后端会直接删除购物车中加入订单的商品，所以需要调用更新购物车的方法
                    store.dispatch('updateCart')
                    state.showPay = true  // 是否显示弹出层

                    state.orderNo = res.id  //订单id
                    payOrder(state.orderNo,{type:'aliyun'}).then(res=>{
                        console.log(res);
                        console.log(state.orderNo);
                        let str = res.qr_code_url   
                        var reg = /\?[time=]*[0-9]*/i
                        // var str = "/storage/qr_code/678e3a19559fad58830e471222bd50ca.png?time=1633503010";
                        // var patt1 = /\?[time=]*[0-9]*/i;
                        let _str = str.replace(reg,"")
                        console.log(_str);
                        str = 'https://api.shop.eduwork.cn'+_str
                        console.log(str);
                        console.log(typeof str);
                        state.aliyu = str
                    })

                    // 按照参数中提交的支付类型获取二维码
                    // payOrder(state.orderNo,{type:'wechat'}).then(res=>{
                    //     console.log(res);
                    //     state.wechat = res.qr_code_url
                    // })

                    // 轮询查看——每隔2s执行一次查看支付状态的接口
                    const timer = setInterval(()=>{
                        payOrderStatus(state.orderNo).then(res=>{
                            // if(res=='2'){
                            //     clearInterval(timer)
                            //     router.push({path:'/orderdetail',query:{status:2}})
                            // }
                            console.log(res);
                            clearInterval(timer)
                            router.push({path:'/orderdetail',query:{status:2}})
                        })
                    },2000)
                })
            }
            

            return {
                ...toRefs(state),
                goTo,
                total,
                handleCreateOrder,
            }
        },
        components: {
            NavBar
        },
    }
</script>

<style scope lang="scss">
    .create-order{
        background: #f9f9f9;
        .address-wrap{
            text-align: left;
            margin-bottom: 20px;
            background: #fff;
            position: relative;
            margin-top: 44px;
            font-size: 14px;
            padding: 15px;
            color: #222333;

            .name,.address{
                margin: 10px 0;
            }
            .arrow{
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 20px;
            }
            &::before{
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 2px;
                // CSS3特效开发【渐变图案之老式信封边框】Repeating-linear-gradient在边框中的独特运用
                // background: -webkit-repeating-linear-gradient(135deg,#ff6c6c 0,#ff6c6c 20%,transparent 0,transparent 25%,#1989fa 0,#1989fa 20%,transparent 0,transparent 25%);
                // background: repeating-linear-gradient(-45deg,#ff6c6c 0,#ff6c6c 1em,transparent 0,transparent 2em,#1989fa 0,#1989fa 3em,transparent 0,transparent 4em);
                background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 10%, transparent 20%, transparent 20%, #1989fa 0, #1989fa 30%, transparent 40%, transparent 50%);
                // background: repeating-linear-gradient(145deg,#ff6c6c,#1989fa 20%);
                background-size: 80px;
                content: '';
            }
        }
        .good{
            margin-bottom: 120px;
        }
        .good-item{
            padding: 10px;
            background: #fff;
            display: flex;
            .good-img{
                img{
                    width: 100px;
                    height: auto;
                }
            }
            .good-desc{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;
                padding: 20px;
                .good-title{
                    display: flex;
                    justify-content: space-between;
                }
                .good-btn{
                    display: flex;
                    justify-content: space-between;
                    .price{
                        font-size: 16px;
                        color: red;
                        line-height: 28px;
                    }
                    .van-icon-delete{
                        font-size: 20px;
                        margin-top: 4px;
                    }
                }
            }
        }
        .pay-wrap{
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: #fff;
            padding: 10px 0;
            padding-bottom: 50px;
            border-top: 1px solid #e9e9e9;
        }
        &div{
            display: flex;
            justify-content: space-between;
            padding: 0 5%;
            margin: 10px 0;
            font-size: 14px;
            span:nth-child(2){
                color: red;
                font-size: 18px;
            }
        }
        .pay-btn{
            position: fixed;
            bottom: 7px;
            right: 0;
            left: 0;
            width: 90%;
            margin: 0 auto;
        }
    }
    .submit-all{
        margin-bottom: 50px;
        z-index: 9 !important;
    }
</style>