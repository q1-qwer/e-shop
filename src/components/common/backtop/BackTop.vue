<template>
    <div class="backTop" @click="backtop"></div>
</template>

<script>
//   setup的参数：
//         props：值为对象，包含组件外部传递过来，且组件内部声明接收了的属性；
//         context：上下文对象；
//             attrs：值为对象，包含：组件外部传递过来，但没有在props配置中声明的属性，
//                    相当于this.$attrs。
//             slots：收到的插槽内容，相当于this.$slots。
//             emit：分发自定义事件的函数，相当于 this.$emit。

    export default {
        name: "BackTop",
        setup(props,{emit}) { 
            return {
                backtop:()=>{
                    emit('bTop')
                }
            }
        }
    }
</script>

<style>
    .backTop{
        width: 42px;
        height: 42px;
        position: fixed;
        bottom: 80px;
        right: 30px;
        z-index: 20px;
        box-shadow: 5px 5px #888888;
        border-radius: 50%;
        background: #FCFCFC url('~assets/images/up.png') no-repeat center center;
    }
</style>
