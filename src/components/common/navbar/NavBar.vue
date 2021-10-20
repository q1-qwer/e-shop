<template>
    <div class="nav-bar">
        <div class="left" @click="goBack">
            <slot name="left">  <!-- 设置插槽默认值，应用到所有组件 -->
                <img src="~assets/images/left.png" alt="">
            </slot>
        </div>

        <div class="center"><slot>EWShop</slot></div>
        <div class="right"><slot name="right"></slot></div>
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'
    export default {
        name: "NavBar",
        setup() {
            // 添加一个goBack方法，回退需要用到导航，使用路由器
            // 获取路由器
            const router = useRouter()

            const goBack = () => {
                router.go(-1) /* 历史模式，跳转上一次访问的页面 */
            }
            return {
                goBack
            }
        }
    }
</script>

<style>
    .nav-bar{
        display:flex;
        background-color:var(--color-tint);
        color:#FFFFFF;
        position:fixed;/* 位置需要固定 */
        left:0;
        right:0;
        top:0;
        z-index:9; /*固定顶部导航条位置*/ 

        height:45px;
        line-height:45px;
        text-align:center;
        box-shadow:0 2px 0 rgba(100,100,100,0.1);
    }
    .left,.right{
        width:60px;
    }
    .left img{
        width:45px;
        padding:12px;
    }
    .center{
        flex:1; /* 在弹性盒布局中，让中间部分沾满整个区域 */
    }
</style>
