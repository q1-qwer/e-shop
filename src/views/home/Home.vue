<template>
    <div id="home">
        <nav-bar class="nav-bar">
            <!-- 在vue2中，插槽可以随便使用，在vue3，需要使用template -->
            <template v-slot:default>图书兄弟</template>
        </nav-bar>

        <tab-control 
        @tabClick="tabClick" 
        :titles="['畅销','新书','精选']"
        v-show="isTabFixed"
        ></tab-control>
                <!-- 点击后将会把数据传给子组件tab-control，子组件触发tabClick并传来index参数；
                在本函数中执行tabClick事件，能获得temid数据，拿到index数据后就可以按照类型从数据库中获取数据了； -->

        <!-- 使用better-scroll插件实现下拉滚动效果;外层wrapper高度固定;内层content高度不限 -->
        <div class="wrapper">
            <div class="content">
                <div ref="banref">
                    <home-swiper :banners="banners"></home-swiper>
                    <!-- 使用属性的方式传递变量，属性名可以自定义 -->
                    <recommend-view :recommends="recommends"></recommend-view>
                    <tab-control @tabClick="tabClick" :titles="['畅销','新书','精选']"></tab-control>
                </div>
                
                <!-- 把从接口请求过来的数据通过参数的方式传给子组件最后传给孙组件 -->
                <goods-list :goods="showGoods"></goods-list>
            </div>
        </div>
        <!-- 给组件绑定单击响应事件时，需要加上.native 或者使用自定义事件代替-->
        <back-top 
        v-show="isShowBackTop"
        @bTop="bTop"          
        ></back-top>
    </div>
</template>

