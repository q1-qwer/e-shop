<template>
    <div class="goods">   <!-- key只要是不重复的就可以，在这里可以写item -->
    <!-- 把从父组件接收到的goods遍历后用product传给子组件 -->
        <goods-list-item v-for="item in goods" :key="item" :product="item"></goods-list-item>
    </div>
</template>

<script>
    import GoodsListItem from './GoodsListItem'
    export default {
        name: "GoodsList",
        props:{
            goods:{
                type:Array,
                default(){
                    return[]
                }
            }
        },
        components: {
            GoodsListItem
        },
    }
</script>

<style scope lang="scss">
    .goods{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        padding: 5px;

    }
    
</style>