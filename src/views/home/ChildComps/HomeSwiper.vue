<template>
    <!-- 自动3000ms轮播 -->
    <van-swipe v-if="banners.length" class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item,index) in banners" :key="index">
            <!-- 使用v-lazy代替:src来设置图片路径 -->
            <img v-lazy="item.img_url" alt="">
        </van-swipe-item>
    </van-swipe>
</template>

<script>
    export default {
        name: "HomeSwiper",
        props:{
            banners:Array,
            default(){
                return []
            }
        },
        setup() {
            
            return {
                
            }
        }
    }
</script>

<style scoped lang="scss">
    img{
        width: 100%;
        height: 160px !important;
    }

</style>