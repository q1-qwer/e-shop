<template>
    <div>
        <nav-bar class="nav-bar">
            <template v-slot:default>   <!-- 读取vuex状态管理中声明的变量 -->
                购物车(<span style="color:red">{{$store.state.cartCount}}</span>)
            </template>
        </nav-bar>

        <div class="cart-box">
            <div class="cart-body">
                <!-- 双向绑定（列表） 每一次点击子选项都会通过group的change事件调用前端checkedCart接口来访问后端修改数据-->
                <van-checkbox-group ref="checkboxGroup" @change="groupChange" v-model="result"> 
                <!-- 在整个group中做的双向绑定 result中的数据会影响页面中复选框的选择状态 -->
                <!-- v-model绑定是result 不是list -->
                    
                    <van-swipe-cell :right-width="50"
                     v-for="(item,index) in list" :key="index"
                    ><!-- SwipeCell 滑动单元格 -->   <!-- item是list数组中的一个商品对象，包含这个商品的所有信息 -->
                        
                        <div class="good-item">

                            <!-- 商品选中后，后端接口会按照购物车表中每一次的change事件选中的商品id，
                                 修改数据库表中对应商品的状态（所以选中商品后刷新页面数据也不会消失） -->
                            <van-checkbox :name="item.id"/>  <!-- 双向绑定（复选框） -->

                            <div class="good-img"><img v-lazy="item.goods.cover_url" alt=""></div>
                            <div class="good-desc">
                                <div class="good-title">
                                    <span>{{item.goods.title}}</span>
                                    <span>×{{item.goods.stock}}</span>
                                </div>
                                <div class="good-btn">
                                    <div class="price"><small>￥</small>{{item.goods.price + '.00'}}</div>
                                    <!-- 通过 v-model='value' 绑定输入值，可以通过 change 事件监听到输入值的变化。 -->
                                    <!-- 如果需要异步地修改输入框的值，可以设置 async-change 属性，并在 change 事件中手动修改 value。 -->
                                    <!-- 即：在页面中的输入框里直接修改值，或者使用按钮修改，都需要在change事件中手动修改item.num -->
                                    <van-stepper integer :min="1" :max="item.goods.stock" 
                                    :model-value="item.num" :name="item.id" async-change 
                                    @change="onChange"/>  <!-- name可以取item.id，即对应不同商品的id，不重复即可 -->
                                    <!-- 使用函数在服务器中同步页面上修改的值 -->
                                </div>
                            </div> 
                        </div>
                        <!-- 数据绑定指的是，模型中声明的变量可以在模板中使用 -->
                        <template #right>
                            <van-button
                                  square
                                  icon="delete"
                                  type="danger"
                                  class="delete-button"
                                  @click="deleteGood(item.id)"
                            />
                        </template>
                    </van-swipe-cell>

                    
                </van-checkbox-group>
            </div>

            <van-submit-bar class="submit-all" :price="total * 100" @submit="onSubmit" button-text="结算">
                <van-checkbox @click="allCheck" v-model:checked="checkAll">全选</van-checkbox>
            </van-submit-bar>

            <div class="empty" v-if="!list.length">
                <img class="empty-cart" src="~assets/images/empty-car.png" alt="空购物车">
                <div class="title">购物车空空如也</div>
                <van-button round color="#1baeae" type="primary" block @click="goTo">前往选购</van-button>
            </div>

        </div>
    </div>
</template>