<script>
    import HomeSwiper from './ChildComps/HomeSwiper'
    import NavBar from 'components/common/navbar/NavBar'
    import RecommendView from './ChildComps/RecommendView'
    import TabControl from 'components/content/tabControl/TabControl'
    import GoodsList from 'components/content/goods/GoodsList'
    import BackTop from 'components/common/backtop/BackTop'
    import {getHomeAllData,getHomeGoods} from 'network/home'
    import {ref,reactive,computed,onMounted,watchEffect,nextTick} from 'vue'
    import BScroll from 'better-scroll'



    export default {
        name: "Home",
        setup() {
/* ----------------------------------------------------------------------------- */
            let isTabFixed = ref(false)
            let isShowBackTop = ref(false)
            let banref = ref(null)
            const recommends = ref([])
            // 商品列表数据模型
            const goods  = reactive({
                // 先指定数据类型，用类型做（对象中的属性的键名）每一条数据的下标
                sales:{page:1,list:[]},
                new:{page:1,list:[]},
                recommend:{page:1,list:[]}
            })
            
            let bscroll = reactive({})
            // 只传递一个类型的数据给子组件
            let currentType = ref('sales')
            const showGoods = computed(()=>{
                return goods[currentType.value].list
            })

            let banners = ref([])
/* ----------------------------------------------------------------------------- */
            onMounted(()=>{
                // 在页面挂载完之后拿到首页的所有数据进行处理
                getHomeAllData().then(res=>{
                    // 变量是从数据库中取过来后赋值给上面声明的变量的
                    recommends.value = res.goods.data
                    banners.value = res.slides
                    // console.log(res.slides);
                })

                // 从接口中获得数据
                getHomeGoods('sales').then(res=>{
                    goods.sales.list = res.goods.data;
                })
                getHomeGoods('recommend').then(res=>{
                    goods.recommend.list = res.goods.data;
                })
                getHomeGoods('new').then(res=>{
                    goods.new.list = res.goods.data;
                })
                
                /* 【创建bscroll对象】 【通过'on'绑定滚动事件】 【通过'on'绑定上拉加载更多事件】 */

                // 通过DOM元素创建BetterScroll对象,里面必须加载一个DOM元素（第一个参数），和初始化配置设置
                // ————不能直接在setup中创建，需要在DOM元素挂载成功后创建
                bscroll = new BScroll(document.querySelector('.wrapper'),{
                    probeType: 3, // 0,1,2,3  3表示只要在运动就触发scroll事件
                    click: true,  // 是否允许点击——在滚动区域如果有链接是默认不生效的
                    pullUpLoad: true// 是否允许上拉加载更多，默认是false不允许
                })
                
                // 上拉加载数据，需要使用pullingUp函数
                bscroll.on('pullingUp',()=>{
                    console.log('上拉加载更多。。。')
                    // 从数据模型中获取当前页的类型中的页数
                    const page = goods[currentType.value].page + 1
                    console.log(page);
                    // 获取到当前页数之后，可以通过getHomeGoods得到当前页的商品数据
                    getHomeGoods(currentType.value,page).then(res=>{
                        goods[currentType.value].list.push(...res.goods.data)
                        goods[currentType.value].page += 1
                    })
                    // 完成上拉，等数据请求完成，要将新数据展示出来
                    bscroll.finishPullUp()
                    // 【3.计算高度】数据展示出来，每次拉动就会调用这个函数重新计算高度，来设置滚动
                    bscroll.refresh()
                    // 内容的高度是变化的，客户端高度
                    console.log('contentheight：'+document.querySelector('.content').clientHeight)
                    console.log('当前类型: '+currentType.value+',当前页：'+page);
                })

                // 给BetterScroll对象绑定滚动事件
                bscroll.on('scroll',(position)=>{
                    // console.log(banref.value)  可以获取这个DOM元素本身偏移量的高度
                    // console.log('!!!!!!!!!'+banref.value.offsetHeight);
                    // 监听滚动位置，利用位置来设置事件
                    // console.log(-position.y)
                    // 当滚动的高度和tab-control上方到顶部的高度一致时，让上方选项卡的显示
                    isTabFixed.value = (-position.y) > banref.value.offsetHeight
                    isShowBackTop.value = (-position.y) > banref.value.offsetHeight
                })

                // 【2.计算高度】onmount执行完，加载完异步数据，每次都重新计算一下这个高度
                nextTick(()=>{
                    bscroll && bscroll.refresh()
                    console.log('nextTick函数调用了');
                })
            })

            const tabClick = (index) => {
                let types = ['sales','new','recommend']
                currentType.value = types[index]
                nextTick(()=>{
                    bscroll && bscroll.refresh()
                })
            }
            // 【1.计算高度】监听任何一个变量有变化——只要页面有变化就需要调用refresh()来重新计算高度
            watchEffect(()=>{
                // 当数据变化且页面也变化后，即DOM元素渲染完毕后，重新计算变化高度
                nextTick(()=>{
    /* 在一个事件中，当前一个数据改变后并不会立即更新DOM，而是会等这个事件中所有数据都改变后才执行操作；
                       nextTick可以实现更改一个数据后立即对该数据绑定的DOM进行更新操作； */
                    // nextTick在这里是实现数据变化后让页面也变化的
                    
                    // 高度变化后需要触发‘重新计算内容区域高度’的事件
                    // 判断bscroll是否存在
                    bscroll && bscroll.refresh()
                })
            })

            const bTop = ()=>{
                console.log(111);
                bscroll.scrollTo(0,0,500)
            }

            return {
                recommends,
                tabClick,
                goods,
                showGoods,
                isTabFixed,
                isShowBackTop,
                banref,
                bTop,
                banners
            }
        },
        components: {
            HomeSwiper,
            NavBar,
            RecommendView,
            TabControl,
            BackTop,
            GoodsList
        },
    }
</script>

<style scope>
    .banners{
        width:100%;
        height:auto;
        /* margin-top:45px; */
    }
    #home{
        height:100vh; /* 占领整个屏幕区域的高度 */
        position: relative;
    }
    .wrapper{
        position: absolute;
        top:45px;
        bottom:50px;
        left:0px;
        right:0px;
        overflow: hidden;
        
    }
</style>
 