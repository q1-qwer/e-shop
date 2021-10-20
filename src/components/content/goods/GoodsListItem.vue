<template>
    <div class="goods-item" @click="itemClick">
        <img v-lazy="product.cover_url" alt="">
        <div class="goods-info">
            <p>{{product.title}}</p>
            <span class="price"><small>￥</small>{{product.price}}</span>
            <span class="collect">{{product.collects_count}}</span>
        </div>
    </div>
</template>

<script>
    import {useRouter} from 'vue-router'

    export default {
        name: "GoodsListItem",
        props:{
            product:Object,
            default(){
                return
            }
        },
/*       setup的两个注意点
         1.  setup的执行时机： 在beforeCreate之前执行一次，this是undefined；
         2.  setup的参数：
                  ① props：值为对象，包含组件外部传递过来，且组件内部声明接收了的属性；
                  ② context：上下文对象：
                            attrs：值为对象，包含：组件外部传递过来，但没有在props配置中声明的属性，相当于this.$attrs。
                            slots：收到的插槽内容，相当于this.$slots。
                            emit：分发自定义事件的函数，相当于 this.$emit。
*/ 
        setup(props){  // setup中也能接收到传过来的属性
            const router = useRouter()
            return{
                itemClick:()=>{
                    router.push({path:'./detail',query:{id:props.product.id}})
                }
            }
        }

    }
</script>

<style scope lang="scss">
    .goods-item{
        width: 46%;
        padding-bottom: 40px;
        position: relative;

        img{
            width: 100%;
            border-radius: 5px;
        }

        .goods-info{
            font-size: 12px;
            position: absolute;
            bottom: 5px;
            left: 0;
            right:0;
            overflow: hidden;
            text-align: center;

            p{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 3px;
            }
            .price{
                color: red;
                margin-right: 20px;
            }
            .collect{
                position: relative;
            }
            .collect::before {
                content: '';
                position: absolute;
                left: -15px;
                width: 14px;
                height: 14px;
                top: -1px;
                background: url('~assets/images/collect.png') 0 0/14px 14px;
            }
        }
    }
    
</style>