<script>
    import { toRefs, reactive, onMounted, computed} from 'vue'
    import {  Toast } from 'vant'
    import { useRouter } from 'vue-router'
    import { useStore } from 'vuex'  
    import { getCart, modifyCart, checkedCart, deleteCartItem} from 'network/cart'
    import NavBar from 'components/common/navbar/NavBar'

    export default {
        name: "ShopCart",
        setup() {
            const router = useRouter()
            const store = useStore()

            // 数据模型
            const state = reactive({
                list: [],  // 所有加入购物车中的商品——是初始化购物车时从数据库得到的数据
                result: [],  // 选中的购物车中商品的id，与模板双向绑定，可以从模板中得到用户勾选的商品id
                checkAll: true,  // 是否全选
            })
            // 初始化购物车数据
            const init = () => {                // forbidClick:true  开启禁用背景点击
                Toast.loading({message:'加载中...',forbidClick:true})
                // include=goods 获取更多数据
                getCart('include=goods').then(res=>{
                    state.list = res.data // data数组中有若干个对象（每个对象都包含了本购物车的信息及一个商品的信息）
                    console.log(res);
                    console.log(res.data)
                    // 把选中的商品id放入result   is_checked属性是后端数据的属性
                    state.result = res.data.filter(n=>n.is_checked == 1).map(item => item.id)
                    // 这里的响应式默认已经帮我们实现好了
                    Toast.clear()
                })
            }
            
            // 每次刷新页面都会执行初始化操作
            onMounted(()=>{
                init()
            })

            // 通过计算属性计算总价
            const total = computed(()=>{
                let sum = 0
                state.list.filter(item=>state.result.includes(item.id))
                    .forEach(item =>{
                        sum += parseInt(item.num)*parseFloat(item.goods.price)
                    })

                return sum
            })
            
            // 异步改变购物车数量，组件会自动传入步进器中修改后的数量和修改的商品    【1.改页面/模板】
            const onChange =(value,detail)=>{
                // 通过Toast解决点击太快产生的死锁问题
                Toast.loading({message:'修改中...',forbidClick:true})
                // 改变数据库中购物车里的商品数据                               【2.改数据库——使数据不在刷新后丢失】
                modifyCart(detail.name,{num:value}).then(res=>{
                    console.log(res)
                    // 遍历更新客户端购物车中商品的数量————在onMonted中的list中的num也要改
                    // 后期计算价格在客户端中声明的变量state中计算
                    // 筛选出所有勾选的商品；
                    state.list.forEach(item => {                           // 【3.改模型——不重新初始化购物车就不会更新数量】
                        if(item.id == detail.name){
                            item.num = value
                        }
                    })
                })
                Toast.clear()
            }
            // 复选框改变处理——————change事件
            // 单个复选框勾选状态影响全选框状态
            // 复选框改变处理——change事件会把每次改变后的结果全部存入result
            const groupChange = (result) => {  // 【1. 改页面/模板 】
            // 每一次改变会把双向绑定的数据result默认传进来
                if(result.length == state.list.length){
                    state.checkAll = true
                }else{
                    state.checkAll = false
                }
                console.log(result)
                // result改变后需要更新result           【2. 改模型 】
                state.result = result
                // 把需要设置为选中的商品id提交给服务器   【3. 改数据库 】
                checkedCart({cart_ids:result})  // 购物车id:选中的商品的数组
            }

            // 全选框勾选状态影响复选框状态——————click事件
            const allCheck =()=>{             // 【1. 改页面/模板 】
                if(!state.checkAll){
                     // 遍历列表，拿到列表中所有的id存入result    【2. 改模型 】
                    state.result = state.list.map(item=>item.id)
                    state.checkAll = true
        // 每一次全选/全不选都会让复选框有改变，那么就会调用groupChange，【3. 从而改变服务器】
                }else{
                    state.result = []
                    state.checkAll = false
                }  
            }

            // 前往购物
            const goTo = () => {
                router.push({path:'/home'})
            }

            // 删除商品（业务逻辑：删除之后初始化）
            const deleteGood =(id)=>{               // 【1. 改页面/模板 】
                deleteCartItem(id).then(res=>{      // 【2. 改数据库 】
                    console.log(res);
                    init() // 初始化                 // 【3. 改模型 】
                    store.dispatch('updateCart')     // 【4. 改vuex中的状态——————商品总数需要在顶部显示】
                })
            }

            // 创建订单，在订单中支付
            const onSubmit =()=>{
                // result中是选中的id
                if(state.result.length == 0){
                    Toast.fail('请选择商品进行结算')
                    return
                }else{  // 商品、数量、价钱，全在数据库表中生成，页面数据只用于展示，所以不用传数据
                    router.push({path:'/createorder'})
                }
            }

            return {
                ...toRefs(state),
                goTo,
                onChange,
                groupChange,
                allCheck,
                deleteGood,
                total,
                onSubmit,
            }
        },
        components: {
            NavBar
        },
    }
</script>

<style scope lang="scss">
    .cart-box{
        .cart-body{
            margin: 60px 0 100px 0;
            padding-left: 10px;
            .good-item{
                display: flex;
            }
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
                display:flex;
                justify-content: space-between;
                .price{
                    font-size:16px;
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
    
    .delete-button{
        width: 50px;
        height: 100px;
      }
    }
    .empty{
        width: 50%;
        margin: 0 auto;
        text-align: center;
        margin-top: 200px;
        .empty-cart{
            width: 150px;
            margin-bottom: 20px;
        }
        .van-icon-smile-o{
            font-size: 50px;
        }
        .title{
            font-size: 16px;
            margin-bottom: 20px;
        }
    }
    .submit-all{
        margin-bottom: 50px;
        .van-checkbox{
            margin-left: 0px;
        }
        .van-submit-bar__text{
            margin-right: 10px;
        }
        .van-submit-bar__button{
            background: red;
        }
    }
    .van-checkbox__icon-checked .van-icon{
        background-color: red;
        border-color: red;

    }
    
</style>