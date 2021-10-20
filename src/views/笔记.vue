<template>
    <div class="home">
        <div class="demo1">this is a text</div>
        <div id="demo"></div>


        <!-- 引入图片的2种方法 -->
        <!-- 1. 字符串格式： 模板里想启用别名需要加上~ -->
        <img alt="" src="~assets/images/ebook1.png" />

        <!-- 2. 变量格式：  默认会把""中的内容当成字符串，所以需要加上:，变成变量 -->
        <img alt="" :src="imgsrc">


        <HelloWorld msg="Welcome to Your Vue.js App" />
    </div>
</template>

<script>
    import HelloWorld from "@/components/HelloWorld.vue";

    export default {
        name: "Home",
        data(){
            return{
                // 打包图片，图片也是一个模块，需要require，打包的时候回把图片编译成bit64?
                imgsrc:require('assets/images/ebook2.png')
            }
        },
        components: {
            HelloWorld,
        },
    }
</script>

<style>
    #demo{
        /* 样式中想启用别名需要加上~ */
        background: url('~assets/images/ebook3.png');
        width: 100px;
        height: 100px;
    }
    .demo1{
      color:var(--color-high-text);
    }
</style>
